import { NetworkType } from '@portkey-wallet/types';
import { getApolloClient } from './apollo';

import { SocialMediaDocument, SocialMediaQuery, SocialMediaQueryVariables } from './__generated__/hooks/socialMedia';

import { TabMenuDocument, TabMenuQuery, TabMenuQueryVariables } from './__generated__/hooks/tabMenu';

// SocialMedia
const getSocialMedia = async (network: NetworkType, params: SocialMediaQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<SocialMediaQuery>({
    query: SocialMediaDocument,
    variables: params,
  });
  return result;
};

// TabMenu
const getTabMenu = async (network: NetworkType, params: TabMenuQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<TabMenuQuery>({
    query: TabMenuDocument,
    variables: params,
  });
  return result;
};

export { getSocialMedia, getTabMenu };
