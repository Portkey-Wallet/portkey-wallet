import { ITokenItemResponse, IUserTokenItem } from 'network/dto/query';
import BigNumber from 'bignumber.js';
import { createContext } from 'react';
import { NFTCollectionItemShowType } from '@portkey-wallet/types/types-ca/assets';

export interface AssetsContextType {
  balanceList: Array<ITokenItemResponse>;
  updateBalanceList: () => Promise<void>;
  allOfTokensList: Array<IUserTokenItem>;
  updateTokensList: () => Promise<void>;
  nftCollections: Array<NFTCollectionItemShowType>;
  updateNftCollections: (config?: { symbol?: string; skipCount?: number; maxResultCount?: number }) => Promise<void>;
  balanceUSD: BigNumber;
}

const AssetsContext = createContext<AssetsContextType>({
  balanceList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateBalanceList: async () => {},
  allOfTokensList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateTokensList: async () => {},
  balanceUSD: new BigNumber(0),
  nftCollections: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateNftCollections: async () => {},
});

export default AssetsContext;
