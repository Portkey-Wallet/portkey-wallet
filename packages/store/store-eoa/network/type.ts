import { NetworkType } from '@portkey-wallet/types';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';

export type TNetworkState = {
  currentNetwork: NetworkType;
  chainListMap: { [key in NetworkType]?: IChainItemType[] };
};
