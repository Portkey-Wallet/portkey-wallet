import {
  useETransShow,
  useEntrance,
  useBridgeButtonShow,
  useSwapButtonShow,
  useNFTTabShow,
} from '@portkey-wallet/hooks/hooks-ca/cms';
import { IEntranceMatchValueMap } from '@portkey-wallet/types/types-ca/cms';
import { useMemo } from 'react';
import MatchValueMap from 'utils/matchValueMap';

export const useEntranceConfig = (): IEntranceMatchValueMap => {
  useMemo(() => {
    MatchValueMap.init();
  }, []);
  return MatchValueMap;
};

export const useAppEntrance = (isInit = false) => {
  const config = useEntranceConfig();
  return useEntrance(config, isInit);
};

export const useAppETransShow = () => {
  const config = useEntranceConfig();
  return useETransShow(config);
};

export const useAppBridgeButtonShow = () => {
  const config = useEntranceConfig();
  return useBridgeButtonShow(config);
};

export const useAppSwapButtonShow = () => {
  const config = useEntranceConfig();
  return useSwapButtonShow(config);
};

export const useAppNFTTabShow = () => {
  const config = useEntranceConfig();
  return useNFTTabShow(config);
};
