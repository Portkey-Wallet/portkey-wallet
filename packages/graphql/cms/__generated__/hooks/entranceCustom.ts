import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntranceCustomQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.Entrance_EntranceMatch_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;

export type EntranceCustomQuery = {
  __typename?: 'Query';
  entrance: Array<{
    __typename?: 'entrance';
    defaultSwitch?: boolean | null;
    moduleName?: { __typename?: 'entranceModuleName'; value?: string | null } | null;
    matchList?: Array<{
      __typename?: 'entrance_entranceMatch';
      entranceMatch_id?: {
        __typename?: 'entranceMatch';
        matchRuleList?: any | null;
        matchSwitch?: boolean | null;
        weight?: number | null;
      } | null;
    } | null> | null;
  }>;
};

export const EntranceCustomDocument = gql`
  query entranceCustom($filter: entrance_entranceMatch_filter, $sort: [String]) {
    entrance(limit: -1) {
      defaultSwitch
      moduleName {
        value
      }
      matchList(filter: $filter, sort: $sort, limit: -1) {
        entranceMatch_id {
          matchRuleList
          matchSwitch
          weight
        }
      }
    }
  }
`;

/**
 * __useEntranceCustomQuery__
 *
 * To run a query within a React component, call `useEntranceCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntranceCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntranceCustomQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useEntranceCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<EntranceCustomQuery, EntranceCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EntranceCustomQuery, EntranceCustomQueryVariables>(EntranceCustomDocument, options);
}
export function useEntranceCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EntranceCustomQuery, EntranceCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EntranceCustomQuery, EntranceCustomQueryVariables>(EntranceCustomDocument, options);
}
export type EntranceCustomQueryHookResult = ReturnType<typeof useEntranceCustomQuery>;
export type EntranceCustomLazyQueryHookResult = ReturnType<typeof useEntranceCustomLazyQuery>;
export type EntranceCustomQueryResult = Apollo.QueryResult<EntranceCustomQuery, EntranceCustomQueryVariables>;
