import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { ZERO } from '@portkey-wallet/im-ui-web';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCallback, useEffect, useRef } from 'react';
import getSeed from 'utils/getSeed';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';

type CalculateCryptoGiftFeeParams = {
  amount: string | number;
  chainInfo: IChainItemType;
  caAddress: string;
  cryptoGiftFee: number | string;
  token: ICryptoBoxAssetItemType;
};
export const InsufficientTransactionFee = 'Insufficient transaction fee';
export function useCalculateCryptoGiftFee() {
  const privateKeyRef = useRef<string>('');
  const defaultToken = useDefaultToken();

  const getInitState = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) return;
    privateKeyRef.current = privateKey;
  }, []);

  useEffect(() => {
    getInitState();
  }, [getInitState]);

  return useCallback(
    async (params: CalculateCryptoGiftFeeParams) => {
      const { amount, chainInfo, caAddress, cryptoGiftFee: cryptoGiftFee, token } = params;

      const contract = new ExtensionContractBasic({
        privateKey: privateKeyRef.current,
        rpcUrl: chainInfo.endPoint,
        contractAddress: token.tokenContractAddress ?? token.address,
      });

      const list = [
        contract.callViewMethod('GetBalance', {
          symbol: token.symbol,
          owner: caAddress,
        }),
      ];
      if (defaultToken.symbol !== token.symbol) {
        list.push(
          contract.callViewMethod('GetBalance', {
            symbol: defaultToken.symbol,
            owner: caAddress,
          }),
        );
      }

      const [currentBalance, feeBalance] = await Promise.all(list);

      if (currentBalance.error) throw currentBalance.error;
      if (feeBalance?.error) throw feeBalance.error;

      if (feeBalance?.data) {
        if (ZERO.plus(cryptoGiftFee).gt(feeBalance?.data.balance)) throw new Error(InsufficientTransactionFee);
      } else {
        if (ZERO.plus(amount).plus(cryptoGiftFee).gt(currentBalance?.data.balance))
          throw new Error(InsufficientTransactionFee);
      }
      return timesDecimals(cryptoGiftFee, defaultToken.decimals).toString();
    },
    [defaultToken.decimals, defaultToken.symbol],
  );
}
