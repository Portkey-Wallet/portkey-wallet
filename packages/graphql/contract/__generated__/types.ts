export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: number;
};

export enum BlockFilterType {
  Block = 'BLOCK',
  LogEvent = 'LOG_EVENT',
  Transaction = 'TRANSACTION',
}

export type CaHolderInfoDto = {
  __typename?: 'CAHolderInfoDto';
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  guardianList?: Maybe<GuardianList>;
  id?: Maybe<Scalars['String']>;
  managerInfos?: Maybe<Array<Maybe<ManagerInfo>>>;
  originChainId?: Maybe<Scalars['String']>;
};

export type CaHolderManagerChangeRecordDto = {
  __typename?: 'CAHolderManagerChangeRecordDto';
  blockHeight: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  changeType?: Maybe<Scalars['String']>;
  manager?: Maybe<Scalars['String']>;
};

export type CaHolderManagerDto = {
  __typename?: 'CAHolderManagerDto';
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  managerInfos?: Maybe<Array<Maybe<ManagerInfo>>>;
  originChainId?: Maybe<Scalars['String']>;
};

export type CaHolderNftBalanceInfoDto = {
  __typename?: 'CAHolderNFTBalanceInfoDto';
  balance: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  nftInfo?: Maybe<NftItemInfoDto>;
};

