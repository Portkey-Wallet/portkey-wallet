import { ZERO } from '@portkey-wallet/constants/misc';
import { fetchTokensPriceAsync } from '@portkey-wallet/store/store-eoa/assets/slice';
import { divDecimals, formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { useCallback, useEffect } from 'react';
import { useAppEOASelector, useAppCommonDispatch } from '../index';
import { useIsMainnet } from './network';
import { useDefaultToken } from './chainList';
import { useSymbolList } from './useToken';

export function useDefaultTokenPrice() {
  const defaultToken = useDefaultToken();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  return tokenPriceObject?.[defaultToken.symbol] || 0;
}

export function useGetCurrentAccountTokenPrice(): [
  Record<string, number | string>,
  (symbol?: string) => void,
  (symbols: string[]) => void,
] {
  const assets = useAppEOASelector(state => state.assets);
  const dispatch = useAppCommonDispatch();
  // const symbols = useSymbolList();

  // const symbolsRef = useRef<string[]>([]);

  // TODO: update token price
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTokenPrice = useCallback((_?: string) => {
    // if (symbols.length === 0) return;
    // if (symbolsRef.current.toString() === symbols.toString()) return;
    // symbolsRef.current = symbols;
    // dispatch(fetchTokensPriceAsync({ symbols: symbol ? [symbol] : symbols }));
  }, []);

  const getTokensPrice = useCallback(
    (symbols: string[]) => {
      dispatch(fetchTokensPriceAsync({ symbols }));
    },
    [dispatch],
  );

  return [assets?.tokenPrices?.tokenPriceObject, getTokenPrice, getTokensPrice];
}

export function useFreshTokenPrice() {
  const [, getTokenPrice] = useGetCurrentAccountTokenPrice();
  const isMainnet = useIsMainnet();
  const symbols = useSymbolList();

  useEffect(() => {
    if (isMainnet) {
      getTokenPrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols, isMainnet]);
}

export function useAmountInUsdShow() {
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  return useCallback(
    (balance: string | number, decimals: number | string, symbol: string) =>
      tokenPriceObject[symbol] === 0
        ? ''
        : formatAmountUSDShow(divDecimals(balance, decimals).times(tokenPriceObject[symbol])),
    [tokenPriceObject],
  );
}

export function useIsTokenHasPrice(symbol?: string): boolean {
  const {
    tokenPrices: { tokenPriceObject },
  } = useAppEOASelector(state => state.assets);
  if (!symbol) return false;
  if (!tokenPriceObject[symbol]) return false;

  return ZERO.plus(tokenPriceObject[symbol]).isGreaterThan(0);
}
