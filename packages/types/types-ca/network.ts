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
  cmsUrl?: string;
  s3Url?: string;
  portkeyFinanceUrl?: string; // portkey website url
  buyConfig?: {
    ach?: {
      appId?: string;
      baseUrl?: string;
    };
  };
};
