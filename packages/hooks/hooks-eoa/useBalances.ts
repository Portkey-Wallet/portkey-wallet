import { useCallback, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import useInterval from '../useInterval';
import { useAppEOASelector } from './index';
import AElf from 'aelf-sdk';
import { TokenItemType } from '@portkey-wallet/types/types-eoa/token';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { getDefaultWallet } from '@portkey-wallet/utils/aelfUtils';

const bigNAN = new BigNumber('');

interface useBalancesProps {
  tokens: TokenItemType | TokenItemType[];
  tokenAddress: string;
  rpcUrl: string;
  delay?: number;
}

const wallet1 = getDefaultWallet();

const useBalances = ({ tokens, tokenAddress, rpcUrl, delay = 10000 }: useBalancesProps): [BigNumber[], () => void] => {
  const deArr = useMemo(() => (Array.isArray(tokens) ? tokens.map(() => bigNAN) : [bigNAN]), [tokens]);
  const [balances, setBalances] = useState<BigNumber[]>(deArr);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { currentChain } = useAppEOASelector(state => state.chain);

  const getTokenContract = useCallback(async () => {
    if (!rpcUrl) return;
    const aelf = new AElf(new AElf.providers.HttpProvider(rpcUrl));
    return await aelf.chain.contractAt(tokenAddress, wallet1);
  }, [tokenAddress, rpcUrl]);

  const onGetBalance = useCallback(async () => {
    const tokensList = Array.isArray(tokens) ? tokens.map(item => item.symbol) : [tokens.symbol];
    if (!currentAccount?.address) return setBalances(tokensList.map(() => bigNAN));
    let promise;

    if (currentChain.chainType === 'aelf') {
      // elf chain
      // const contract = tokenContract;
      const tokenContract = await getTokenContract();
      if (!tokenContract) return;
      promise = tokensList.map(symbol => {
        if (symbol) return getELFChainBalance(tokenContract, symbol, currentAccount?.address);
      });
    } else if (currentChain.chainType === 'ethereum') {
      // erc20 chain
      // promise = tokensList.map(i => {
      //   if (i && library) return getBalance(library, i, account);
      // });
      return;
    } else {
      // other not support
      throw Error('Not Support');
    }
    if (!promise) throw Error('Something error');
    const bs = await Promise.all(promise);

    setBalances(bs?.map(i => new BigNumber(i ?? '')));
  }, [currentAccount?.address, currentChain.chainType, getTokenContract, tokens]);

  useInterval(onGetBalance, [onGetBalance], delay);

  return [balances, onGetBalance];
};

export default useBalances;
