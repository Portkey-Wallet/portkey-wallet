import { ChainType, NetworkType } from '@portkey-wallet/types';
export type NetworkItem = {
  name: string;
  walletType: ChainType;
  networkType: NetworkType;
  isActive?: boolean;
  apiUrl: string;
  graphqlUrl: string;
  networkIconUrl?: string;
  connectUrl: string;
  tokenClaimContractAddress?: string;
};