export type CaHolderNftBalancePageResultDto = {
  __typename?: 'CAHolderNFTBalancePageResultDto';
  data?: Maybe<Array<Maybe<CaHolderNftBalanceInfoDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type CaHolderNftCollectionBalanceInfoDto = {
  __typename?: 'CAHolderNFTCollectionBalanceInfoDto';
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  nftCollectionInfo?: Maybe<NftCollectionDto>;
  tokenIds?: Maybe<Array<Scalars['Long']>>;
};

export type CaHolderNftCollectionBalancePageResultDto = {
  __typename?: 'CAHolderNFTCollectionBalancePageResultDto';
  data?: Maybe<Array<Maybe<CaHolderNftCollectionBalanceInfoDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type CaHolderSearchTokenNftDto = {
  __typename?: 'CAHolderSearchTokenNFTDto';
  balance: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  nftInfo?: Maybe<NftItemInfoDto>;
  tokenId: Scalars['Long'];
  tokenInfo?: Maybe<TokenInfoDto>;
};

export type CaHolderSearchTokenNftPageResultDto = {
  __typename?: 'CAHolderSearchTokenNFTPageResultDto';
  data?: Maybe<Array<Maybe<CaHolderSearchTokenNftDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type CaHolderTokenBalanceDto = {
  __typename?: 'CAHolderTokenBalanceDto';
  balance: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  tokenIds?: Maybe<Array<Scalars['Long']>>;
  tokenInfo?: Maybe<TokenInfoDto>;
};

export type CaHolderTokenBalancePageResultDto = {
  __typename?: 'CAHolderTokenBalancePageResultDto';
  data?: Maybe<Array<Maybe<CaHolderTokenBalanceDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type CaHolderTransactionAddressDto = {
  __typename?: 'CAHolderTransactionAddressDto';
  address?: Maybe<Scalars['String']>;
  addressChainId?: Maybe<Scalars['String']>;
  caAddress?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  transactionTime: Scalars['Long'];
};

export type CaHolderTransactionAddressPageResultDto = {
  __typename?: 'CAHolderTransactionAddressPageResultDto';
  data?: Maybe<Array<Maybe<CaHolderTransactionAddressDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type CaHolderTransactionDto = {
  __typename?: 'CAHolderTransactionDto';
  blockHash?: Maybe<Scalars['String']>;
  blockHeight: Scalars['Long'];
  chainId?: Maybe<Scalars['String']>;
  fromAddress?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  methodName?: Maybe<Scalars['String']>;
  nftInfo?: Maybe<NftItemInfoDto>;
  previousBlockHash?: Maybe<Scalars['String']>;
  status: TransactionStatus;
  timestamp: Scalars['Long'];
  tokenInfo?: Maybe<TokenInfoDto>;
  transactionFees?: Maybe<Array<Maybe<TransactionFee>>>;
  transactionId?: Maybe<Scalars['String']>;
  transferInfo?: Maybe<TransferInfo>;
};

export type CaHolderTransactionPageResultDto = {
  __typename?: 'CAHolderTransactionPageResultDto';
  data?: Maybe<Array<Maybe<CaHolderTransactionDto>>>;
  totalRecordCount: Scalars['Long'];
};

export type GetCaHolderInfoDto = {
  caAddress?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  caHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  loginGuardianIdentifierHash?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetCaHolderManagerChangeRecordDto = {
  chainId?: InputMaybe<Scalars['String']>;
  endBlockHeight: Scalars['Long'];
  startBlockHeight: Scalars['Long'];
};

export type GetCaHolderManagerInfoDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  caHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  manager?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetCaHolderNftCollectionInfoDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type GetCaHolderNftInfoDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  collectionSymbol?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type GetCaHolderSearchTokenNftDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  searchWord?: InputMaybe<Scalars['String']>;
  skipCount: Scalars['Int'];
};

export type GetCaHolderTokenBalanceDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type GetCaHolderTransactionAddressDto = {
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetCaHolderTransactionDto = {
  blockHash?: InputMaybe<Scalars['String']>;
  caAddresses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  chainId?: InputMaybe<Scalars['String']>;
  endBlockHeight: Scalars['Long'];
  maxResultCount: Scalars['Int'];
  methodNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  skipCount: Scalars['Int'];
  startBlockHeight: Scalars['Long'];
  symbol?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['String']>;
  transferTransactionId?: InputMaybe<Scalars['String']>;
};

export type GetLoginGuardianChangeRecordDto = {
  chainId?: InputMaybe<Scalars['String']>;
  endBlockHeight: Scalars['Long'];
  startBlockHeight: Scalars['Long'];
};

export type GetLoginGuardianInfoDto = {
  caAddress?: InputMaybe<Scalars['String']>;
  caHash?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
  loginGuardian?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
};

export type GetSyncStateDto = {
  chainId?: InputMaybe<Scalars['String']>;
  filterType: BlockFilterType;
};

export type GetTokenInfoDto = {
  chainId?: InputMaybe<Scalars['String']>;
  maxResultCount: Scalars['Int'];
  skipCount: Scalars['Int'];
  symbol?: InputMaybe<Scalars['String']>;
};

export type Guardian = {
  __typename?: 'Guardian';
  identifierHash?: Maybe<Scalars['String']>;
  isLoginGuardian: Scalars['Boolean'];
  salt?: Maybe<Scalars['String']>;
  type: Scalars['Int'];
  verifierId?: Maybe<Scalars['String']>;
};

export type GuardianDto = {
  __typename?: 'GuardianDto';
  identifierHash?: Maybe<Scalars['String']>;
  isLoginGuardian: Scalars['Boolean'];
  salt?: Maybe<Scalars['String']>;
  type: Scalars['Int'];
  verifierId?: Maybe<Scalars['String']>;
};

export type GuardianList = {
  __typename?: 'GuardianList';
  guardians?: Maybe<Array<Maybe<Guardian>>>;
};

export type LoginGuardianChangeRecordDto = {
  __typename?: 'LoginGuardianChangeRecordDto';
  blockHeight: Scalars['Long'];
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  changeType?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  loginGuardian?: Maybe<GuardianDto>;
  manager?: Maybe<Scalars['String']>;
};

export type LoginGuardianDto = {
  __typename?: 'LoginGuardianDto';
  caAddress?: Maybe<Scalars['String']>;
  caHash?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  loginGuardian?: Maybe<GuardianDto>;
  manager?: Maybe<Scalars['String']>;
};

export type ManagerInfo = {
  __typename?: 'ManagerInfo';
  address?: Maybe<Scalars['String']>;
  extraData?: Maybe<Scalars['String']>;
};

export type NftCollectionDto = {
  __typename?: 'NFTCollectionDto';
  decimals: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  isBurnable: Scalars['Boolean'];
  issueChainId: Scalars['Int'];
  issuer?: Maybe<Scalars['String']>;
  supply: Scalars['Long'];
  symbol?: Maybe<Scalars['String']>;
  tokenContractAddress?: Maybe<Scalars['String']>;
  tokenName?: Maybe<Scalars['String']>;
  totalSupply: Scalars['Long'];
};

export type NftItemInfoDto = {
  __typename?: 'NFTItemInfoDto';
  collectionName?: Maybe<Scalars['String']>;
  collectionSymbol?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  isBurnable: Scalars['Boolean'];
  issueChainId: Scalars['Int'];
  issuer?: Maybe<Scalars['String']>;
  supply: Scalars['Long'];
  symbol?: Maybe<Scalars['String']>;
  tokenContractAddress?: Maybe<Scalars['String']>;
  tokenName?: Maybe<Scalars['String']>;
  totalSupply: Scalars['Long'];
};

export type Query = {
  __typename?: 'Query';
  caHolderInfo?: Maybe<Array<Maybe<CaHolderInfoDto>>>;
  caHolderManagerChangeRecordInfo?: Maybe<Array<Maybe<CaHolderManagerChangeRecordDto>>>;
  caHolderManagerInfo?: Maybe<Array<Maybe<CaHolderManagerDto>>>;
  caHolderNFTBalanceInfo?: Maybe<CaHolderNftBalancePageResultDto>;
  caHolderNFTCollectionBalanceInfo?: Maybe<CaHolderNftCollectionBalancePageResultDto>;
  caHolderSearchTokenNFT?: Maybe<CaHolderSearchTokenNftPageResultDto>;
  caHolderTokenBalanceInfo?: Maybe<CaHolderTokenBalancePageResultDto>;
  caHolderTransaction?: Maybe<CaHolderTransactionPageResultDto>;
  caHolderTransactionAddressInfo?: Maybe<CaHolderTransactionAddressPageResultDto>;
  caHolderTransactionInfo?: Maybe<CaHolderTransactionPageResultDto>;
  loginGuardianChangeRecordInfo?: Maybe<Array<Maybe<LoginGuardianChangeRecordDto>>>;
  loginGuardianInfo?: Maybe<Array<Maybe<LoginGuardianDto>>>;
  syncState?: Maybe<SyncStateDto>;
  tokenInfo?: Maybe<Array<Maybe<TokenInfoDto>>>;
};

export type QueryCaHolderInfoArgs = {
  dto?: InputMaybe<GetCaHolderInfoDto>;
};

export type QueryCaHolderManagerChangeRecordInfoArgs = {
  dto?: InputMaybe<GetCaHolderManagerChangeRecordDto>;
};

export type QueryCaHolderManagerInfoArgs = {
  dto?: InputMaybe<GetCaHolderManagerInfoDto>;
};

export type QueryCaHolderNftBalanceInfoArgs = {
  dto?: InputMaybe<GetCaHolderNftInfoDto>;
};

export type QueryCaHolderNftCollectionBalanceInfoArgs = {
  dto?: InputMaybe<GetCaHolderNftCollectionInfoDto>;
};

export type QueryCaHolderSearchTokenNftArgs = {
  dto?: InputMaybe<GetCaHolderSearchTokenNftDto>;
};

export type QueryCaHolderTokenBalanceInfoArgs = {
  dto?: InputMaybe<GetCaHolderTokenBalanceDto>;
};

export type QueryCaHolderTransactionArgs = {
  dto?: InputMaybe<GetCaHolderTransactionDto>;
};

export type QueryCaHolderTransactionAddressInfoArgs = {
  dto?: InputMaybe<GetCaHolderTransactionAddressDto>;
};

export type QueryCaHolderTransactionInfoArgs = {
  dto?: InputMaybe<GetCaHolderTransactionDto>;
};

export type QueryLoginGuardianChangeRecordInfoArgs = {
  dto?: InputMaybe<GetLoginGuardianChangeRecordDto>;
};

export type QueryLoginGuardianInfoArgs = {
  dto?: InputMaybe<GetLoginGuardianInfoDto>;
};

export type QuerySyncStateArgs = {
  dto?: InputMaybe<GetSyncStateDto>;
};

export type QueryTokenInfoArgs = {
  dto?: InputMaybe<GetTokenInfoDto>;
};

export type SyncStateDto = {
  __typename?: 'SyncStateDto';
  confirmedBlockHeight: Scalars['Long'];
};

export type TokenInfoDto = {
  __typename?: 'TokenInfoDto';
  blockHash?: Maybe<Scalars['String']>;
  blockHeight: Scalars['Long'];
  chainId?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  id?: Maybe<Scalars['String']>;
  isBurnable: Scalars['Boolean'];
  issueChainId: Scalars['Int'];
  issuer?: Maybe<Scalars['String']>;
  previousBlockHash?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  tokenContractAddress?: Maybe<Scalars['String']>;
  tokenName?: Maybe<Scalars['String']>;
  totalSupply: Scalars['Long'];
  type: TokenType;
};

export enum TokenType {
  NftCollection = 'NFT_COLLECTION',
  NftItem = 'NFT_ITEM',
  Token = 'TOKEN',
}

export type TransactionFee = {
  __typename?: 'TransactionFee';
  amount: Scalars['Long'];
  symbol?: Maybe<Scalars['String']>;
};

export enum TransactionStatus {
  Conflict = 'CONFLICT',
  Failed = 'FAILED',
  Mined = 'MINED',
  NodeValidationFailed = 'NODE_VALIDATION_FAILED',
  NotExisted = 'NOT_EXISTED',
  Pending = 'PENDING',
  PendingValidation = 'PENDING_VALIDATION',
}

export type TransferInfo = {
  __typename?: 'TransferInfo';
  amount: Scalars['Long'];
  fromAddress?: Maybe<Scalars['String']>;
  fromCAAddress?: Maybe<Scalars['String']>;
  fromChainId?: Maybe<Scalars['String']>;
  toAddress?: Maybe<Scalars['String']>;
  toChainId?: Maybe<Scalars['String']>;
  transferTransactionId?: Maybe<Scalars['String']>;
};
