import { ChainId } from '@portkey-wallet/types';
import { IAccountCryptoBoxAssetItem } from '@portkey-wallet/types/types-ca/token';
import { PaymentAssetInfo } from 'components/PaymentOverlay';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentCaInfoByChainId, getViewTokenContractByChainId } from 'utils/redux';

export function useUpdateAssetInfo(
  chainId: ChainId,
  assetInfo: PaymentAssetInfo,
  currentAssetInfo: IAccountCryptoBoxAssetItem | undefined,
) {
  const [updateAssetInfo, setUpdateAssetInfo] = useState<IAccountCryptoBoxAssetItem>();
  const getBalance = useCallback(
    async (symbol: string) => {
      const caInfo = getCurrentCaInfoByChainId(chainId);

      const tokenContract = await getViewTokenContractByChainId(chainId);
      const result = await tokenContract.callViewMethod('GetBalance', {
        symbol,
        owner: caInfo?.caAddress,
      });
      return result.data.balance;
    },
    [chainId],
  );
  useEffect(() => {
    if (!currentAssetInfo) {
      return;
    }
    if (assetInfo?.symbol) {
      (async () => {
        const balance = await getBalance(assetInfo.symbol);
        const update = { ...currentAssetInfo, balance };
        setUpdateAssetInfo(update);
      })();
    }
  }, [assetInfo.symbol, currentAssetInfo, getBalance]);
  return updateAssetInfo;
}
