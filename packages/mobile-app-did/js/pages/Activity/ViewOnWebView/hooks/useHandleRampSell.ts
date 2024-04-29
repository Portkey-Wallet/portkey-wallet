import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useTokenInfoFromStore } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { usePin } from 'hooks/store';
import { useCallback } from 'react';
import { getManagerAccount } from 'utils/redux';
import AElf from 'aelf-sdk';
import SparkMD5 from 'spark-md5';
import ramp, { IGenerateTransactionResult, IOrderInfo } from '@portkey-wallet/ramp';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

export const useHandleRampSell = () => {
  const defaultToken = useDefaultToken();
  const aelfToken = useTokenInfoFromStore(defaultToken.symbol, DefaultChainId);

  const chainInfo = useCurrentChain(DefaultChainId);
  const pin = usePin();
  const wallet = useCurrentWalletInfo();

  const paymentSellTransfer = useCallback(
    async (orderInfo: IOrderInfo, guardiansApproved?: GuardiansApprovedType[]): Promise<IGenerateTransactionResult> => {
      const { address, cryptoAmount, orderId } = orderInfo;
      const { caContractAddress, endPoint } = chainInfo || {};
      const { caHash } = wallet;

      if (!pin || !caContractAddress || !endPoint || !aelfToken || !caHash) {
        throw new Error('Incorrect preposition parameter.');
      }

      const account = getManagerAccount(pin);
      if (!account) throw new Error('');

      const contract = await getContractBasic({
        contractAddress: caContractAddress,
        rpcUrl: endPoint,
        account: account,
      });
      const amount = timesDecimals(cryptoAmount, aelfToken.decimals).toFixed(0);

      const rawResult = await contract.encodedTx('ManagerForwardCall', {
        caHash,
        contractAddress: aelfToken.tokenContractAddress || '',
        methodName: 'Transfer',
        args: {
          symbol: aelfToken.symbol,
          to: `ELF_${address}_AELF`,
          amount,
          memo: '',
        },
        guardiansApproved,
      });
      if (!rawResult || !rawResult.data) {
        throw new Error('Failed to get raw transaction.');
      }

      const publicKey = (account.keyPair as any).getPublic('hex');

      const message = SparkMD5.hash(`${orderId}${rawResult.data}`);
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
    async (orderId: string, guardiansApproved?: GuardiansApprovedType[]) => {
      console.log('sell Transfer, Start', Date.now());
      try {
        Loading.show({ text: 'Payment is being processed and may take around 10 seconds to complete.' });
        await ramp.transferCrypto(orderId, orderInfo => paymentSellTransfer(orderInfo, guardiansApproved));

        CommonToast.success('Transaction completed.');
      } catch (error: any) {
        console.log('error', error);
        if (error?.code === 'TIMEOUT') {
          CommonToast.warn(error?.message || 'The waiting time is too long, it will be put on hold in the background.');
        } else {
          CommonToast.failError(error);
        }
      } finally {
        Loading.hide();
      }
      console.log('sell Transfer, End', Date.now());
    },
    [paymentSellTransfer],
  );
};
