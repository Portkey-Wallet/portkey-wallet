import { request } from 'packages/api/api-did';

export function fetchAllTokenList({
  keyword,
  chainIdArray,
}: {
  keyword: string;
  chainIdArray: string[];
}): Promise<{ items: any[]; totalRecordCount: number }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' OR ');

  const filterKeywords =
    keyword?.length < 10 ? `token.symbol: *${keyword.toUpperCase().trim()}*` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeywords} AND (${chainIdSearchLanguage})`,
      // filter: `${filterKeywords}`,

      sort: 'sortWeight desc,isDisplay  desc,token.symbol  acs,token.chainId acs',
      skipCount: 0,
      maxResultCount: 1000,
    },
  });
}
