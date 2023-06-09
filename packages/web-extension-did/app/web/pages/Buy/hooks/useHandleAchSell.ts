import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSellTransfer } from '@portkey-wallet/hooks/hooks-ca/payment';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AchTxAddressReceivedType } from '@portkey-wallet/types/types-ca/payment';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import aes from '@portkey-wallet/utils/aes';

export const useHandleAchSell = () => {
  const { setLoading } = useLoading();
  const sellTransfer = useSellTransfer();

  const { accountToken } = useAssets();
  const aelfToken = useMemo(
    () => accountToken.accountTokenList.find((item) => item.symbol === 'ELF' && item.chainId === 'AELF'),
    [accountToken],
  );
  const chainInfo = useCurrentChain('AELF');
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();
  const { passwordSeed } = useUserInfo();

  const paymentSellTransfer = useCallback(
    async (params: AchTxAddressReceivedType) => {
      if (!chainInfo) throw new Error('');
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) throw new Error('');

      if (!aelfToken) throw new Error('');

      const res = await sameChainTransfer({
        chainInfo,
        chainType: currentNetwork.walletType,
        privateKey,
        tokenInfo: {
          id: aelfToken?.id,
          chainId: aelfToken.chainId,
          decimals: aelfToken.decimals,
          address: aelfToken.tokenContractAddress || '',
          symbol: aelfToken.symbol,
          name: aelfToken?.name,
          imageUrl: aelfToken?.imageUrl,
          alias: aelfToken?.alias,
          tokenId: aelfToken?.tokenId,
        },
        caHash: wallet?.caHash || '',
        amount: timesDecimals(params.cryptoAmount, aelfToken.decimals).toNumber(),
        toAddress: `ELF_${params.address}_AELF`, // 'ELF_2KQWh5v6Y24VcGgsx2KHpQvRyyU5DnCZ4eAUPqGQbnuZgExKaV_AELF', // TODO SELL
      });

      return {
        error: res?.result?.Error,
        transactionId: res?.result.TransactionId || '',
      };
    },
    [aelfToken, chainInfo, currentNetwork.walletType, passwordSeed, wallet.AESEncryptPrivateKey, wallet?.caHash],
  );

  return useCallback(
    async (orderId: string) => {
      try {
        setLoading(true);
        await sellTransfer({
          merchantName: ACH_MERCHANT_NAME,
          orderId,
          paymentSellTransfer,
        });
      } catch (error) {
        console.log('error', error);
        message.error('Transfer Error');
      } finally {
        setLoading(false);
      }
    },
    [paymentSellTransfer, sellTransfer, setLoading],
  );
};
