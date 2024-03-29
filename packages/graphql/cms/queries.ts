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

export {
  getSocialMedia,
  getTabMenu,
  getDiscoverGroup,
  getRememberMeBlackListSites,
  getEntrance,
  getCodePushControl,
  getLoginMode,
};
