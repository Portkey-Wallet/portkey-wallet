import * as WebBrowser from 'expo-web-browser';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
import * as Application from 'expo-application';
import { AccessTokenRequest, makeRedirectUri } from 'expo-auth-session';
import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { AppleUserInfo, getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { AppState } from 'react-native';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import NetworkContext, { NetworkContextState } from 'pages/Login/context/NetworkContext';
import { appleLogin } from './apple-login';
import { NetworkController } from 'network/controller';
import { APPLE_CLIENT_ID, APPLE_MAIN_REDIRECT_URI, APPLE_TESTNET_REDIRECT_URI } from 'utils/const';

if (!isIOS) {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });
} else {
  WebBrowser.maybeCompleteAuthSession();
}

export type GoogleAuthentication = {
  accessToken: string;
  idToken?: string;
  user: {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photo: string;
  };
};

export type AppleAuthentication = {
  user: AppleUserInfo & {
    id: string;
  };
  identityToken: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
};

export type GoogleAuthResponse = GoogleAuthentication;
export function useGoogleAuthentication() {
  const [androidResponse, setResponse] = useState<any>();
  const [googleRequest, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    shouldAutoExchangeCode: false,
  });
  const iosPromptAsync: () => Promise<GoogleAuthResponse> = useCallback(async () => {
    await sleep(2000);
    if (AppState.currentState !== 'active') throw { message: '' };
    const info = await promptAsync();
    if (info.type === 'success') {
      const exchangeRequest = new AccessTokenRequest({
        clientId: Config.GOOGLE_IOS_CLIENT_ID ?? '',
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
      } as GoogleAuthResponse;
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
      const googleResponse = { ...userInfo, ...token } as GoogleAuthResponse;
      setResponse(googleResponse);
      return googleResponse;
    } catch (error: any) {
      const message = error.code === statusCodes.SIGN_IN_CANCELLED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Google account has failed.';
      throw { ...error, message };
    }
  }, []);

  const googleSign = useCallback(async () => {
    try {
      return await (isIOS ? iosPromptAsync : androidPromptAsync)();
    } finally {
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
  const [response, setResponse] = useState<AppleAuthentication>();
  const [androidResponse, setAndroidResponse] = useState<AppleAuthentication>();
  const { currentNetwork } = useContext<NetworkContextState>(NetworkContext);

  useEffect(() => {
    if (isIOS) return;
    appleAuthAndroid.configure({
      clientId: APPLE_CLIENT_ID,
      redirectUri: currentNetwork?.networkType === 'MAINNET' ? APPLE_MAIN_REDIRECT_URI : APPLE_TESTNET_REDIRECT_URI,
      scope: appleAuthAndroid.Scope.ALL,
      responseType: appleAuthAndroid.ResponseType.ALL,
    });
  }, [currentNetwork]);

  const iosPromptAsync = useCallback(async () => {
    setResponse(undefined);
    try {
      // const appleInfo = await appleAuth.performRequest({
      //   requestedOperation: appleAuth.Operation.LOGIN,
      //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      // });
      const appleLoginToken = await appleLogin();
      const appleInfo = {
        identityToken: appleLoginToken as string,
      };

      const user = parseAppleIdentityToken(appleInfo.identityToken);
      /*
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
      }*/
      const userInfo = { ...appleInfo, user: { ...user, id: user?.userId } } as AppleAuthentication;
      setResponse(userInfo);
      return userInfo;
    } catch (error: any) {
      console.log(error, '======error');

      const message = error?.code === appleAuth.Error.CANCELED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Apple ID has failed.';
      throw { ...error, message };
    }
  }, []);

  const androidPromptAsync = useCallback(async () => {
    setAndroidResponse(undefined);
    try {
      const appleInfo = await appleAuthAndroid.signIn();
      const user = parseAppleIdentityToken(appleInfo.id_token);
      console.log(appleInfo, '======appleInfo');
      if (appleInfo.user?.name?.lastName) {
        try {
          // TODO replace this
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
      } as AppleAuthentication;
      setAndroidResponse(userInfo);
      return userInfo;
    } catch (error: any) {
      const message = error?.message === appleAuthAndroid.Error.SIGNIN_CANCELLED ? '' : handleErrorMessage(error);
      // : 'It seems that the authorization with your Apple ID has failed.';
      throw { ...error, message };
    }
  }, []);

  const appleSign = useCallback(async () => {
    try {
      return await (isIOS ? iosPromptAsync : androidPromptAsync)();
    } finally {
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

export type VerifyTokenParams = {
  accessToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
};

export function useVerifyGoogleToken() {
  const { googleSign } = useGoogleAuthentication();
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
      const rst = await NetworkController.verifyGoogleGuardianInfo({
        ...params,
        accessToken: accessToken || '',
        verifierId: params.verifierId || '',
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [googleSign],
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

      const rst = await NetworkController.verifyAppleGuardianInfo({
        ...params,
        accessToken: accessToken || '',
        verifierId: params.verifierId || '',
      });

      return {
        ...rst,
        accessToken,
      };
    },
    [appleSign],
  );
}
export function useVerifyToken() {
  const verifyGoogleToken = useVerifyGoogleToken();
  const verifyAppleToken = useVerifyAppleToken();
  return useCallback(
    (type: LoginType, params: VerifyTokenParams) => {
      return (type === LoginType.Apple ? verifyAppleToken : verifyGoogleToken)(params);
    },
    [verifyAppleToken, verifyGoogleToken],
  );
}
