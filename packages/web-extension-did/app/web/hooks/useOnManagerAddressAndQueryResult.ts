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
import { setCAInfo, setManagerInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import useFetchDidWallet from './useFetchDidWallet';
import { isWalletError } from '@portkey-wallet/store/wallet/utils';
import { message } from 'antd';
import ModalTip from 'pages/components/ModalTip';
import { CreateAddressLoading, InitLoginLoading } from '@portkey-wallet/constants/constants-ca/wallet';
import { useTranslation } from 'react-i18next';
import { contractQueries } from '@portkey-wallet/graphql';
import { ChainId } from '@portkey/provider-types';
import { getHolderInfoByContract } from 'utils/sandboxUtil/getHolderInfo';
import { getCurrentChainInfo, getLoginAccount, getLoginCache } from 'utils/lib/SWGetReduxStore';
import { useNavigate } from 'react-router';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';

export function useOnManagerAddressAndQueryResult(state: string | undefined) {
  const { setLoading } = useLoading();
  const { walletInfo } = useCurrentWallet();
  const { userGuardianStatus } = useGuardiansInfo();
  const dispatch = useAppDispatch();
  const getWalletCAAddressResult = useFetchDidWallet(true);
  const network = useCurrentNetworkInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const originChainId = useOriginChainId();

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
    [originChainId],
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
      console.log('guardiansApprovedList====', guardiansApprovedList);
      let guardiansApproved = getGuardiansApproved();
      if (
        guardiansApprovedList &&
        (!guardiansApproved || (Array.isArray(guardiansApproved) && guardiansApproved?.length === 0))
      ) {
        guardiansApproved = guardiansApprovedList;
      }
      console.log('guardiansApproved====', guardiansApproved);
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
    [getGuardiansApproved, originChainId],
  );

  const distributeFail = useCallback(
    async ({
      messageStr,
      wallet,
      pin,
      verificationType,
    }: {
      messageStr: string;
      wallet: any;
      pin: string;
      verificationType: VerificationType;
    }) => {
      try {
        if (messageStr.includes('ManagerInfo exists')) {
          const address = wallet?.walletInfo?.address || '';
          const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(wallet.currentNetwork, {
            manager: wallet?.walletInfo?.address || '',
          });
          const info = caHolderManagerInfo[0];
          if (!info.originChainId) throw new Error('caHolderManagerInfo is empty');
          const chainInfo = await getCurrentChainInfo(info.originChainId as ChainId);
          if (!chainInfo) throw 'getCurrentChainInfo error';
          const contractInfo = await getHolderInfoByContract({
            rpcUrl: chainInfo.endPoint,
            chainType: network.walletType,
            address: chainInfo.caContractAddress,
            paramsOption: {
              caHash: info.caHash || '',
            },
          });
          const { managerInfos, caAddress, caHash } = contractInfo.result;
          const exist = await managerInfos?.some((manager: { address: string }) => manager?.address === address);

          if (exist) {
            dispatch(
              setCAInfo({
                caInfo: {
                  caAddress,
                  caHash,
                },
                pin,
                chainId: info.originChainId as ChainId,
              }),
            );
            const path = VerificationType.register === verificationType ? 'register' : 'login';
            navigate(`/success-page/${path}`);
            return;
          }
        }
      } catch {
        message.error(handleErrorMessage(messageStr, 'Create wallet failed'));
        return;
      }
    },
    [dispatch, navigate, network.walletType],
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
          return message.error('Missing account!!! Please login/register again');
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
        if (walletError) return message.error(walletError);
        const messageError = typeof error === 'string' ? error : error?.message || error?.error?.message;

        distributeFail({
          messageStr: handleErrorMessage(messageError, 'Create wallet failed'),
          wallet: walletInfo,
          pin,
          verificationType,
        });
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      distributeFail,
      getWalletCAAddressResult,
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
