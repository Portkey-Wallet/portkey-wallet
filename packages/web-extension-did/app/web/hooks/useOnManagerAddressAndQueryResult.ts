import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import AElf from 'aelf-sdk';
import { useCallback } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading, useLoginInfo } from 'store/Provider/hooks';
import { randomId } from '@portkey-wallet/utils';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { extraDataEncode } from '@portkey-wallet/utils/device';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { recoveryDIDWallet, registerDIDWallet } from '@portkey-wallet/api/api-did/utils/wallet';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';
import { VerificationType, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { setManagerInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import useFetchDidWallet from './useFetchDidWallet';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { message } from 'antd';
import ModalTip from 'pages/components/ModalTip';

export function useOnManagerAddressAndQueryResult(state: string | undefined) {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { userGuardianStatus } = useGuardiansInfo();
  const dispatch = useAppDispatch();
  const getWalletCAAddressResult = useFetchDidWallet(true);
  const { loginAccount, registerVerifier } = useLoginInfo();
  const network = useCurrentNetworkInfo();

  const originChainId = useOriginChainId();

  const getGuardiansApproved: () => GuardiansApprovedType[] = useCallback(() => {
    return Object.values(userGuardianStatus ?? {})
      .filter((guardian) => guardian.status === VerifyStatus.Verified)
      .map((guardian) => ({
        type: LoginType[guardian.guardianType],
        identifier: guardian.guardianAccount,
        verifierId: guardian.verifier?.id || '',
        verificationDoc: guardian.verificationDoc || '',
        signature: guardian.signature || '',
      }));
  }, [userGuardianStatus]);

  const requestRegisterDIDWallet = useCallback(
    async ({ managerAddress, verifierParams }: { managerAddress: string; verifierParams?: VerifierInfo }) => {
      // console.log(loginAccount, registerVerifier, 'requestRegisterDIDWallet==');
      if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType])
        throw 'Missing account!!! Please login/register again';
      const requestId = randomId();
      let verifier: VerifierInfo;
      if (registerVerifier) {
        verifier = registerVerifier;
      } else if (verifierParams) {
        verifier = verifierParams;
      } else {
        throw 'Missing Verifier Server';
      }
      const extraData = await extraDataEncode(getDeviceInfo(DEVICE_TYPE));
      const result = await registerDIDWallet({
        type: LoginType[loginAccount.loginType],
        loginGuardianIdentifier: loginAccount.guardianAccount.replaceAll(' ', ''),
        manager: managerAddress,
        extraData, //navigator.userAgent,
        chainId: originChainId,
        verifierId: verifier.verifierId,
        verificationDoc: verifier.verificationDoc,
        signature: verifier.signature,
        context: {
          clientId: managerAddress,
          requestId,
        },
      });
      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [loginAccount, originChainId, registerVerifier],
  );

  const requestRecoveryDIDWallet = useCallback(
    async ({ managerAddress }: { managerAddress: string }) => {
      if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType])
        throw 'Missing account!!! Please login/register again';
      const guardiansApproved = getGuardiansApproved();
      const requestId = randomId();
      const extraData = await extraDataEncode(getDeviceInfo(DEVICE_TYPE));
      const result = await recoveryDIDWallet({
        loginGuardianIdentifier: loginAccount.guardianAccount.replaceAll(' ', ''),
        manager: managerAddress,
        extraData, //navigator.userAgent,
        chainId: originChainId,
        guardiansApproved,
        context: {
          clientId: managerAddress,
          requestId,
        },
      });

      return {
        requestId,
        sessionId: result.sessionId,
      };
    },
    [loginAccount, getGuardiansApproved, originChainId],
  );

  return useCallback(
    async (pin: string, verifierParams?: VerifierInfo) => {
      try {
        if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType])
          return message.error('Missing account!!! Please login/register again');
        setLoading(true, 'Creating address on the chain...');
        const _walletInfo = walletInfo.address ? walletInfo : AElf.wallet.createNewWallet();
        console.log(walletInfo.address, 'onCreate==');

        // Step 9
        let sessionInfo = {
          requestId: walletInfo.address,
          sessionId: '',
        };

        if (state === 'register') {
          sessionInfo = await requestRegisterDIDWallet({ managerAddress: _walletInfo.address, verifierParams });
        } else {
          sessionInfo = await requestRecoveryDIDWallet({ managerAddress: _walletInfo.address });
        }

        const managerInfo = {
          managerUniqueId: sessionInfo.sessionId,
          requestId: sessionInfo.requestId,
          loginAccount: loginAccount?.guardianAccount,
          type: loginAccount.loginType,
          verificationType: state === 'register' ? VerificationType.register : VerificationType.communityRecovery,
        };
        dispatch(
          setManagerInfo({
            networkType: network.networkType,
            pin,
            managerInfo,
          }),
        );
        console.log(managerInfo, 'managerInfo====');

        // TODO Step 14 Only get Main Chain caAddress

        // Socket
        await getWalletCAAddressResult({
          requestId: sessionInfo.requestId,
          clientId: _walletInfo.address,
          verificationType: state === 'register' ? VerificationType.register : VerificationType.communityRecovery,
          managerUniqueId: sessionInfo.sessionId,
          pwd: pin,
          managerAddress: _walletInfo.address,
        });
        setLoading(false);
        ModalTip({
          content: 'Requested successfully',
        });
      } catch (error: any) {
        console.log(error, 'onCreate==error');
        const walletError = isWalletError(error);
        if (walletError) return message.error(walletError);
        if (error?.message || error?.error?.message) return message.error(error?.message || error?.error?.message);
        const errorString = typeof error === 'string' ? error : 'Something error';
        message.error(walletError || errorString);
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      getWalletCAAddressResult,
      loginAccount,
      network.networkType,
      requestRecoveryDIDWallet,
      requestRegisterDIDWallet,
      setLoading,
      state,
      walletInfo,
    ],
  );
}
