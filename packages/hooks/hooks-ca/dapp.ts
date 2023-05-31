import { useAppCASelector } from '.';

export const useDapp = () => useAppCASelector(state => state.dapp);
