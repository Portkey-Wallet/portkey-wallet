import { ChainId, ChainType, NetworkType } from '@portkey-wallet/types';
export type NetworkItem = {
  name: string;
  walletType: ChainType;
  networkType: NetworkType;
  isActive?: boolean;
  apiUrl: string;
  domain?: string;
  graphqlUrl: string;
  networkIconUrl?: string;
  connectUrl: string;
  tokenClaimContractAddress?: string;
  cmsUrl?: string;
  s3Url?: string;
  referralUrl?: string;
  cryptoGiftUrl?: string;
  portkeyFinanceUrl?: string; // portkey website url
  portkeyOpenLoginUrl?: string; // web page
  buyConfig?: {
    ach?: {
      appId?: string;
      baseUrl?: string;
    };
  };
  imApiUrl?: string;
  imWsUrl?: string;
  imS3Bucket?: string;
  eBridgeUrl?: string;
  eTransferUrl?: string;
  awakenUrl?: string;
  schrodingerUrl?: string;
  sgrSchrodingerUrl?: string;
  eTransferCA?: {
    [x in ChainId]?: string;
  };
};
