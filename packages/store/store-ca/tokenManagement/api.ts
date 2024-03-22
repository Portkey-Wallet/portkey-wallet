import { request } from '@portkey-wallet/api/api-did';

export function fetchAllTokenList({
  keyword,
  chainIdArray,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  keyword: string;
  chainIdArray: string[];
  skipCount?: number;
  maxResultCount?: number;
}): Promise<{ items: any[]; totalCount: number }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' OR ');

  const filterKeywords =
    keyword?.length < 10 ? `token.symbol: *${keyword.toUpperCase().trim()}*` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeywords} AND (${chainIdSearchLanguage})`,
      // filter: `${filterKeywords}`,

      sort: 'sortWeight desc,isDisplay  desc,token.symbol  acs,token.chainId acs',
      skipCount,
      maxResultCount,
    },
  });
}
