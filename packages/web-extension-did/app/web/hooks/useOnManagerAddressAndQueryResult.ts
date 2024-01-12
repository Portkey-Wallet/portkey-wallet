import { useCurrentWallet, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import AElf from 'aelf-sdk';
import { useCallback } from 'react';
import { useAppDispatch, useGuardiansInfo, useLoading } from 'store/Provider/hooks';
import { handleErrorMessage, randomId } from '@portkey-wallet/utils';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { extraDataEncode } from '@portkey-wallet/utils/device';
import { getDeviceInfo } from 'utils/device';
import { DEVICE_TYPE } from 'constants/index';
import { recoveryDIDWallet, registerDIDWallet } from '@portkey-wallet/api/api-did/utils/wallet';
import type { AccountType, GuardiansApproved } from '@portkey/services';
import { VerificationType, VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';
import { setManagerInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import useFetchDidWallet from './useFetchDidWallet';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import ModalTip from 'pages/components/ModalTip';
import { CreateAddressLoading, InitLoginLoading } from '@portkey-wallet/constants/constants-ca/wallet';
import { useTranslation } from 'react-i18next';
import { getLoginAccount, getLoginCache } from 'utils/lib/SWGetReduxStore';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { useNavigate } from 'react-router';
import { useLatestRef } from '@portkey-wallet/hooks';
import singleMessage from 'utils/singleMessage';

export function useOnManagerAddressAndQueryResult(state: string | undefined) {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { userGuardianStatus } = useGuardiansInfo();
  const dispatch = useAppDispatch();
  const getWalletCAAddressResult = useFetchDidWallet();
  const network = useCurrentNetworkInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const originChainId = useOriginChainId();
  const latestOriginChainId = useLatestRef(originChainId);

  const getGuardiansApproved: () => GuardiansApproved[] = useCallback(() => {
    return Object.values(userGuardianStatus ?? {})
      .filter((guardian) => guardian.status === VerifyStatus.Verified)
      .map((guardian) => ({
        type: LoginType[guardian.guardianType] as AccountType,
        identifier: guardian.guardianAccount,
        verifierId: guardian.verifier?.id || '',
        verificationDoc: guardian.verificationDoc || '',
        signature: guardian.signature || '',
      }));
  }, [userGuardianStatus]);

  const requestRegisterDIDWallet = useCallback(
    async ({ managerAddress, verifierParams }: { managerAddress: string; verifierParams?: VerifierInfo }) => {
      const { loginAccount, registerVerifier } = await getLoginCache();
      if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType]) {
        throw 'Missing account!!! Please login/register again';
      }
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
        chainId: latestOriginChainId.current,
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
    [latestOriginChainId],
  );

  const requestRecoveryDIDWallet = useCallback(
    async ({
      managerAddress,
      guardiansApprovedList,
    }: {
      managerAddress: string;
      guardiansApprovedList?: GuardiansApproved[];
    }) => {
      const loginAccount = await getLoginAccount();
      if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType]) {
        throw 'Missing account!!! Please login/register again';
      }
      let guardiansApproved = getGuardiansApproved();
      if (
        guardiansApprovedList &&
        (!guardiansApproved || (Array.isArray(guardiansApproved) && guardiansApproved?.length === 0))
      ) {
        guardiansApproved = guardiansApprovedList;
      }
      const requestId = randomId();
      const extraData = await extraDataEncode(getDeviceInfo(DEVICE_TYPE));
      const result = await recoveryDIDWallet({
        loginGuardianIdentifier: loginAccount.guardianAccount.replaceAll(' ', ''),
        manager: managerAddress,
        extraData, //navigator.userAgent,
        chainId: latestOriginChainId.current,
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
    [getGuardiansApproved, latestOriginChainId],
  );

  return useCallback(
    async ({
      pin,
      verifierParams,
      currentGuardian,
    }: {
      pin: string;
      verifierParams?: VerifierInfo;
      currentGuardian?: UserGuardianItem;
    }) => {
      const verificationType = state === 'register' ? VerificationType.register : VerificationType.communityRecovery;

      try {
        const loginAccount = await getLoginAccount();
        if (!loginAccount?.guardianAccount || !LoginType[loginAccount.loginType]) {
          return singleMessage.error('Missing account!!! Please login/register again');
        }

        if (loginAccount.createType === 'register') {
          setLoading(true, t(CreateAddressLoading));
        } else {
          setLoading(true, t(InitLoginLoading));
        }

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
          let guardiansApprovedList: GuardiansApproved[] | undefined = undefined;
          if (verifierParams && currentGuardian) {
            guardiansApprovedList = [
              {
                type: LoginType[currentGuardian.guardianType] as AccountType,
                identifier: currentGuardian.guardianAccount,
                verifierId: verifierParams.verifierId,
                verificationDoc: verifierParams?.verificationDoc,
                signature: verifierParams.signature,
                identifierHash: currentGuardian.identifierHash,
              },
            ];
          }
          sessionInfo = await requestRecoveryDIDWallet({ managerAddress: _walletInfo.address, guardiansApprovedList });
        }
        const managerInfo = {
          managerUniqueId: sessionInfo.sessionId,
          requestId: sessionInfo.requestId,
          loginAccount: loginAccount?.guardianAccount,
          type: loginAccount.loginType,
          verificationType,
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
          verificationType,
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
        if (walletError) return singleMessage.error(walletError);
        singleMessage.error(handleErrorMessage(error, 'Create Wallet Failed'));
        navigate('/register/start');
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      getWalletCAAddressResult,
      navigate,
      network.networkType,
      requestRecoveryDIDWallet,
      requestRegisterDIDWallet,
      setLoading,
      state,
      t,
      walletInfo,
    ],
  );
}
