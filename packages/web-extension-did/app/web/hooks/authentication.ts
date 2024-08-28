import { useCallback } from 'react';
import {
  ReportUnsetLoginGuardianProps,
  VerifyTokenParams,
  VerifyZKLoginParams,
} from '@portkey-wallet/types/types-ca/authentication';
import { ZKLoginInfo } from '@portkey-wallet/types/verifier';
import {
  getGoogleUserInfo,
  parseAppleIdentityToken,
  parseFacebookToken,
  parseTelegramToken,
  parseTwitterToken,
  parseKidFromJWTToken,
} from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { randomId } from '@portkey-wallet/utils';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { ISocialLogin, LoginType, SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { useWalletInfo } from 'store/Provider/hooks';
import { useCurrentWalletInfo, useVerifyManagerAddress } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useCurrentNetwork, useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { zkloginGuardianType } from 'constants/guardians';
import { VerifyTypeEnum } from 'types/wallet';

export function useVerifyZKLogin() {
  const { zkLoginVerifyUrl = 'https://zklogin-prover.portkey.finance/v1/prove' } = useCurrentNetworkInfo();
  return useCallback(
    async (params: VerifyZKLoginParams) => {
      const { verifyToken, jwt, salt, kid, nonce, timestamp, managerAddress } = params;
      const proofParams = { jwt, salt };
      console.log('useVerifyZKLogin params: ', proofParams);
      const proofResult = await customFetch(zkLoginVerifyUrl, {
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
        timestamp,
        managerAddress,
      };
      return { zkLoginInfo };
    },
    [zkLoginVerifyUrl],
  );
}

export function useVerifyGoogleToken() {
  const { currentNetwork } = useWalletInfo();
  const verifyZKLogin = useVerifyZKLogin();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let idToken = params.idToken;
      let nonce = params.nonce;
      let timestamp = params.timestamp;
      const managerAddress = params.operationDetails ? JSON.parse(params.operationDetails).manager : '';
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
        const _verifyExtraParams = { managerAddress: managerAddress ?? '' };
        const googleInfo = await socialLoginAction(
          'Google',
          currentNetwork,
          VerifyTypeEnum.zklogin,
          _verifyExtraParams,
        );
        accessToken = googleInfo?.data?.access_token;
        idToken = googleInfo?.data?.id_token;
        nonce = googleInfo?.data?.nonce;
        timestamp = googleInfo?.data?.timestamp;
        const { id } = await getGoogleUserInfo(accessToken as string);
        console.log(id, params, googleInfo, 'socialVerifyHandler===id');
        if (id !== params.id) throw new Error('Account does not match your guardian');
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
        timestamp: timestamp ?? 0,
        managerAddress,
      });
      return rst as any;
    },
    [currentNetwork, verifyZKLogin],
  );
}

export function useVerifyAppleToken() {
  const { currentNetwork } = useWalletInfo();
  const verifyZKLogin = useVerifyZKLogin();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let idToken = params.idToken;
      let nonce = params.nonce;
      let timestamp = params.timestamp;
      const managerAddress = params.operationDetails ? JSON.parse(params.operationDetails).manager : '';
      const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const _verifyExtraParams = { managerAddress: managerAddress ?? '' };
        const info = await socialLoginAction('Apple', currentNetwork, VerifyTypeEnum.zklogin, _verifyExtraParams);
        accessToken = info?.data?.access_token || undefined;
        idToken = info?.data?.id_token;
        nonce = info?.data?.nonce;
        timestamp = info?.data?.timestamp;
      }
      const { userId } = parseAppleIdentityToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');
      delete (params as any).id;
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
        timestamp: timestamp ?? 0,
        managerAddress,
      });
      return rst as any;
    },
    [currentNetwork, verifyZKLogin],
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
  const { caHash } = useCurrentWalletInfo();

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
        caHash,
        operationDetails: JSON.stringify({ manager: latestVerifyManagerAddress.current }),
        ...params,
      });
    },
    [
      caHash,
      latestVerifyManagerAddress,
      verifyAppleToken,
      verifyFacebook,
      verifyGoogleToken,
      verifyTelegram,
      verifyTwitter,
    ],
  );
}

export function useAuthSocialAccountInfo(type: ISocialLogin) {
  const currentNetwork = useCurrentNetwork();
  const managerAddress = useVerifyManagerAddress();
  return useCallback(async () => {
    const _verifyType = zkloginGuardianType.includes(type) ? VerifyTypeEnum.zklogin : undefined;
    const _verifyExtraParams = { managerAddress: managerAddress ?? '' };
    const result = await socialLoginAction(type, currentNetwork, _verifyType, _verifyExtraParams);
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
      identityToken = userInfo.accessToken;
    }
    if (type === 'Facebook') {
      userInfo = (await parseFacebookToken(identityToken)) ?? {};
      identityToken = userInfo.accessToken;
    }

    console.log('===', identityToken, userInfo);

    return {
      identityToken,
      user: {
        id: userInfo?.userId,
      },
    };
  }, [currentNetwork, managerAddress, type]);
}
