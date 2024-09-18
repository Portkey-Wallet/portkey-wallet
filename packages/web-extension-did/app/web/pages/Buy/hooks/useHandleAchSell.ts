import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCallback, useMemo } from 'react';
import { useLoading } from 'store/Provider/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import getTransactionRaw from 'utils/sandboxUtil/getTransactionRaw';
import AElf from 'aelf-sdk';
import { getWallet } from '@portkey-wallet/utils/aelf';
import SparkMD5 from 'spark-md5';
import ramp, { IOrderInfo } from '@portkey-wallet/ramp';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import getSeed from 'utils/getSeed';
import { chromeStorage } from 'store/utils';
import singleMessage from 'utils/singleMessage';
import { StorageKeyType } from 'utils/storage/storage';

export const useHandleAchSell = () => {
  const { setLoading } = useLoading();

  const { accountTokenList } = useAccountTokenInfo();
  const aelfToken = useMemo(() => {
    const _target = accountTokenList.find((item) => item.symbol === ELF_SYMBOL);
    const _token = _target?.tokens.find((ele) => ele.chainId === MAIN_CHAIN_ID);
    return { ..._target, ..._token };
  }, [accountTokenList]);
  const chainInfo = useCurrentChain(MAIN_CHAIN_ID);
  const wallet = useCurrentWalletInfo();
  const currentNetwork = useCurrentNetworkInfo();

  const paymentSellTransfer = useCallback(
    async (params: IOrderInfo) => {
      if (!chainInfo) throw new Error('Sell Transfer: No ChainInfo');

      const { privateKey } = await getSeed();
      if (!privateKey) throw new Error('Sell Transfer: No PrivateKey');

      if (!aelfToken) throw new Error('Sell Transfer: No Token');
      const manager = getWallet(privateKey);
      if (!manager?.keyPair) throw new Error('Sell Transfer: No keyPair');
      const guardiansApprovedStr = await chromeStorage.getItem(
        `RampSellApproveList_${params.orderId}` as StorageKeyType,
      );
      let guardiansApprovedParse;
      try {
        guardiansApprovedParse =
          typeof guardiansApprovedStr === 'string' && guardiansApprovedStr.length > 0
            ? JSON.parse(guardiansApprovedStr)
            : undefined;
      } catch (error) {
        console.log('json parse error');
        guardiansApprovedParse = undefined;
      }

      const rawResult = await getTransactionRaw({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo?.endPoint || '',
        chainType: currentNetwork.walletType,
        methodName: 'ManagerForwardCall',
        privateKey,
        paramsOption: {
          caHash: wallet?.caHash || '',
          contractAddress: aelfToken.tokenContractAddress || '',
          methodName: 'Transfer',
          args: {
            symbol: aelfToken.symbol,
            to: `ELF_${params.address}_AELF`,
            amount: timesDecimals(params.cryptoAmount, aelfToken.decimals).toNumber(),
          },
          guardiansApproved: guardiansApprovedParse,
        },
      });
      if (!rawResult || !rawResult.result) {
        throw new Error('Failed to get raw transaction.');
      }
      await chromeStorage.removeItem(`RampSellApproveList_${params.orderId}`);
      const publicKey = manager.keyPair.getPublic('hex');
      const message = SparkMD5.hash(`${params.orderId}${rawResult.result.data}`);
      const signature = AElf.wallet.sign(Buffer.from(message).toString('hex'), manager.keyPair).toString('hex');
      return {
        rawTransaction: rawResult.result.data,
        publicKey,
        signature,
      };
    },
    [aelfToken, chainInfo, currentNetwork.walletType, wallet?.caHash],
  );

  return useCallback(
    async (orderId: string) => {
      try {
        setLoading(true, 'Payment is being processed and may take around 10 seconds to complete.');
        await ramp.transferCrypto(orderId, paymentSellTransfer);
        singleMessage.success('Transaction completed.');
      } catch (error: any) {
        if (error?.code === 'TIMEOUT') {
          singleMessage.warning(
            error?.message || 'The waiting time is too long, it will be put on hold in the background.',
          );
        } else {
          singleMessage.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [paymentSellTransfer, setLoading],
  );
};
