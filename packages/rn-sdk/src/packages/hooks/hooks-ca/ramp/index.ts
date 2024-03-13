import { useAppCASelector } from '../../index';

export const useRampState = () => useAppCASelector(state => state.ramp);

export const useBuyFiatListState = () => useAppCASelector(state => state.ramp.buyFiatList);
export const useBuyDefaultFiatState = () => useAppCASelector(state => state.ramp.buyDefaultFiat);
export const useBuyDefaultCryptoListState = () => useAppCASelector(state => state.ramp.buyDefaultCryptoList);
export const useBuyDefaultCryptoState = () => useAppCASelector(state => state.ramp.buyDefaultCrypto);

export const useSellCryptoListState = () => useAppCASelector(state => state.ramp.sellCryptoList);
export const useSellDefaultCryptoState = () => useAppCASelector(state => state.ramp.sellDefaultCrypto);
export const useSellDefaultFiatListState = () => useAppCASelector(state => state.ramp.sellDefaultFiatList);
export const useSellDefaultFiatState = () => useAppCASelector(state => state.ramp.sellDefaultFiat);

export * from './buy';
export * from './sell';
