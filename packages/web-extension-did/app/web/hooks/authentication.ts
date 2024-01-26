import { useCallback } from 'react';
import { VerifyTokenParams } from '@portkey-wallet/types/types-ca/authentication';
import { getGoogleUserInfo, parseAppleIdentityToken, parseTelegramToken } from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useWalletInfo } from 'store/Provider/hooks';
import { useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';

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

export function useVerifyToken() {
  const verifyGoogleToken = useVerifyGoogleToken();
  const verifyAppleToken = useVerifyAppleToken();
  const verifyTelegram = useVerifyTelegram();
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
      }
      return func({
        operationDetails: JSON.stringify({ manager: latestVerifyManagerAddress.current }),
        ...params,
      });
    },
    [latestVerifyManagerAddress, verifyAppleToken, verifyGoogleToken, verifyTelegram],
  );
}
