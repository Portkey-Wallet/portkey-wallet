import { ChainId } from '..';
import { ChainItemType } from '../chain';
import { AccountType } from '../wallet';
import { SeedTypeEnum } from './assets';

export interface BaseToken {
  id?: string; // id
  chainId: ChainId;
  decimals: number; // 8
  address: string; // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        token address  contract address
  symbol: string; // "ELF"   the name showed
  name: string;
  imageUrl?: string;
  alias?: string;
  tokenId?: string; // nft tokenId
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  inscriptionName?: string;
  limitPerMint?: number;
  expires?: string;
  seedOwnedSymbol?: string;
}

export interface TokenItemType extends BaseToken {
  isDefault?: boolean; // boolean,
  tokenName?: string; //  "ELF"
  chainId: ChainId; // string "AELF"
}
export interface TokenItemShowType extends TokenItemType {
  isAdded?: boolean; // boolean
  tokenContractAddress?: string;
  imageUrl?: string;
  balance?: string;
  balanceInUsd?: string;
  price?: string | number;
  userTokenId?: string;
}

export type UserTokenItemTokenType = Omit<BaseToken, 'name'> & { chainId: string };

export interface UserTokenItemType {
  userId: string;
  id: string; // user-token-id
  isDisplay: boolean;
  isDefault: boolean;
  token: UserTokenItemTokenType;
}

//  all Added TokenInfo（all chain all account tokenList）
export interface AddedTokenData {
  [rpcUrl: string]: TokenItemType[];
}

export type TokenListShowInMarketType = TokenItemShowType[];

// add-token list
export type UserTokenListType = UserTokenItemType[];

export interface IAccountCryptoBoxAssetItem {
  chainId: ChainId;
  address: string;
  symbol: string;
  imageUrl: string;
  decimals: number | string;
  alias?: string;
  tokenId?: string;
  balance?: string;
  tokenContractAddress?: string;
}

export type UseTokenListAddType = (
  currentChain: ChainItemType,
  currentAccount: AccountType,
) => ({ symbol }: { symbol: string }) => void;

export type UseTokenDeleteType = (
  currentChain: ChainItemType,
  currentAccount: AccountType,
) => ({ symbol }: { symbol: string }) => void;

export type FilterTokenList = (token_name: string, address: string) => TokenItemShowType;

export interface TokenState {
  isFetching: boolean;
  // addedTokenData: AddedTokenData;
  tokenDataShowInMarket: TokenItemShowType[];
  skipCount: number;
  maxResultCount: number;
  totalRecordCount: number;
  symbolImages: Record<string, string>;
}

export interface AccountItemType {
  address: string;
  name: string;
}

export interface HandleTokenArgTypes {
  tokenItem: TokenItemType;
  currentAccount: AccountType;
}

export type FetchParamsType = Pick<HandleTokenArgTypes, 'currentAccount'> & {
  pageSize: number;
  pageNo: number;
};
