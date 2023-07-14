import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSellTransfer } from '@portkey-wallet/hooks/hooks-ca/payment';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AchTxAddressReceivedType, PaymentSellTransferResult } from '@portkey-wallet/types/types-ca/payment';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { usePin } from 'hooks/store';
import { useCallback, useMemo } from 'react';
import { getManagerAccount } from 'utils/redux';
import AElf from 'aelf-sdk';
import SparkMD5 from 'spark-md5';

export const useHandleAchSell = () => {
  const sellTransfer = useSellTransfer();
  const { accountToken } = useAssets();
  const aelfToken = useMemo(
    () => accountToken.accountTokenList.find(item => item.symbol === 'ELF' && item.chainId === 'AELF'),
    [accountToken],
  );
  const chainInfo = useCurrentChain('AELF');
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const paymentSellTransfer = useCallback(
    async (params: AchTxAddressReceivedType): Promise<PaymentSellTransferResult> => {
      const { decimals, symbol, chainId } = aelfToken || {};
      const { caContractAddress, endPoint } = chainInfo || {};
      const { caHash } = wallet;

      if (
        decimals === undefined ||
        !symbol ||
        !chainId ||
        !pin ||
        !caContractAddress ||
        !endPoint ||
        !aelfToken ||
        !caHash
      ) {
        throw new Error('Incorrect preposition parameter.');
      }

      const account = getManagerAccount(pin);
      if (!account) throw new Error('');

      const contract = await getContractBasic({
        contractAddress: caContractAddress,
        rpcUrl: endPoint,
        account: account,
      });
      const amount = timesDecimals(params.cryptoAmount, decimals).toNumber();

      const rawResult = await contract.encodedTx('ManagerForwardCall', {
        caHash,
        contractAddress: aelfToken.tokenContractAddress || '',
        methodName: 'Transfer',
        args: {
          symbol: aelfToken.symbol,
          to: `ELF_${params.address}_AELF`,
          amount,
          memo: '',
        },
      });
      if (!rawResult || !rawResult.data) {
        throw new Error('Failed to get raw transaction.');
      }

      const publicKey = (account.keyPair as any).getPublic('hex');

      const message = SparkMD5.hash(`${params.orderId}${rawResult.data}`);
      const signature = AElf.wallet.sign(Buffer.from(message).toString('hex'), account.keyPair).toString('hex');
      return {
        rawTransaction: rawResult.data,
        publicKey,
        signature,
      };
    },
    [aelfToken, chainInfo, pin, wallet],
  );

  return useCallback(
    async (orderId: string) => {
      try {
        Loading.show({ text: 'Payment is being processed and may take around 10 seconds to complete.' });
        await sellTransfer({
          merchantName: ACH_MERCHANT_NAME,
          orderId,
          paymentSellTransfer,
        });
        CommonToast.success('Transaction completed.');
      } catch (error) {
        console.log('error', error);
        CommonToast.failError(error);
      } finally {
        Loading.hide();
      }
    },
    [paymentSellTransfer, sellTransfer],
  );
};
