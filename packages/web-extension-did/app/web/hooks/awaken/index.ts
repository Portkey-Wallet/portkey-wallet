import { useCallback, useMemo, useState } from 'react';
import { useSwapHookContractAddress } from '@portkey-wallet/hooks/hooks-ca/awaken';
import { useCurrentChain, useDAppChainId } from '@portkey-wallet/hooks/hooks-ca/chainList';
import BigNumber from 'bignumber.js';
import useInterval from '@portkey-wallet/hooks/useInterval';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { COMMON_PRIVATE } from '@portkey-wallet/constants';

export const useGetSwapHookViewContract = () => {
  const contractAddress = useSwapHookContractAddress();
  const chainId = useDAppChainId();
  const currentChain = useCurrentChain(chainId);

  return useCallback(() => {
    if (!currentChain) throw new Error('invalid chain info');
    return new ExtensionContractBasic({
      rpcUrl: currentChain.endPoint,
      contractAddress,
      privateKey: COMMON_PRIVATE,
    });
  }, [contractAddress, currentChain]);
};

export type TBalancesV2 = { [symbol: string]: BigNumber } | undefined;

const bigNAN = new BigNumber('');
export const useBalancesV2 = (
  // address || symbol
  tokens?: string | Array<string | undefined>,
  delay: null | number = 10000,
): [TBalancesV2, () => void] => {
  const deArr: TBalancesV2 | undefined = useMemo(() => {
    if (!tokens) return;
    if (Array.isArray(tokens)) {
      return tokens.reduce((acc: any, symbol) => {
        if (symbol) {
          acc[symbol] = bigNAN;
          return acc;
        }
        return acc;
      }, {});
    }
    return { [tokens]: bigNAN };
  }, [tokens]);
  const [balances, setBalances] = useState<TBalancesV2>(deArr);
  const chainId = useDAppChainId();
  const currentChain = useCurrentChain(chainId);
  const wallet = useCurrentWalletInfo();
  const account = useMemo(() => wallet[chainId]?.caAddress, [chainId, wallet]);

  const onGetBalance = useCallback(async () => {
    const tokensList = Array.isArray(tokens) ? tokens : [tokens];

    if (!account || !currentChain) {
      return setBalances(
        tokensList.reduce((acc: any, symbol) => {
          if (symbol) {
            acc[symbol] = bigNAN;
            return acc;
          }
          return acc;
        }, {}),
      );
    }
    // elf chain
    const contract = new ExtensionContractBasic({
      rpcUrl: currentChain.endPoint,
      contractAddress: currentChain.defaultToken.address,
      privateKey: COMMON_PRIVATE,
    });

    if (!contract) return;
    const bs: TBalancesV2 = {};
    const promise = tokensList.map(async (symbol) => {
      if (symbol) {
        const _symbol = symbol;
        const balance = await getELFChainBalance(contract, _symbol, account);
        bs[_symbol] = ZERO.plus(balance ?? '');
      }
    });
    await Promise.all(promise);

    setBalances(bs);
  }, [account, currentChain, tokens]);

  useInterval(onGetBalance, [onGetBalance], delay);

  return [balances, onGetBalance];
};

export const useCurrencyBalancesV2 = (symbols: string[], delay: null | number = 10000) => {
  const [bs] = useBalancesV2(symbols, delay);
  return bs;
};
