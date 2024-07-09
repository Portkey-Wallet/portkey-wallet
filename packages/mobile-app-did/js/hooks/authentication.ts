import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
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
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useInterface } from 'contexts/useInterface';
import { checkIsUserCancel, handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { changeCanLock } from 'utils/LockManager';
import { AppState } from 'react-native';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import TelegramOverlay from 'components/OauthOverlay/telegram';
import FacebookOverlay from 'components/OauthOverlay/facebook';
import { parseTelegramToken } from '@portkey-wallet/utils/authentication';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';
import {
  ReportUnsetLoginGuardianProps,
  VerifyTokenParams,
  VerifyZKLoginParams,
} from '@portkey-wallet/types/types-ca/authentication';
import { ZKJwtAuthInfo } from '@portkey-wallet/types/verifier';
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

if (!isIOS) {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });
} else {
  WebBrowser.maybeCompleteAuthSession();
}

export function useGoogleAuthentication() {
  const [androidResponse, setResponse] = useState<any>();
  const [{ googleRequest, response, promptAsync }] = useInterface();
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
      } as TGoogleAuthResponse;
    }
    const message =
      info.type === 'cancel' ? '' : 'It seems that the authorization with your Google account has failed.';
    throw { ...info, message };
  }, [promptAsync, googleRequest?.codeVerifier]);

  const androidPromptAsync = useCallback(async () => {
    // sleep show loading
    await sleep(500);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // google services are available
    } catch (err) {
      throw Error('Portkey‘s services are not available in your device.');
    }
    try {
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      await GoogleSignin.signOut();
      const googleResponse = { ...userInfo, ...token } as TGoogleAuthResponse;
      setResponse(googleResponse);
      return googleResponse;
    } catch (error: any) {
      const message = error.code === statusCodes.SIGN_IN_CANCELLED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Google account has failed.';
      throw { ...error, message };
    }
  }, []);

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
    const { jwt, salt, kid, nonce } = params;
    const proofParams = { jwt, salt };
    console.log('aaaa proofParams : ', proofParams);
    const proofResult = await customFetch('https://zklogin-prover-sha256.aelf.dev/v1/prove', {
      method: 'POST',
      headers: {
        Accept: 'text/plain;v=1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proofParams),
    });
    console.log('aaaa proofResult : ', proofResult);

    const verifyParams = {
      identifierHash: proofResult.identifierHash,
      salt,
      nonce,
      kid,
      proof: proofResult.proof,
    };
    console.log('aaaa verifyParams : ', verifyParams);
    const verifyResult = await customFetch('https://zklogin-prover-sha256.aelf.dev//v1/verify', {
      method: 'POST',
      headers: {
        Accept: 'text/plain;v=1.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyParams),
    });

    console.log('aaaa verifyResult : ', verifyResult);
    if (verifyResult.valid) {
      const zkJwtAuthInfo: ZKJwtAuthInfo = {
        identifierHash: verifyParams.identifierHash,
        salt: verifyParams.salt,
        zkProof: verifyParams.proof,
        jwt: jwt ?? '',
        nonce: nonce ?? '',
      };
      return { zkJwtAuthInfo };
    } else {
      throw new Error('zkLogin verification failed');
    }
  }, []);
}

export function useVerifyGoogleToken() {
  const { googleSign } = useGoogleAuthentication();
  const verifyZKLogin = useVerifyZKLogin();
  const [{ googleAuthNonce }] = useInterface();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let isRequest = !accessToken;
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
        if (userInfo.user.id !== params.id) throw new Error('Account does not match your guardian');
      }
      const idTokenArr = params.idToken?.split('.') ?? [];
      const spilt1 = Buffer.from(idTokenArr[0], 'base64').toString('utf8');
      const { kid } = JSON.parse(spilt1) || {};
      try {
        const rst = await verifyZKLogin({
          jwt: params.idToken,
          salt: randomId(),
          kid,
          nonce: googleAuthNonce,
        });
        console.log('aaaa rst : ', rst);
        return {
          ...rst,
          accessToken,
        };
      } catch (error) {
        console.log('aaaa error : ', error);
        throw error;
      }
    },
    [googleAuthNonce, googleSign, verifyZKLogin],
  );
}

export function useVerifyAppleToken() {
  const { appleSign } = useAppleAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await appleSign();
        accessToken = info.identityToken || undefined;
      }
      const { userId } = parseAppleIdentityToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');

      const rst = await request.verify.verifyAppleToken({
        params: { ...params, accessToken },
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [appleSign],
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
        id: guardianItem.guardianAccount,
        verifierId: guardianItem.verifier?.id,
        chainId: originChainId,
        operationType,
      });
    },
    [verifyToken],
  );
}
