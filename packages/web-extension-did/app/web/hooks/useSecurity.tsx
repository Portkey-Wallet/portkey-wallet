import { request } from '@portkey-wallet/api/api-did';
import {
  GetTransferLimitResult,
  useCheckTransferLimit,
  useGetTransferLimit,
} from '@portkey-wallet/hooks/hooks-ca/security';
import { useCurrentWallet, useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { Image } from 'antd';
import {
  SecurityVulnerabilityTip,
  SecurityVulnerabilityTitle,
  SecurityAccelerateTitle,
  SecurityAccelerateContent,
  SecurityAccelerateErrorTip,
  LimitType,
} from 'constants/security';
import {
  useTransferLimitApprovalModal,
  useTransferLimitModal,
} from 'pages/WalletSecurity/PaymentSecurity/hooks/useLimitModal';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useLoading } from 'store/Provider/hooks';
import { ChainId } from '@portkey/provider-types';
import { ICheckLimitBusiness, ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { handleGuardianByContract } from 'utils/sandboxUtil/handleGuardianByContract';
import { getAelfTxResult } from '@portkey-wallet/utils/aelf';
import { fixedGuardianParams, fixedGuardianApprovedParams } from '@portkey-wallet/utils/guardian';
import { CheckSecurityResult, getAccelerateGuardianTxId } from '@portkey-wallet/utils/securityTest';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { getCurrentChainInfo } from 'utils/lib/SWGetReduxStore';
import CustomSvg from 'components/CustomSvg';
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

export const useCheckSecurity = () => {
  const wallet = useCurrentWalletInfo();
  const addGuardiansModal = useAddGuardiansModal();
  const synchronizingModal = useSynchronizingModal();

  return useCallback(
    async (targetChainId: ChainId, onCancel?: () => void): Promise<boolean> => {
      try {
        const res: CheckSecurityResult = await request.security.balanceCheck({
          params: { caHash: wallet?.caHash || '', checkTransferSafeChainId: targetChainId },
        });

        if (res.isTransferSafe) return true;

        if (wallet.originChainId === targetChainId) {
          if (res.isOriginChainSafe) return true;
          addGuardiansModal(targetChainId, onCancel);
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
            });
            return false;
          }
          addGuardiansModal(targetChainId, onCancel);
          return false;
        }
      } catch (error) {
        const msg = handleErrorMessage(error, 'Balance Check Error');
        throw singleMessage.error(msg);
      }
    },
    [addGuardiansModal, synchronizingModal, wallet?.caHash, wallet.originChainId],
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
      accelerateGuardiansTxId,
    }: {
      accelerateChainId: ChainId;
      accelerateGuardiansTxId?: string;
    }) => {
      const modal = CustomModal({
        type: 'info',
        content: (
          <div className="security-modal">
            <CustomSvg type="SuggestClose" onClick={() => modal.destroy()} />
            <Image
              width={180}
              height={108}
              src="assets/images/securityTip.png"
              className="modal-logo"
              preview={false}
            />
            <div className="modal-title">{SecurityAccelerateTitle}</div>
            <div>{SecurityAccelerateContent}</div>
          </div>
        ),
        okText: t('OK'),
        onOk: () => {
          modal.destroy();
          checkAccelerateIsReady({ accelerateChainId, accelerateGuardiansTxId });
        },
      });
    },
    [checkAccelerateIsReady, t],
  );
}

export function useAddGuardiansModal() {
  const { t } = useTranslation();
  const navigate = useNavigateState<TGuardiansLocationState>();
  return useCallback(
    (accelerateChainId: ChainId, onCancel?: () => void) => {
      const modal = CustomModal({
        type: 'confirm',
        content: (
          <div className="security-modal">
            <Image
              width={180}
              height={108}
              src="assets/images/securityTip.png"
              className="modal-logo"
              preview={false}
            />
            <div className="modal-title">{SecurityVulnerabilityTitle}</div>
            <div>{SecurityVulnerabilityTip}</div>
          </div>
        ),
        cancelText: t('Not Now'),
        okText: t('Add Guardians'),
        onCancel: () => {
          onCancel?.();
          modal.destroy();
        },
        onOk: () => navigate('/setting/guardians', { state: { accelerateChainId } }),
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
            .gte(ZERO.plus(divDecimals(balance, decimals)))
        ) {
          transferLimitModal(settingParams, limitRes?.isSingleLimited ? LimitType.Single : LimitType.Daily);
        } else {
          transferLimitApprovalModal(
            settingParams,
            limitRes?.isSingleLimited ? LimitType.Single : LimitType.Daily,
            onOneTimeApproval,
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
