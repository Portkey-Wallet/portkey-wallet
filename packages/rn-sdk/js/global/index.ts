import { ChainId } from '@portkey-wallet/types';

export enum EndPoints {
  MAIN_NET = 'https://did-portkey.portkey.finance',
  TEST_NET = 'https://did-portkey-test.portkey.finance',
  TEST1 = 'https://localtest-applesign.portkey.finance',
  TEST2 = 'https://localtest-applesign2.portkey.finance',
}

export interface PortkeyConfigInterface {
  endPointUrl: string;
  currChainId: ChainId;
}

export let PortkeyConfig: PortkeyConfigInterface = {
  endPointUrl: EndPoints.MAIN_NET,
  currChainId: 'AELF',
};

export const setEndPointUrl = (environment: EndPoints) => {
  PortkeyConfig.endPointUrl = environment;
};

export const setCurrChainId = (chainId: ChainId) => {
  PortkeyConfig.currChainId = chainId;
};
