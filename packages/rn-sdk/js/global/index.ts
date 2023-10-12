import { ChainId } from '@portkey-wallet/types';
import { NetworkController } from 'network/controller';
import { GlobalStorage } from 'service/storage';

export enum EndPoints {
  MAIN_NET = 'https://did-portkey.portkey.finance',
  TEST_NET = 'https://did-portkey-test.portkey.finance',
  TEST1 = 'https://localtest-applesign.portkey.finance',
  TEST2 = 'https://localtest-applesign2.portkey.finance',
}

enum ConfigIdentifier {
  END_POINT = 'endPointUrl',
  CURR_CHAIN_ID = 'currChainId',
}

export interface PortkeyConfigInterface {
  endPointUrl: () => string;
  currChainId: () => ChainId;
}

export const PortkeyConfig: PortkeyConfigInterface = {
  endPointUrl: () => getConfigStr(ConfigIdentifier.END_POINT) || EndPoints.MAIN_NET,
  currChainId: () => (getConfigStr(ConfigIdentifier.CURR_CHAIN_ID) || 'AELF') as ChainId,
};

const getConfigStr = (key: string): string | undefined => {
  return GlobalStorage.getString(key);
};

const setConfigStr = (key: string, value: string) => {
  GlobalStorage.set(key, value);
};

export const setEndPointUrl = (environment: EndPoints) => {
  setConfigStr(ConfigIdentifier.END_POINT, environment);
  NetworkController.updateEndPointUrl(environment);
};

export const setCurrChainId = (chainId: ChainId) => {
  setConfigStr(ConfigIdentifier.CURR_CHAIN_ID, chainId);
};
