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
import { ICheckLimitBusiness, IPaymentSecurityRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';

export const useCheckSecurity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wallet = useCurrentWalletInfo();
  const { setLoading } = useLoading();

  return useCallback(async (): Promise<boolean | object> => {
    try {
      setLoading(true);
      const res: { isSafe: boolean } = await request.security.balanceCheck({
        params: { caHash: wallet?.caHash || '' },
      });

      setLoading(false);

      if (res?.isSafe) return true;

      return CustomModal({
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
        onOk: () => navigate('/setting/guardians'),
      });
    } catch (error) {
      setLoading(false);
      const msg = handleErrorMessage(error, 'Balance Check Error');
      throw message.error(msg);
    }
  }, [navigate, setLoading, t, wallet?.caHash]);
};

export interface ICheckLimitParams {
  chainId: ChainId;
  symbol: string;
  decimals: number | string;
  amount: string;
  from: ICheckLimitBusiness;
}

export const useCheckLimit = (targetChainId: ChainId) => {
  const currentChain = useCurrentChain(targetChainId);
  const { walletInfo } = useCurrentWallet();
  const { passwordSeed } = useUserInfo();
  const checkTransferLimit = useCheckTransferLimit();
  const dailyTransferLimitModal = useDailyTransferLimitModal();
  const singleTransferLimitModal = useSingleTransferLimitModal();

  return useCallback(
    async ({ chainId, symbol, decimals, amount, from }: ICheckLimitParams): Promise<boolean | object> => {
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

      const settingParams: IPaymentSecurityRouteState = {
        chainId: chainId,
        symbol,
        singleLimit: limitRes?.singleBalance.toString() || '',
        dailyLimit: limitRes?.dailyLimit.toString() || '',
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
