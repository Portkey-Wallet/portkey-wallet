import { fetchAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { fetchAllTokenList } from '@portkey-wallet/store/store-ca/tokenManagement/api';
import { ChainId } from '@portkey-wallet/types';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

export const fetchAssetsListByFilter = async ({
  keyword,
  caAddressInfos,
}: {
  keyword: string;
  caAddressInfos: { chainId: ChainId; caAddress: string }[];
}) => {
  const response = await fetchAssetList({ caAddressInfos, keyword, skipCount: 0, maxResultCount: 50 });
  return response;
};

export const fetchTokenListByFilter = async ({
  keyword,
  chainIdArray,
}: {
  keyword: string;
  chainIdArray?: string[];
}) => {
  const response = await fetchAllTokenList({
    keyword,
    chainIdArray: chainIdArray || [],
    skipCount: 0,
    maxResultCount: 50,
  });
  return {
    data: formatTokenItem(response.items),
    totalRecordCount: response.totalCount,
  };
};

export const formatTokenItem = (list: any[]) => {
  const tmp: TokenItemShowType[] = list.map((item) => ({
    isAdded: item.isDisplay,
    isDefault: item.isDefault,
    userTokenId: item.id,
    chainId: item.token.chainId,
    decimals: item.token.decimals,
    address: item.token.address,
    symbol: item.token.symbol,
    tokenName: item.token.symbol,
    id: item.token.id,
    name: item.token.symbol,
    imageUrl: item.token.imageUrl,
  }));
  return tmp;
};
