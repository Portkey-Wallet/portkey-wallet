import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TimingTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.TimingType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type TimingTypeQuery = {
  __typename?: 'Query';
  timingType: Array<{ __typename?: 'timingType'; id: string; name?: string | null }>;
};

export const TimingTypeDocument = gql`
  query timingType(
    $filter: timingType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    timingType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
      id
      name
    }
  }
`;

/**
 * __useTimingTypeQuery__
 *
 * To run a query within a React component, call `useTimingTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimingTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimingTypeQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useTimingTypeQuery(baseOptions?: Apollo.QueryHookOptions<TimingTypeQuery, TimingTypeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TimingTypeQuery, TimingTypeQueryVariables>(TimingTypeDocument, options);
}
export function useTimingTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TimingTypeQuery, TimingTypeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TimingTypeQuery, TimingTypeQueryVariables>(TimingTypeDocument, options);
}
export type TimingTypeQueryHookResult = ReturnType<typeof useTimingTypeQuery>;
export type TimingTypeLazyQueryHookResult = ReturnType<typeof useTimingTypeLazyQuery>;
export type TimingTypeQueryResult = Apollo.QueryResult<TimingTypeQuery, TimingTypeQueryVariables>;
