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
  imApiUrl?: string;
  imWsUrl?: string;
  imS3Bucket?: string;
  eBridgeUrl?: string;
  eTransferUrl?: string;
};
