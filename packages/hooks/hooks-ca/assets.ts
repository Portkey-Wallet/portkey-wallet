import { useAppCASelector } from '.';

export const useAssets = () => useAppCASelector(state => state.assets);
