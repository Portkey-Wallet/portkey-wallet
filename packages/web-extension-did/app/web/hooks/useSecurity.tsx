import { request } from '@portkey-wallet/api/api-did';
import {
  GetTransferLimitResult,
  useCheckTransferLimit,
  useGetTransferLimit,
} from '@portkey-wallet/hooks/hooks-ca/security';
import { useCurrentWallet, useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { SecurityAccelerateErrorTip, LimitType } from 'constants/security';
import {
  useTransferLimitApprovalModal,
  useTransferLimitModal,
} from 'pages/WalletSecurity/PaymentSecurity/hooks/useLimitModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { ChainId } from '@portkey/provider-types';
import { ICheckLimitBusiness, ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { handleGuardianByContract } from 'utils/sandboxUtil/handleGuardianByContract';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { fixedGuardianParams, fixedGuardianApprovedParams } from '@portkey-wallet/utils/guardian';
import { CheckSecurityResult, getAccelerateGuardianTxId } from '@portkey-wallet/utils/securityTest';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { getCurrentChainInfo } from 'utils/lib/SWGetReduxStore';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals } from '@portkey-wallet/utils/converter';
import { MAX_TRANSACTION_FEE } from '@portkey-wallet/constants/constants-ca/wallet';
import { SendStage, ToAccount } from 'pages/Send';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import { RampType } from '@portkey-wallet/ramp';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from './router';
import { TGuardiansLocationState } from 'types/router';
import { CustomModalBottom } from 'pages/components/CustomModalBottom';
import ModalContent from 'pages/components/ModalContent';

export const useCheckSecurity = () => {
  const wallet = useCurrentWalletInfo();
  const addGuardiansModal = useAddGuardiansModal();
  const synchronizingModal = useSynchronizingModal();
  const { isPrompt } = useCommonState();

  return useCallback(
    async (targetChainId: ChainId, onCancel?: () => void): Promise<boolean> => {
      try {
        const res: CheckSecurityResult = await request.security.balanceCheck({
          params: { caHash: wallet?.caHash || '', checkTransferSafeChainId: targetChainId },
        });

        if (res.isTransferSafe) return true;

        if (wallet.originChainId === targetChainId) {
          if (res.isOriginChainSafe) return true;
          addGuardiansModal(targetChainId, isPrompt, onCancel);
          return false;
        } else {
          if (res.isSynchronizing && res.isOriginChainSafe) {
            let _txId;
            if (Array.isArray(res.accelerateGuardians)) {
              const _accelerateGuardian = res.accelerateGuardians.find(
                (item) => item.transactionId && item.chainId === wallet.originChainId,
              );
              _txId = _accelerateGuardian?.transactionId;
            }
            synchronizingModal({
              accelerateChainId: targetChainId,
              accelerateGuardiansTxId: _txId,
              isPrompt,
            });
            return false;
          }
          addGuardiansModal(targetChainId, isPrompt, onCancel);
          return false;
        }
      } catch (error) {
        const msg = handleErrorMessage(error, 'Balance Check Error');
        throw singleMessage.error(msg);
      }
    },
    [addGuardiansModal, synchronizingModal, isPrompt, wallet?.caHash, wallet.originChainId],
  );
};

export function useSynchronizingModal() {
  const { t } = useTranslation();
  const { walletInfo } = useCurrentWallet();
  const originChainId = useOriginChainId();
  const originChainInfo = useCurrentChain(originChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const { setLoading } = useLoading();

  const handleSyncGuardian = useCallback(
    async ({
      accelerateGuardiansTxId,
      accelerateChainId,
    }: {
      accelerateGuardiansTxId: string;
      accelerateChainId: ChainId;
    }) => {
      try {
        const { privateKey } = await getSeed();
        const accelerateChainInfo = await getCurrentChainInfo(accelerateChainId);
        if (!accelerateChainInfo?.endPoint || !originChainInfo?.endPoint || !privateKey)
          return singleMessage.error(SecurityAccelerateErrorTip);
        const result = await getAelfTxResult(originChainInfo?.endPoint, accelerateGuardiansTxId);
        if (result.Status !== 'MINED') return singleMessage.error(SecurityAccelerateErrorTip);
        const params = JSON.parse(result.Transaction.Params);
        const res = await handleGuardianByContract({
          rpcUrl: accelerateChainInfo?.endPoint as string,
          chainType: currentNetwork.walletType,
          address: accelerateChainInfo?.caContractAddress as string,
          privateKey,
          paramsOption: {
            method: 'AddGuardian',
            params: {
              caHash: walletInfo?.caHash,
              guardianToAdd: fixedGuardianParams(params.guardianToAdd),
              guardiansApproved: fixedGuardianApprovedParams(params.guardiansApproved),
            },
          },
        });
        singleMessage.success('Guardian added');
        console.log('===handleGuardianByContract accelerate res', res);
      } catch (error: any) {
        console.log('===handleGuardianByContract accelerate error', error);
        singleMessage.error(SecurityAccelerateErrorTip);
      }
    },
    [currentNetwork.walletType, originChainInfo?.endPoint, walletInfo?.caHash],
  );

  const checkAccelerateIsReady = useCallback(
    async ({
      accelerateGuardiansTxId,
      accelerateChainId,
    }: {
      accelerateGuardiansTxId?: string;
      accelerateChainId: ChainId;
    }) => {
      try {
        setLoading(true);
        if (accelerateGuardiansTxId) {
          await handleSyncGuardian({ accelerateChainId, accelerateGuardiansTxId });
        } else {
          if (!walletInfo?.caHash) return singleMessage.error(SecurityAccelerateErrorTip);
          const res = await getAccelerateGuardianTxId(walletInfo?.caHash, accelerateChainId, originChainId);
          if (res.isSafe) {
            singleMessage.success('Guardian added');
          } else if (res.accelerateGuardian?.transactionId) {
            await handleSyncGuardian({
              accelerateChainId,
              accelerateGuardiansTxId: res.accelerateGuardian.transactionId,
            });
          } else {
            singleMessage.error(SecurityAccelerateErrorTip);
          }
        }
      } catch (error: any) {
        singleMessage.error(SecurityAccelerateErrorTip);
        console.log('===checkAccelerateIsReady error', error);
      } finally {
        setLoading(false);
      }
    },
    [handleSyncGuardian, originChainId, setLoading, walletInfo?.caHash],
  );

  return useCallback(
    ({
      accelerateChainId,
      isPrompt,
      accelerateGuardiansTxId,
    }: {
      accelerateChainId: ChainId;
      isPrompt: boolean;
      accelerateGuardiansTxId?: string;
    }) => {
      const modal = CustomModalBottom({
        type: 'confirm',
        noFooter: true,
        isPrompt,
        content: (
          <ModalContent
            title="Wallet security level upgrade in progress"
            content={`Click “Complete now” to immediately complete the addition of a guardian, or close this window and wait for completion, which will take about 1-3 minutes.`}
            buttonGroupType="row"
            buttons={[
              {
                content: t('Close'),
                type: 'default',
                onClick: () => {
                  modal.destroy();
                },
              },
              {
                content: t('Complete now'),
                type: 'primary',
                onClick: () => {
                  modal.destroy();
                  checkAccelerateIsReady({ accelerateChainId, accelerateGuardiansTxId });
                },
              },
            ]}
          />
        ),
      });
    },
    [checkAccelerateIsReady, t],
  );
}

export function useAddGuardiansModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TGuardiansLocationState>();
  return useCallback(
    (accelerateChainId: ChainId, isPrompt: boolean, onCancel?: () => void) => {
      const modal = CustomModalBottom({
        type: 'confirm',
        noFooter: true,
        isPrompt,
        content: (
          <ModalContent
            title="Upgrade wallet security level"
            content="You have too few guardians to protect your wallet. Please add at least one more guardian before proceeding."
            buttonGroupType="row"
            buttons={[
              {
                content: t('Not now'),
                type: 'default',
                onClick: () => {
                  onCancel?.();
                  modal.destroy();
                },
              },
              {
                content: t('Add guardians'),
                type: 'primary',
                onClick: () => {
                  modal.destroy();
                  navigate('/setting/guardians', { state: { accelerateChainId } });
                },
              },
            ]}
          />
        ),
      });
    },
    [navigate, t],
  );
}

export interface ICheckLimitParams {
  chainId: ChainId;
  symbol: string;
  decimals: number | string;
  amount: string;
  from: ICheckLimitBusiness;
  balance: string;
  extra: ICheckRampLimitExtraParams | ICheckSendLimitExtraParams;
  onOneTimeApproval: () => void;
}

export interface ICheckRampLimitExtraParams {
  side: RampType;
  country: string;
  fiat: string;
  crypto: string;
  network: string;
  amount: string;
}

export interface ICheckSendLimitExtraParams extends Pick<BaseToken, 'address' | 'imageUrl' | 'alias' | 'tokenId'> {
  stage: SendStage;
  amount: string;
  toAccount: ToAccount;
}

export const useCheckLimit = (targetChainId: ChainId) => {
  const currentChain = useCurrentChain(targetChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const { walletInfo } = useCurrentWallet();
  const checkTransferLimit = useCheckTransferLimit();
  const transferLimitApprovalModal = useTransferLimitApprovalModal();
  const transferLimitModal = useTransferLimitModal();
  const { isPrompt } = useCommonState();

  return useCallback(
    async ({
      chainId,
      symbol,
      decimals,
      amount,
      from,
      balance,
      extra,
      onOneTimeApproval,
    }: ICheckLimitParams): Promise<boolean> => {
      const { privateKey } = await getSeed();
      if (!currentChain?.endPoint || !privateKey) {
        singleMessage.error('Invalid user information, please check');
        return false;
      }

      const caContract = new ExtensionContractBasic({
        rpcUrl: currentChain?.endPoint,
        contractAddress: currentChain?.caContractAddress,
        privateKey: privateKey,
      });

      const limitRes = await checkTransferLimit({
        caContract,
        symbol,
        decimals,
        amount,
      });

      if (limitRes?.isSingleLimited || limitRes?.isDailyLimited) {
        const settingParams: ITransferLimitRouteState = {
          chainId: chainId,
          symbol,
          singleLimit: limitRes?.singleBalance.toFixed() || '',
          dailyLimit: limitRes?.dailyLimit.toFixed() || '',
          restricted: !limitRes?.dailyLimit.eq(-1),
          decimals,
          from,
          extra,
        };

        // get balance
        if (!balance) {
          if (!currentChain) return false;
          const result = await getBalance({
            rpcUrl: currentChain.endPoint,
            address: currentChain.defaultToken.address,
            chainType: currentNetwork.walletType,
            paramsOption: {
              owner: walletInfo[targetChainId]?.caAddress || '',
              symbol: symbol,
            },
          });
          balance = result.result.balance;
        }

        // check limit type and show modal
        if (
          ZERO.plus(amount)
            .plus(MAX_TRANSACTION_FEE)
            .gt(ZERO.plus(divDecimals(balance, decimals)))
        ) {
          transferLimitModal(settingParams, limitRes?.isSingleLimited ? LimitType.Single : LimitType.Daily, isPrompt);
        } else {
          transferLimitApprovalModal(
            settingParams,
            limitRes?.isSingleLimited ? LimitType.Single : LimitType.Daily,
            onOneTimeApproval,
            isPrompt,
          );
        }
        return false;
      }
      return true;
    },
    [
      checkTransferLimit,
      currentChain,
      currentNetwork.walletType,
      targetChainId,
      transferLimitApprovalModal,
      transferLimitModal,
      walletInfo,
      isPrompt,
    ],
  );
};

export const useGetTransferLimitWithContract = (targetChainId: ChainId) => {
  const currentChain = useCurrentChain(targetChainId);
  const getTransferLimit = useGetTransferLimit();

  return useCallback(
    async ({ symbol }: { symbol: string }): Promise<GetTransferLimitResult | undefined> => {
      const { privateKey } = await getSeed();
      if (!currentChain?.endPoint || !privateKey) return;

      const caContract = new ExtensionContractBasic({
        rpcUrl: currentChain?.endPoint,
        contractAddress: currentChain?.caContractAddress,
        privateKey: privateKey,
      });

      return await getTransferLimit({ caContract, symbol });
    },
    [currentChain?.caContractAddress, currentChain?.endPoint, getTransferLimit],
  );
};
