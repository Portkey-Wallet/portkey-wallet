import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useAssets } from '@portkey-wallet/hooks/hooks-ca/assets';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSellTransfer } from '@portkey-wallet/hooks/hooks-ca/payment';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AchTxAddressReceivedType } from '@portkey-wallet/types/types-ca/payment';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { usePin } from 'hooks/store';
import { useCallback, useMemo } from 'react';
import { getManagerAccount } from 'utils/redux';
import sameChainTransfer from 'utils/transfer/sameChainTransfer';

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
    async (params: AchTxAddressReceivedType) => {
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
        throw new Error('');
      }

      const account = getManagerAccount(pin);
      if (!account) throw new Error('');

      const contract = await getContractBasic({
        contractAddress: caContractAddress,
        rpcUrl: endPoint,
        account: account,
      });

      const amount = timesDecimals(params.cryptoAmount, decimals).toNumber();
      return await sameChainTransfer({
        contract,
        tokenInfo: { ...aelfToken, address: aelfToken.tokenContractAddress || '' },
        caHash: caHash,
        amount,
        toAddress: `ELF_${params.address}_AELF`,
      });
    },
    [aelfToken, chainInfo, pin, wallet],
  );

  return useCallback(
    async (orderId: string) => {
      try {
        Loading.show();
        await sellTransfer({
          merchantName: ACH_MERCHANT_NAME,
          orderId,
          paymentSellTransfer,
        });
      } catch (error) {
        console.log('error', error);
        CommonToast.fail('Transfer Error');
      } finally {
        Loading.hide();
      }
    },
    [paymentSellTransfer, sellTransfer],
  );
};
