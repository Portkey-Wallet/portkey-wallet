import { request } from '@portkey-wallet/api/api-did';
import {
  GetTransferLimitResult,
  useCheckTransferLimit,
  useGetTransferLimit,
} from '@portkey-wallet/hooks/hooks-ca/security';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { Image, message } from 'antd';
import { SecurityVulnerabilityTip, SecurityVulnerabilityTitle } from 'constants/security';
import {
  useDailyTransferLimitModal,
  useSingleTransferLimitModal,
} from 'pages/WalletSecurity/PaymentSecurity/hooks/useLimitModal';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import aes from '@portkey-wallet/utils/aes';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import { ChainId } from '@portkey/provider-types';
import { ICheckLimitBusiness, ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';

export interface IBalanceCheckResult {
  isOriginChainSafe: boolean;
  isSynchronizing: boolean;
  isTransferSafe: boolean;
}

export const useCheckSecurity = () => {
  const wallet = useCurrentWalletInfo();
  const { setLoading } = useLoading();
  const addGuardiansModal = useAddGuardiansModal();
  const synchronizingModal = useSynchronizingModal();

  return useCallback(
    async (targetChainId?: ChainId): Promise<boolean> => {
      try {
        setLoading(true);
        const res: IBalanceCheckResult = await request.security.balanceCheck({
          params: { caHash: wallet?.caHash || '' },
        });

        setLoading(false);

        // don’t know the chain of operations
        if (!targetChainId) {
          if (res.isTransferSafe) return true;
          if (res.isSynchronizing) {
            synchronizingModal();
            return false;
          }
          addGuardiansModal();
          return false;
        }

        // know the chain of operations
        if (wallet.originChainId === targetChainId) {
          if (res.isOriginChainSafe) return true;
          addGuardiansModal();
          return false;
        } else {
          if (res.isTransferSafe) return true;
          if (res.isSynchronizing) {
            synchronizingModal();
            return false;
          }
          addGuardiansModal();
          return false;
        }
      } catch (error) {
        setLoading(false);
        const msg = handleErrorMessage(error, 'Balance Check Error');
        throw message.error(msg);
      }
    },
    [addGuardiansModal, setLoading, synchronizingModal, wallet?.caHash, wallet.originChainId],
  );
};

export function useSynchronizingModal() {
  const { t } = useTranslation();

  return useCallback(() => {
    CustomModal({
      type: 'info',
      content: 'Syncing guardian info, which may take 1-2 minutes. Please try again later.',
      okText: t('Ok'),
    });
  }, [t]);
}

export function useAddGuardiansModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useCallback(() => {
    CustomModal({
      type: 'confirm',
      content: (
        <div className="security-modal">
          <Image width={180} height={108} src="assets/images/securityTip.png" className="modal-logo" preview={false} />
          <div className="modal-title">{SecurityVulnerabilityTitle}</div>
          <div>{SecurityVulnerabilityTip}</div>
        </div>
      ),
      cancelText: t('Not Now'),
      okText: t('Add Guardians'),
      onOk: () => navigate('/setting/guardians'),
    });
  }, [navigate, t]);
}

export interface ICheckLimitParams {
  chainId: ChainId;
  symbol: string;
  decimals: number | string;
  amount: string;
  from: ICheckLimitBusiness;
  fromSymbol?: string;
}

export const useCheckLimit = (targetChainId: ChainId) => {
  const currentChain = useCurrentChain(targetChainId);
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const checkTransferLimit = useCheckTransferLimit();
  const dailyTransferLimitModal = useDailyTransferLimitModal();
  const singleTransferLimitModal = useSingleTransferLimitModal();

  return useCallback(
    async ({ chainId, symbol, decimals, amount, from, fromSymbol }: ICheckLimitParams): Promise<boolean | object> => {
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('Invalid user information, please check');

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

      const settingParams: ITransferLimitRouteState = {
        chainId: chainId,
        symbol,
        fromSymbol: fromSymbol || symbol,
        singleLimit: limitRes?.singleBalance.toFixed() || '',
        dailyLimit: limitRes?.dailyLimit.toFixed() || '',
        restricted: !limitRes?.dailyLimit.eq(-1),
        decimals,
        from,
      };
      if (limitRes?.isSingleLimited) {
        return singleTransferLimitModal(settingParams);
      }
      if (limitRes?.isDailyLimited) {
        return dailyTransferLimitModal(settingParams);
      }
      return true;
    },
    [
      checkTransferLimit,
      currentChain?.caContractAddress,
      currentChain?.endPoint,
      dailyTransferLimitModal,
      passwordSeed,
      singleTransferLimitModal,
      walletInfo.AESEncryptPrivateKey,
    ],
  );
};

export const useGetTransferLimitWithContract = (targetChainId: ChainId) => {
  const currentChain = useCurrentChain(targetChainId);
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const getTransferLimit = useGetTransferLimit();

  return useCallback(
    async ({ symbol }: { symbol: string }): Promise<GetTransferLimitResult | undefined> => {
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return;

      const caContract = new ExtensionContractBasic({
        rpcUrl: currentChain?.endPoint,
        contractAddress: currentChain?.caContractAddress,
        privateKey: privateKey,
      });

      return await getTransferLimit({ caContract, symbol });
    },
    [
      currentChain?.caContractAddress,
      currentChain?.endPoint,
      getTransferLimit,
      passwordSeed,
      walletInfo.AESEncryptPrivateKey,
    ],
  );
};
