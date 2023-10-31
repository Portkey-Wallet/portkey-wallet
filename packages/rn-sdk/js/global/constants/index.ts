import { ChainId } from '@portkey-wallet/types';
import { GlobalStorage } from 'service/storage';

export enum EndPoints {
  MAIN_NET = 'https://did-portkey.portkey.finance',
  TEST_NET = 'https://did-portkey-test.portkey.finance',
}

enum ConfigIdentifier {
  END_POINT = 'endPointUrl',
  CURR_CHAIN_ID = 'currChainId',
}

export interface PortkeyConfigInterface {
  endPointUrl: () => Promise<string>;
  currChainId: () => Promise<ChainId>;
}

export const PortkeyConfig: PortkeyConfigInterface = {
  endPointUrl: async () => {
    return (await getConfigStr(ConfigIdentifier.END_POINT)) || EndPoints.TEST_NET;
  },
  currChainId: async () => {
    return ((await getConfigStr(ConfigIdentifier.CURR_CHAIN_ID)) as ChainId) || 'AELF';
  },
};

const getConfigStr = (key: string): Promise<string | undefined> => {
  return GlobalStorage.getString(key);
};

const setConfigStr = (key: string, value: string) => {
  GlobalStorage.set(key, value);
};

export const setEndPointUrl = (environment: EndPoints | string) => {
  setConfigStr(ConfigIdentifier.END_POINT, environment);
};

export const setCurrChainId = (chainId: ChainId) => {
  setConfigStr(ConfigIdentifier.CURR_CHAIN_ID, chainId);
};
