import { NetworkType } from '@portkey-wallet/types';
import { getApolloClient } from './apollo';

import {
  SocialMediaCustomDocument,
  SocialMediaCustomQuery,
  SocialMediaCustomQueryVariables,
} from './__generated__/hooks/socialMediaCustom';
import {
  TabMenuCustomDocument,
  TabMenuCustomQuery,
  TabMenuCustomQueryVariables,
} from './__generated__/hooks/tabMenuCustom';
import {
  DiscoverGroupCustomDocument,
  DiscoverGroupCustomQuery,
  DiscoverGroupCustomQueryVariables,
} from './__generated__/hooks/discoverGroupCustom';
import {
  EntranceCustomDocument,
  EntranceCustomQuery,
  EntranceCustomQueryVariables,
} from './__generated__/hooks/entranceCustom';

import {
  RememberMeBlackListSitesCustomDocument,
  RememberMeBlackListSitesCustomQuery,
  RememberMeBlackListSitesCustomQueryVariables,
} from './__generated__/hooks/rememberMeBlackListSitesCustom';

import {
  CodePushControlCustomDocument,
  CodePushControlCustomQuery,
  CodePushControlCustomQueryVariables,
} from './__generated__/hooks/codepushControlCustom';

import { LoginModeDocument, LoginModeQuery, LoginModeQueryVariables } from './__generated__/hooks/loginModeCustom';

import {
  HomeBannerCustomDocument,
  HomeBannerCustomQuery,
  HomeBannerCustomQueryVariables,
} from './__generated__/hooks/homeBannerCustom';
import {
  TokenDetailBannerCustomDocument,
  TokenDetailBannerCustomQuery,
  TokenDetailBannerCustomQueryVariables,
} from './__generated__/hooks/tokenDetailBannerCustom';

import {
  DiscoverDappBannerCustomDocument,
  DiscoverDappBannerCustomQuery,
  DiscoverDappBannerCustomQueryVariables,
} from './__generated__/hooks/discoverDappBannerCustom';

import {
  DiscoverLearnBannerCustomDocument,
  DiscoverLearnBannerCustomQuery,
  DiscoverLearnBannerCustomQueryVariables,
} from './__generated__/hooks/discoverLearnBannerCustom';

import {
  DiscoverTabDataCustomDocument,
  DiscoverTabDataCustomQuery,
  DiscoverTabDataCustomQueryVariables,
} from './__generated__/hooks/discoverTabDataCustom';

import {
  DiscoverEarnDataCustomDocument,
  DiscoverEarnDataCustomQuery,
  DiscoverEarnDataCustomQueryVariables,
} from './__generated__/hooks/discoverEarnDataCustom';

import {
  DiscoverLearnGroupCustomDocument,
  DiscoverLearnGroupCustomQuery,
  DiscoverLearnGroupCustomQueryVariables,
} from './__generated__/hooks/discoverLearnGroupCustom';
import { DappListDocument, DappListQuery, DappListQueryVariables } from './__generated__/hooks/dappWhiteListCustom';

// SocialMedia
const getSocialMedia = async (network: NetworkType, params: SocialMediaCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<SocialMediaCustomQuery>({
    query: SocialMediaCustomDocument,
    variables: params,
  });
  return result;
};

// TabMenu
const getTabMenu = async (network: NetworkType, params: TabMenuCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<TabMenuCustomQuery>({
    query: TabMenuCustomDocument,
    variables: params,
  });
  console.log('getTabMenu', result);

  return result;
};

// discover Group
const getDiscoverGroup = async (network: NetworkType, params: DiscoverGroupCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverGroupCustomQuery>({
    query: DiscoverGroupCustomDocument,
    variables: params,
  });
  return result;
};

// buy button show
const getRememberMeBlackListSites = async (
  network: NetworkType,
  params: RememberMeBlackListSitesCustomQueryVariables,
) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<RememberMeBlackListSitesCustomQuery>({
    query: RememberMeBlackListSitesCustomDocument,
    variables: params,
  });
  return result;
};

// entrance
const getEntrance = async (network: NetworkType, params: EntranceCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<EntranceCustomQuery>({
    query: EntranceCustomDocument,
    variables: params,
  });
  return result;
};

// code push control
const getCodePushControl = async (network: NetworkType, params: CodePushControlCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<CodePushControlCustomQuery>({
    query: CodePushControlCustomDocument,
    variables: params,
  });

  return result;
};

// loginMode control
const getLoginMode = async (network: NetworkType, params: LoginModeQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<LoginModeQuery>({
    query: LoginModeDocument,
    variables: params,
  });

  return result;
};

// homeBanner
const getHomeBanner = async (network: NetworkType, params: HomeBannerCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<HomeBannerCustomQuery>({
    query: HomeBannerCustomDocument,
    variables: params,
  });

  console.log('getcms HomeBanner', result);

  return result;
};
// token detailBanner
const getTokenDetailBanner = async (network: NetworkType, params: TokenDetailBannerCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<TokenDetailBannerCustomQuery>({
    query: TokenDetailBannerCustomDocument,
    variables: params,
  });
  return result;
};

// dapp banner
const getDiscoverDappBanner = async (network: NetworkType, params: DiscoverDappBannerCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverDappBannerCustomQuery>({
    query: DiscoverDappBannerCustomDocument,
    variables: params,
  });
  return result;
};

// learn banner
const getDiscoverLearnBanner = async (network: NetworkType, params: DiscoverLearnBannerCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverLearnBannerCustomQuery>({
    query: DiscoverLearnBannerCustomDocument,
    variables: params,
  });
  return result;
};
// get discover tab list
const getDiscoverTabList = async (network: NetworkType, params: DiscoverTabDataCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverTabDataCustomQuery>({
    query: DiscoverTabDataCustomDocument,
    variables: params,
  });
  return result;
};

// get earnList
const getDiscoverEarnList = async (network: NetworkType, params: DiscoverEarnDataCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverEarnDataCustomQuery>({
    query: DiscoverEarnDataCustomDocument,
    variables: params,
  });
  return result;
};

// get learnGroupList
const getDiscoverLearnGroupList = async (network: NetworkType, params: DiscoverLearnGroupCustomQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DiscoverLearnGroupCustomQuery>({
    query: DiscoverLearnGroupCustomDocument,
    variables: params,
  });
  return result;
};

// get learnGroupList
const getDappWhiteListCustom = async (network: NetworkType, params: DappListQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<DappListQuery>({
    query: DappListDocument,
    variables: params,
  });
  return result;
};

export {
  getSocialMedia,
  getTabMenu,
  getDiscoverGroup,
  getRememberMeBlackListSites,
  getEntrance,
  getCodePushControl,
  getLoginMode,
  getHomeBanner,
  getTokenDetailBanner,
  getDiscoverDappBanner,
  getDiscoverLearnBanner,
  getDiscoverTabList,
  getDiscoverEarnList,
  getDiscoverLearnGroupList,
  getDappWhiteListCustom,
};
