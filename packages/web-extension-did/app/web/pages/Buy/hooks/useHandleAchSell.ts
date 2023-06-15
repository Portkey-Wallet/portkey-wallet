import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSellTransfer } from '@portkey-wallet/hooks/hooks-ca/payment';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AchTxAddressReceivedType } from '@portkey-wallet/types/types-ca/payment';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useLoading } from 'store/Provider/hooks';
import sameChainTransfer from 'utils/sandboxUtil/sameChainTransfer';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import aes from '@portkey-wallet/utils/aes';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';

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

  const paymentSellTransfer = useCallback(
    async (params: AchTxAddressReceivedType) => {
      if (!chainInfo) throw new Error('Sell Transfer: No ChainInfo');

      const getSeedResult = await InternalMessage.payload(InternalMessageTypes.GET_SEED).send();
      const pin = getSeedResult.data.privateKey;
      const privateKey = await aes.decrypt(wallet.AESEncryptPrivateKey, pin);
      if (!privateKey) throw new Error('Sell Transfer: No PrivateKey');

      if (!aelfToken) throw new Error('Sell Transfer: No Token');

      const transferParams = {
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
        toAddress: `ELF_${params.address}_AELF`,
      };
      const res = await sameChainTransfer(transferParams);
      return {
        error: res?.result?.Error,
        transactionId: res?.result.TransactionId || '',
      };
    },
    [aelfToken, chainInfo, currentNetwork.walletType, wallet.AESEncryptPrivateKey, wallet?.caHash],
  );

  return useCallback(
    async (orderId: string) => {
      try {
        setLoading(true, 'Payment is being processed and may take around 10 seconds to complete.', false);
        await sellTransfer({
          merchantName: ACH_MERCHANT_NAME,
          orderId,
          paymentSellTransfer,
        });
        message.success('Transaction completed.');
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [paymentSellTransfer, sellTransfer, setLoading],
  );
};
