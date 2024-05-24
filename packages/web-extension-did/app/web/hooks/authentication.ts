import { useCallback } from 'react';
import { ReportUnsetLoginGuardianProps, VerifyTokenParams } from '@portkey-wallet/types/types-ca/authentication';
import {
  getGoogleUserInfo,
  parseAppleIdentityToken,
  parseFacebookToken,
  parseTelegramToken,
  parseTwitterToken,
} from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useWalletInfo } from 'store/Provider/hooks';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';

export function useVerifyGoogleToken() {
  const { currentNetwork } = useWalletInfo();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let isRequest = !accessToken;
      if (accessToken) {
        try {
          const { id } = await getGoogleUserInfo(accessToken);
          if (!id) isRequest = true;
        } catch (error) {
          isRequest = true;
        }
      }
      if (isRequest) {
        const googleInfo = await socialLoginAction('Google', currentNetwork);
        accessToken = googleInfo?.data?.access_token;
        const { id } = await getGoogleUserInfo(accessToken as string);
        console.log(id, params, googleInfo, 'socialVerifyHandler===id');
        if (id !== params.id) throw new Error('Account does not match your guardian');
      }
      return request.verify.verifyGoogleToken({
        params: { ...params, accessToken },
      });
    },
    [currentNetwork],
  );
}

export function useVerifyAppleToken() {
  const { currentNetwork } = useWalletInfo();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await socialLoginAction('Apple', currentNetwork);
        accessToken = info?.data?.access_token || undefined;
      }
      const { userId } = parseAppleIdentityToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');
      delete (params as any).id;
      return request.verify.verifyAppleToken({
        params: { ...params, accessToken },
      });
    },
    [currentNetwork],
  );
}

export function useVerifyTelegram() {
  const { currentNetwork } = useWalletInfo();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseTelegramToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await socialLoginAction('Telegram', currentNetwork);
        accessToken = info?.data?.access_token || undefined;
      }
      const { userId } = parseTelegramToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');
      delete (params as any).id;
      return request.verify.verifyTelegramToken({
        params: { ...params, accessToken },
      });
    },
    [currentNetwork],
  );
}

export function useVerifyTwitter() {
  const { currentNetwork } = useWalletInfo();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let tokenInfo = params.accessToken;

      const { isExpired: tokenIsExpired, accessToken: token } = parseTwitterToken(tokenInfo) || {};
      if (!token || tokenIsExpired) {
        const info = await socialLoginAction('Twitter', currentNetwork);
        tokenInfo = info?.data?.access_token;
      }

      const { userId, accessToken } = parseTwitterToken(tokenInfo) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');
      delete (params as any).id;
      return request.verify.verifyTwitterToken({
        params: { ...params, accessToken },
      });
    },
    [currentNetwork],
  );
}

export function useVerifyFacebook() {
  const { currentNetwork } = useWalletInfo();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let tokenInfo = params.accessToken;

      const { isExpired: tokenIsExpired, accessToken: token } = (await parseFacebookToken(tokenInfo)) || {};
      if (!token || tokenIsExpired) {
        const info = await socialLoginAction('Facebook', currentNetwork);
        tokenInfo = info?.data?.access_token || undefined;
      }
      const { userId, accessToken } = (await parseFacebookToken(tokenInfo)) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');
      delete (params as any).id;
      return request.verify.verifyFacebookToken({
        params: { ...params, accessToken },
      });
    },
    [currentNetwork],
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
  const verifyTelegram = useVerifyTelegram();
  const verifyTwitter = useVerifyTwitter();
  const verifyFacebook = useVerifyFacebook();
  const verifyManagerAddress = useVerifyManagerAddress();
  const latestVerifyManagerAddress = useLatestRef(verifyManagerAddress);

  return useCallback(
    (type: LoginType, params: VerifyTokenParams) => {
      let func = verifyAppleToken;
      if (type === LoginType.Apple) {
        func = verifyAppleToken;
      } else if (type === LoginType.Google) {
        func = verifyGoogleToken;
      } else if (type === LoginType.Telegram) {
        func = verifyTelegram;
      } else if (type === LoginType.Twitter) {
        func = verifyTwitter;
      } else if (type === LoginType.Facebook) {
        func = verifyFacebook;
      }
      return func({
        operationDetails: JSON.stringify({ manager: latestVerifyManagerAddress.current }),
        ...params,
      });
    },
    [latestVerifyManagerAddress, verifyAppleToken, verifyFacebook, verifyGoogleToken, verifyTelegram, verifyTwitter],
  );
}

export function useAuthSocialAccountInfo(type: ISocialLogin) {
  const currentNetwork = useCurrentNetwork();
  return useCallback(async () => {
    const result = await socialLoginAction(type, currentNetwork);
    let identityToken = result.data?.access_token ?? '';
    let userInfo;
    if (type === 'Google') {
      userInfo = await getGoogleUserInfo(identityToken);
    }
    if (type === 'Apple') {
      userInfo = parseAppleIdentityToken(identityToken) ?? {};
    }
    if (type === 'Telegram') {
      userInfo = parseTelegramToken(identityToken) ?? {};
    }
    if (type === 'Twitter') {
      userInfo = parseTwitterToken(identityToken) ?? {};
    }
    if (type === 'Facebook') {
      userInfo = (await parseFacebookToken(identityToken)) ?? {};
      identityToken = userInfo.accessToken;
    }

    return {
      identityToken,
      user: {
        id: userInfo?.userId,
      },
    };
  }, [currentNetwork, type]);
}
