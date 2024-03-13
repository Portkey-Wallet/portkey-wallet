import { BackEndNetWorkMap } from 'packages/constants/constants-ca/backend-network';
import { ChainId } from 'packages/types';
import { GlobalStorage } from 'service/storage';

// Now using v2 on mainnet/testnet/test4, v1/test1 is deprecated
export const EndPoints = {
  MAIN_NET: BackEndNetWorkMap['back-end-mainnet-v2'].apiUrl,
  TEST_NET: BackEndNetWorkMap['back-end-testnet-v2'].apiUrl,
  TEST1: BackEndNetWorkMap['back-end-test1'].apiUrl,
};

export type EndPoints = (typeof EndPoints)[keyof typeof EndPoints];

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
    return (await getConfigStr(ConfigIdentifier.END_POINT)) || EndPoints.MAIN_NET;
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
