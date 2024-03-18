import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginModeMatch_By_IdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type LoginModeMatch_By_IdQuery = {
  __typename?: 'Query';
  loginModeMatch_by_id?: {
    __typename?: 'loginModeMatch';
    id: string;
    status?: string | null;
    weight: any;
    matchSwitch: boolean;
    matchRuleList: any;
    description: string;
    matchRuleList_func?: { __typename?: 'count_functions'; count?: number | null } | null;
  } | null;
};

export const LoginModeMatch_By_IdDocument = gql`
  query loginModeMatch_by_id($id: ID!) {
    loginModeMatch_by_id(id: $id) {
      id
      status
      weight
      matchSwitch
      matchRuleList
      matchRuleList_func {
        count
      }
      description
    }
  }
`;

/**
 * __useLoginModeMatch_By_IdQuery__
 *
 * To run a query within a React component, call `useLoginModeMatch_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginModeMatch_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginModeMatch_By_IdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLoginModeMatch_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<LoginModeMatch_By_IdQuery, LoginModeMatch_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LoginModeMatch_By_IdQuery, LoginModeMatch_By_IdQueryVariables>(
    LoginModeMatch_By_IdDocument,
    options,
  );
}
export function useLoginModeMatch_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginModeMatch_By_IdQuery, LoginModeMatch_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LoginModeMatch_By_IdQuery, LoginModeMatch_By_IdQueryVariables>(
    LoginModeMatch_By_IdDocument,
    options,
  );
}
export type LoginModeMatch_By_IdQueryHookResult = ReturnType<typeof useLoginModeMatch_By_IdQuery>;
export type LoginModeMatch_By_IdLazyQueryHookResult = ReturnType<typeof useLoginModeMatch_By_IdLazyQuery>;
export type LoginModeMatch_By_IdQueryResult = Apollo.QueryResult<
  LoginModeMatch_By_IdQuery,
  LoginModeMatch_By_IdQueryVariables
>;
