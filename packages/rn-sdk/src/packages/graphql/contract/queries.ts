import { NetworkType } from 'packages/types';
import { getApolloClient } from './apollo';
import { GetCAHolderByManagerParamsType, CaHolderWithGuardian } from './types';

import {
  CaHolderManagerInfoDocument,
  CaHolderManagerInfoQuery,
  CaHolderManagerInfoQueryVariables,
} from './__generated__/hooks/caHolderManagerInfo';

import {
  LoginGuardianInfoDocument,
  LoginGuardianInfoQuery,
  LoginGuardianInfoQueryVariables,
} from './__generated__/hooks/loginGuardianInfo';

import { TokenInfoDocument, TokenInfoQuery, TokenInfoQueryVariables } from './__generated__/hooks/tokenInfo';

// CAHolderManager
const getCAHolderManagerInfo = async (network: NetworkType, params: CaHolderManagerInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);
  const result = await apolloClient.query<CaHolderManagerInfoQuery>({
    query: CaHolderManagerInfoDocument,
    variables: params,
  });
  return result;
};

// LoginGuardianType
const getLoginGuardianAccount = async (network: NetworkType, params: LoginGuardianInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<LoginGuardianInfoQuery>({
    query: LoginGuardianInfoDocument,
    variables: params,
  });
  return result;
};

// TokenInfo
const getTokenInfo = async (network: NetworkType, params: TokenInfoQueryVariables) => {
  const apolloClient = getApolloClient(network);

  const result = await apolloClient.query<TokenInfoQuery>({
    query: TokenInfoDocument,
    variables: params,
  });
  return result;
};

// getCAHolderByManager
const getCAHolderByManager = async (network: NetworkType, params: GetCAHolderByManagerParamsType) => {
  const caResult = await getCAHolderManagerInfo(network, {
    dto: {
      ...params,
      skipCount: 0,
      maxResultCount: 1,
    },
  });
  if (caResult.error) throw caResult.error;
  const result: {
    caHolderManagerInfo: CaHolderWithGuardian[];
  } = {
    caHolderManagerInfo: caResult.data.caHolderManagerInfo
      ? caResult.data.caHolderManagerInfo.map(item => ({ ...item, loginGuardianInfo: [] }))
      : [],
  };

  if (result.caHolderManagerInfo.length > 0) {
    const caHash = result.caHolderManagerInfo[0].caHash;
    const guardianResult = await getLoginGuardianAccount(network, {
      dto: {
        caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    });

    if (guardianResult.error) throw guardianResult.error;

    if (guardianResult.data.loginGuardianInfo) {
      result.caHolderManagerInfo[0].loginGuardianInfo = guardianResult.data.loginGuardianInfo;
    } else {
      result.caHolderManagerInfo[0].loginGuardianInfo = [];
    }
  }

  return result;
};

export { getTokenInfo, getCAHolderManagerInfo, getLoginGuardianAccount, getCAHolderByManager };
