import { PAGE_SIZE_DEFAULT } from '@portkey-wallet/constants/constants-ca/assets';
import { fetchAssetList } from '@portkey-wallet/store/store-ca/assets/api';
import { fetchAllTokenListLegacy } from '@portkey-wallet/store/store-ca/tokenManagement/api';
import { ChainId } from '@portkey-wallet/types';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

export const fetchAssetsListByFilter = async ({
  keyword,
  caAddressInfos,
}: {
  keyword: string;
  caAddressInfos: { chainId: ChainId; caAddress: string }[];
}) => {
  const response = await fetchAssetList({ caAddressInfos, keyword, skipCount: 0, maxResultCount: PAGE_SIZE_DEFAULT });
  return response;
};

export const fetchTokenListByFilter = async ({
  keyword,
  chainIdArray,
}: {
  keyword: string;
  chainIdArray?: string[];
}) => {
  const response = await fetchAllTokenListLegacy({
    keyword,
    chainIdArray: chainIdArray || [],
    skipCount: 0,
    maxResultCount: PAGE_SIZE_DEFAULT,
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
    chainId: item.chainId,
    decimals: item.decimals,
    address: item.address,
    symbol: item.symbol,
    tokenName: item.symbol,
    id: item.id,
    name: item.symbol,
    imageUrl: item.imageUrl,
  }));
  return tmp;
};
