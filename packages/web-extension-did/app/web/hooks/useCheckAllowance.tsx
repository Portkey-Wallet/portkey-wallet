import { getAvailableAllowance } from '@portkey-wallet/utils/contract';
import { sleep } from '@portkey-wallet/utils';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ZERO } from '@portkey-wallet/im-ui-web';
import { ChainId } from '@portkey-wallet/types';
import { useCallback, useEffect, useRef } from 'react';
import getSeed from 'utils/getSeed';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';

type TTokenDetail = {
  chainId: ChainId;
  symbol: string;
  decimals: number;
  alias?: string;
  contractAddress: string;
};

export interface ICheckAllowanceAndApproveParams {
  tokenInfo: TTokenDetail;
  spender: string;
  bigAmount: number | string;
  chainInfo: ChainItemType;
  caAddress: string;
}
export const useCheckAllowance = () => {
  const privateKeyRef = useRef<string>('');
  const getInitState = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) return;
    privateKeyRef.current = privateKey;
  }, []);
  useEffect(() => {
    getInitState();
  }, [getInitState]);

  return useCallback(async (params: ICheckAllowanceAndApproveParams) => {
    const { tokenInfo, spender, bigAmount, chainInfo, caAddress } = params;

    const tokenContract = new ExtensionContractBasic({
      privateKey: privateKeyRef.current,
      rpcUrl: chainInfo.endPoint,
      contractAddress: tokenInfo.contractAddress,
    });

    const startTime = Date.now();
    const allowance = await getAvailableAllowance(tokenContract, {
      owner: caAddress,
      spender,
      symbol: tokenInfo.symbol,
    });
    const diffTime = Date.now() - startTime;
    if (diffTime < 500) {
      await sleep(500 - diffTime);
    }

    if (ZERO.plus(bigAmount).gt(allowance)) {
      return false;
    }
    return true;
  }, []);
};
