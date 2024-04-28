import { ChainItemType } from '@portkey-wallet/types/chain';
import { AccountType } from '@portkey-wallet/types/wallet';
import { ChainId } from '..';

export interface BaseToken {
  id?: string; // id
  decimals: number; // 8
  address: string; // "ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B",        token address  contract address
  symbol: string; // "ELF"   the name showed
}

export interface TokenItemType extends BaseToken {
  isDefault: boolean; // boolean,
  tokenName: string; //  "ELF"
  chainId: ChainId; // string "AELF"
}
export interface TokenItemShowType extends TokenItemType {
  isAdded?: boolean; // boolean
  balance?: string;
}

//  all Added TokenInfo（all chain all account tokenList）
export interface AddedTokenData {
  [rpcUrl: string]: AddedChainTokenDataType;
}

export interface AddedChainTokenDataType {
  [accountAddress: string]: TokenItemType[];
}

export type TokenListShowInMarketType = TokenItemShowType[];

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
  addedTokenData: AddedTokenData;
  tokenDataShowInMarket: TokenListShowInMarketType;
  isFetchingTokenList: Boolean;
}

export interface AccountItemType {
  address: string;
  name: string;
}

export interface HandleTokenArgTypes {
  tokenItem: TokenItemType;
  currentChain: ChainItemType;
  currentAccount: AccountType;
}

export type FetchParamsType = Pick<HandleTokenArgTypes, 'currentChain' | 'currentAccount'> & {
  pageSize: number;
  pageNo: number;
};
