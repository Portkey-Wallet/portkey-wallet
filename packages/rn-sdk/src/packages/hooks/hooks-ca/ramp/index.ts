import { useRnSDKSelector } from 'store';

export const useRampState = () => useRnSDKSelector(state => state.ramp);

export const useBuyFiatListState = () => useRnSDKSelector(state => state.ramp.buyFiatList);
export const useBuyDefaultFiatState = () => useRnSDKSelector(state => state.ramp.buyDefaultFiat);
export const useBuyDefaultCryptoListState = () => useRnSDKSelector(state => state.ramp.buyDefaultCryptoList);
export const useBuyDefaultCryptoState = () => useRnSDKSelector(state => state.ramp.buyDefaultCrypto);

export const useSellCryptoListState = () => useRnSDKSelector(state => state.ramp.sellCryptoList);
export const useSellDefaultCryptoState = () => useRnSDKSelector(state => state.ramp.sellDefaultCrypto);
export const useSellDefaultFiatListState = () => useRnSDKSelector(state => state.ramp.sellDefaultFiatList);
export const useSellDefaultFiatState = () => useRnSDKSelector(state => state.ramp.sellDefaultFiat);

export * from './buy';
export * from './sell';
