import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Linking } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
import * as Application from 'expo-application';
import { AccessTokenRequest, makeRedirectUri } from 'expo-auth-session';
import { request } from '@portkey-wallet/api/api-did';
import {
  getGoogleUserInfo,
  parseAppleIdentityToken,
  parseFacebookToken,
  parseTwitterToken,
} from '@portkey-wallet/utils/authentication';
import { randomId } from '@portkey-wallet/utils';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { LoginType, SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { checkIsUserCancel, handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { changeCanLock } from 'utils/LockManager';
import { AppState } from 'react-native';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import TelegramOverlay from 'components/OauthOverlay/telegram';
import FacebookOverlay from 'components/OauthOverlay/facebook';
import { parseTelegramToken, parseKidFromJWTToken } from '@portkey-wallet/utils/authentication';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';
import {
  ReportUnsetLoginGuardianProps,
  VerifyTokenParams,
  VerifyZKLoginParams,
} from '@portkey-wallet/types/types-ca/authentication';
import { ZKLoginInfo } from '@portkey-wallet/types/verifier';
import { onAndroidFacebookAuthentication, onTwitterAuthentication } from 'utils/authentication';
import {
  TAppleAuthentication,
  IAuthenticationSign,
  TGoogleAuthResponse,
  TVerifierAuthParams,
} from 'types/authentication';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import generateRandomNonce from '@portkey-wallet/utils/nonce';
import AElf from 'aelf-sdk';
import queryString from 'query-string';
import Loading from 'components/Loading';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuthentication() {
  const subscriptionRef = useRef<any>();
  const [androidResponse, setResponse] = useState<any>();
  const [googleAuthNonce] = useState(generateRandomNonce());
  const [googleRequest, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    shouldAutoExchangeCode: false,
    extraParams: {
      nonce: googleAuthNonce,
    },
  });
  const iosPromptAsync: () => Promise<TGoogleAuthResponse> = useCallback(async () => {
    await sleep(2000);
    if (AppState.currentState !== 'active') throw { message: '' };
    const info = await promptAsync();
    if (info.type === 'success') {
      const exchangeRequest = new AccessTokenRequest({
        clientId: Config.GOOGLE_IOS_CLIENT_ID,
        redirectUri: makeRedirectUri({
          native: `${Application.applicationId}:/oauthredirect`,
        }),
        code: info.params.code,
        extraParams: {
          code_verifier: googleRequest?.codeVerifier || '',
        },
      });
      const authentication = await exchangeRequest.performAsync(Google.discovery);

      const userInfo = await getGoogleUserInfo(authentication?.accessToken);
      return {
        user: {
          ...userInfo,
          photo: userInfo.picture,
          familyName: userInfo.family_name,
          givenName: userInfo.given_name,
        },
        ...authentication,
        nonce: googleAuthNonce,
      } as TGoogleAuthResponse;
    }
    const message =
      info.type === 'cancel' ? '' : 'It seems that the authorization with your Google account has failed.';
    throw { ...info, message };
  }, [promptAsync, googleRequest?.codeVerifier, googleAuthNonce]);

  useEffect(() => {
    return () => {
      subscriptionRef.current && subscriptionRef.current.remove();
      subscriptionRef.current = null;
    };
  }, [subscriptionRef.current]);

  const androidGoogleSignin = useCallback(
    (authUrl: string): Promise<{ type: string; params: { access_token: string; id_token: string } }> => {
      return new Promise((resolve, reject) => {
        subscriptionRef.current && subscriptionRef.current.remove();
        subscriptionRef.current = null;

        // WebBrowser.openBrowserAsync(authUrl);
        Linking.openURL(authUrl);
        Loading.hide(); // hide loading because the loading will be shown when back from the browser and not select any account
        subscriptionRef.current = Linking.addEventListener('url', (event: any) => {
          const { url } = event;
          if (url && url.length > 0) {
            const parsedUrl = queryString.parseUrl(url);
            const paramsObject: any = parsedUrl.query;
            if (paramsObject.id_token && paramsObject.access_token) {
              Loading.show(); // show loading when back from the browser and select account
              resolve({ type: 'success', params: paramsObject });
            } else {
              reject({
                type: 'error',
                message: 'It seems that the authorization with your Google account has failed.',
              });
            }
          }
        });
      });
    },
    [],
  );

  const androidPromptAsync = useCallback(async () => {
    // sleep show loading
    await sleep(500);
    const redirectUri = 'https://test.portkey.finance/google-auth';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=id_token%20token&scope=openid%20email%20profile&prompt=select_account&client_id=${Config.GOOGLE_WEB_CLIENT_ID}&redirect_uri=${redirectUri}&nonce=${googleAuthNonce}&service=lso&o2v=2&ddm=0&flowName=GeneralOAuthFlow`;
    const info = await androidGoogleSignin(authUrl);
    if (info.type === 'success') {
      const userInfo = await getGoogleUserInfo(info.params?.access_token);
      return {
        user: {
          ...userInfo,
          photo: userInfo.picture,
          familyName: userInfo.family_name,
          givenName: userInfo.given_name,
        },
        accessToken: info.params?.access_token,
        idToken: info.params?.id_token,
        nonce: googleAuthNonce,
      } as TGoogleAuthResponse;
    }
    const message =
      info.type === 'cancel' ? '' : 'It seems that the authorization with your Google account has failed.';
    throw { ...info, message };
  }, [androidGoogleSignin, googleAuthNonce]);

  const googleSign = useCallback(async () => {
    changeCanLock(false);
    try {
      return await (isIOS ? iosPromptAsync : androidPromptAsync)();
    } finally {
      changeCanLock(true);
    }
  }, [androidPromptAsync, iosPromptAsync]);

  return useMemo(
    () => ({
      googleResponse: isIOS ? response : androidResponse,
      googleSign,
    }),
    [androidResponse, googleSign, response],
  );
}

export function useAppleAuthentication() {
  const [response, setResponse] = useState<TAppleAuthentication>();
  const [androidResponse, setAndroidResponse] = useState<TAppleAuthentication>();
  const isMainnet = useIsMainnet();
  const [nonce] = useState(generateRandomNonce());

  useEffect(() => {
    if (isIOS) return;
    appleAuthAndroid.configure({
      clientId: Config.APPLE_CLIENT_ID,
      redirectUri: isMainnet ? Config.APPLE_MAIN_REDIRECT_URI : Config.APPLE_TESTNET_REDIRECT_URI,
      scope: appleAuthAndroid.Scope.ALL,
      responseType: appleAuthAndroid.ResponseType.ALL,
      nonce,
    });
  }, [isMainnet, nonce]);

  const iosPromptAsync = useCallback(async () => {
    setResponse(undefined);
    try {
      const appleInfo = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        nonce,
      });

      const user = parseAppleIdentityToken(appleInfo.identityToken);
      if (appleInfo.fullName?.familyName) {
        try {
          await request.verify.sendAppleUserExtraInfo({
            params: {
              identityToken: appleInfo.identityToken,
              userInfo: {
                name: {
                  firstName: appleInfo.fullName?.givenName,
                  lastName: appleInfo.fullName?.familyName,
                },
                email: user?.email || appleInfo.email,
              },
            },
          });
        } catch (error) {
          console.log(error, '======error');
        }
      }
      const userInfo = {
        ...appleInfo,
        user: { ...user, id: user?.userId },
        idToken: appleInfo.identityToken,
        nonce: AElf.utils.sha256(appleInfo.nonce),
      } as TAppleAuthentication;
      setResponse(userInfo);
      return userInfo;
    } catch (error: any) {
      console.log(error, '======error');

      const message = error?.code === appleAuth.Error.CANCELED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Apple ID has failed.';
      throw { ...error, message };
    }
  }, [nonce]);

  const androidPromptAsync = useCallback(async () => {
    setAndroidResponse(undefined);
    try {
      const appleInfo = await appleAuthAndroid.signIn();
      const user = parseAppleIdentityToken(appleInfo.id_token);
      if (appleInfo.user?.name?.lastName) {
        try {
          await request.verify.sendAppleUserExtraInfo({
            params: {
              identityToken: appleInfo.id_token,
              userInfo: {
                name: {
                  firstName: appleInfo.user.name.firstName,
                  lastName: appleInfo.user.name.lastName,
                },
                email: user?.email || appleInfo.user.email,
              },
            },
          });
        } catch (error) {
          console.log(error, '======error');
        }
      }
      const userInfo = {
        identityToken: appleInfo.id_token,
        idToken: appleInfo.id_token,
        fullName: {
          givenName: appleInfo.user?.name?.firstName,
          familyName: appleInfo.user?.name?.lastName,
        },
        user: { ...user, id: user?.userId },
        nonce: AElf.utils.sha256(appleInfo.nonce),
      } as TAppleAuthentication;
      setAndroidResponse(userInfo);
      return userInfo;
    } catch (error: any) {
      const message = error?.message === appleAuthAndroid.Error.SIGNIN_CANCELLED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Apple ID has failed.';
      throw { ...error, message };
    }
  }, []);

  const appleSign = useCallback(async () => {
    changeCanLock(false);
    try {
      return await (isIOS ? iosPromptAsync : androidPromptAsync)();
    } finally {
      changeCanLock(true);
    }
  }, [androidPromptAsync, iosPromptAsync]);

  return useMemo(
    () => ({
      appleResponse: isIOS ? response : androidResponse,
      appleSign,
    }),
    [androidResponse, appleSign, response],
  );
}

export function useTelegramAuthentication() {
  // todo: add Telegram authentication
  return useMemo(
    () => ({
      appleResponse: '',
      telegramSign: TelegramOverlay.sign,
    }),
    [],
  );
}

const onFacebookAuthentication = async () => {
  try {
    return await (isIOS ? FacebookOverlay.sign : onAndroidFacebookAuthentication)();
  } catch (error) {
    if (checkIsUserCancel(error)) throw new Error('');
    throw error;
  }
};

export function useFacebookAuthentication() {
  return useMemo(
    () => ({
      appleResponse: '',
      // facebookSign: ,
      facebookSign: onFacebookAuthentication,
    }),
    [],
  );
}

export function useTwitterAuthentication() {
  return useMemo(
    () => ({
      appleResponse: '',
      twitterSign: onTwitterAuthentication,
    }),
    [],
  );
}
export function useAuthenticationSign() {
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();
  const { telegramSign } = useTelegramAuthentication();
  const { twitterSign } = useTwitterAuthentication();
  const { facebookSign } = useFacebookAuthentication();
  return useCallback<IAuthenticationSign['sign']>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type => {
      switch (type) {
        case LoginType.Google:
          return googleSign();
        case LoginType.Apple:
          return appleSign();
        case LoginType.Telegram:
          return telegramSign();
        case LoginType.Twitter:
          return twitterSign();
        case LoginType.Facebook:
          return facebookSign();
        default:
          throw new Error('Unsupported login type');
      }
    },
    [appleSign, googleSign, telegramSign, twitterSign, facebookSign],
  );
}

export function useVerifyZKLogin() {
  return useCallback(async (params: VerifyZKLoginParams) => {
    const { verifyToken, jwt, salt, kid, nonce } = params;
    const proofParams = { jwt, salt };
    console.log('useVerifyZKLogin params: ', proofParams);
    const proofResult = await customFetch('https://zklogin-prover-dev.aelf.dev/v1/prove', {
      method: 'POST',
      headers: {
        Accept: 'text/plain;v=1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proofParams),
    });

    const verifyParams = {
      identifierHash: proofResult.identifierHash,
      salt,
      nonce,
      kid,
      proof: proofResult.proof,
    };

    const portkeyVerifyResult = await request.verify.verifyZKLogin({
      params: {
        ...verifyToken,
        poseidonIdentifierHash: proofResult.identifierHash,
        salt,
      },
    });

    console.log('portkeyVerifyResult : ', portkeyVerifyResult);

    const zkProof = decodeURIComponent(verifyParams.proof);
    const zkLoginInfo: ZKLoginInfo = {
      identifierHash: portkeyVerifyResult.guardianIdentifierHash,
      poseidonIdentifierHash: verifyParams.identifierHash,
      identifierHashType: 1,
      salt: verifyParams.salt,
      zkProof,
      jwt: jwt ?? '',
      nonce: nonce ?? '',
      circuitId: proofResult.circuitId,
    };
    return { zkLoginInfo };
  }, []);
}

export function useVerifyGoogleToken() {
  const { googleSign } = useGoogleAuthentication();
  const verifyZKLogin = useVerifyZKLogin();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let idToken = params.idToken;
      let isRequest = !accessToken;
      let nonce = params.nonce;
      if (accessToken) {
        try {
          const { id } = await getGoogleUserInfo(accessToken);
          if (!id || id !== params.id) isRequest = true;
        } catch (error) {
          isRequest = true;
        }
      }
      if (isRequest) {
        const userInfo = await googleSign();
        accessToken = userInfo?.accessToken;
        idToken = userInfo?.idToken;
        nonce = userInfo?.nonce;
        if (userInfo.user.id !== params.id) throw new Error('Account does not match your guardian');
      }
      if (!idToken) {
        throw new Error('Invalid idToken');
      }
      const rst = await verifyZKLogin({
        verifyToken: {
          type: SocialLoginEnum.Google,
          accessToken,
          verifierId: params.verifierId,
          chainId: params.chainId,
          operationType: params.operationType,
        },
        jwt: idToken,
        salt: params.salt ? params.salt : randomId(),
        kid: parseKidFromJWTToken(idToken),
        nonce,
      });
      return {
        ...rst,
        accessToken,
      };
    },
    [googleSign, verifyZKLogin],
  );
}

export function useVerifyAppleToken() {
  const { appleSign } = useAppleAuthentication();
  const verifyZKLogin = useVerifyZKLogin();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let idToken = params.idToken;
      let nonce = params.nonce;
      const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await appleSign();
        accessToken = info.identityToken || undefined;
        idToken = info.idToken;
        nonce = info.nonce;
      }
      const { userId } = parseAppleIdentityToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');

      if (!idToken) {
        throw new Error('Invalid idToken');
      }
      const rst = await verifyZKLogin({
        verifyToken: {
          type: SocialLoginEnum.Apple,
          accessToken,
          verifierId: params.verifierId,
          chainId: params.chainId,
          operationType: params.operationType,
        },
        jwt: idToken,
        salt: params.salt ? params.salt : randomId(),
        kid: parseKidFromJWTToken(idToken),
        nonce,
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [appleSign, verifyZKLogin],
  );
}
export function useVerifyTelegramToken() {
  const { telegramSign } = useTelegramAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseTelegramToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await telegramSign();
        accessToken = info.accessToken || undefined;
      }
      const { userId } = parseTelegramToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');

      const rst = await request.verify.verifyTelegramToken({
        params: { ...params, accessToken },
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [telegramSign],
  );
}

export function useVerifyTwitterToken() {
  const { twitterSign } = useTwitterAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseTwitterToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await twitterSign();
        accessToken = info.accessToken || undefined;
      }
      const { userId, accessToken: accessTwitterToken } = parseTwitterToken(accessToken) || {};

      if (userId !== params.id) throw new Error('Account does not match your guardian');

      const rst = await request.verify.verifyTwitterToken({
        params: { ...params, accessToken: accessTwitterToken },
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [twitterSign],
  );
}

export function useVerifyFacebookToken() {
  const { facebookSign } = useFacebookAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = (await parseFacebookToken(accessToken)) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await facebookSign();
        accessToken = info.accessToken || undefined;
      }
      const { userId, accessToken: accessFacebookToken } = (await parseFacebookToken(accessToken)) || {};

      if (userId !== params.id) throw new Error('Account does not match your guardian');

      const rst = await request.verify.verifyFacebookToken({
        params: { ...params, accessToken: accessFacebookToken },
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [facebookSign],
  );
}

export function useReportUnsetLoginGuardian() {
  return useCallback(async (params: ReportUnsetLoginGuardianProps): Promise<boolean> => {
    const res = await request.verify.reportUnsetLoginGuardian({
      params: { ...params },
    });
    return !!res;
  }, []);
}

export function useVerifyToken() {
  const verifyGoogleToken = useVerifyGoogleToken();
  const verifyAppleToken = useVerifyAppleToken();
  const verifyTelegramToken = useVerifyTelegramToken();
  const verifyTwitterToken = useVerifyTwitterToken();
  const verifyFacebookToken = useVerifyFacebookToken();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);
  return useCallback(
    (type: LoginType, params: VerifyTokenParams) => {
      let fun = verifyGoogleToken;
      switch (type) {
        case LoginType.Google:
          fun = verifyGoogleToken;
          break;
        case LoginType.Apple:
          fun = verifyAppleToken;
          break;
        case LoginType.Telegram:
          fun = verifyTelegramToken;
          break;
        case LoginType.Twitter:
          fun = verifyTwitterToken;
          break;
        case LoginType.Facebook:
          fun = verifyFacebookToken;
          break;
        default:
          throw new Error('Unsupported login type');
      }
      return fun({
        operationDetails: JSON.stringify({ manager: latestVerifyManagerAddress.current }),
        ...params,
      });
    },
    [
      verifyGoogleToken,
      latestVerifyManagerAddress,
      verifyAppleToken,
      verifyTelegramToken,
      verifyTwitterToken,
      verifyFacebookToken,
    ],
  );
}
export function useVerifierAuth() {
  const verifyToken = useVerifyToken();
  return useCallback(
    async ({
      guardianItem,
      originChainId,
      operationType = OperationTypeEnum.communityRecovery,
      authenticationInfo,
    }: TVerifierAuthParams) => {
      return verifyToken(guardianItem.guardianType, {
        accessToken: authenticationInfo?.[guardianItem.guardianAccount],
        idToken: authenticationInfo?.idToken,
        nonce: authenticationInfo?.nonce,
        salt: guardianItem?.salt,
        id: guardianItem.guardianAccount,
        verifierId: guardianItem.verifier?.id,
        chainId: originChainId,
        operationType,
      });
    },
    [verifyToken],
  );
}
