import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ActivityModalConfig_By_IdQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.ClientType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.TimingType_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  id: Types.Scalars['ID'];
}>;

export type ActivityModalConfig_By_IdQuery = {
  __typename?: 'Query';
  ActivityModalConfig_by_id?: {
    __typename?: 'ActivityModalConfig';
    id: string;
    show?: boolean | null;
    showClose?: boolean | null;
    headerImg?: string | null;
    title?: string | null;
    description?: string | null;
    negtiveTitle?: string | null;
    positiveTitle?: string | null;
    positiveAction?: string | null;
    timingOperation?: string | null;
    label?: string | null;
    negativeTitle?: string | null;
    clientType?: { __typename?: 'clientType'; id: string; name?: string | null } | null;
    timingType?: { __typename?: 'timingType'; id: string; name?: string | null } | null;
  } | null;
};

export const ActivityModalConfig_By_IdDocument = gql`
  query ActivityModalConfig_by_id(
    $filter: clientType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: timingType_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $id: ID!
  ) {
    ActivityModalConfig_by_id(id: $id) {
      id
      clientType(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
        id
        name
      }
      timingType(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
        id
        name
      }
      show
      showClose
      headerImg
      title
      description
      negtiveTitle
      positiveTitle
      positiveAction
      timingOperation
      label
      negativeTitle
    }
  }
`;

/**
 * __useActivityModalConfig_By_IdQuery__
 *
 * To run a query within a React component, call `useActivityModalConfig_By_IdQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityModalConfig_By_IdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityModalConfig_By_IdQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      page: // value for 'page'
 *      search: // value for 'search'
 *      filter1: // value for 'filter1'
 *      sort1: // value for 'sort1'
 *      limit1: // value for 'limit1'
 *      offset1: // value for 'offset1'
 *      page1: // value for 'page1'
 *      search1: // value for 'search1'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useActivityModalConfig_By_IdQuery(
  baseOptions: Apollo.QueryHookOptions<ActivityModalConfig_By_IdQuery, ActivityModalConfig_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ActivityModalConfig_By_IdQuery, ActivityModalConfig_By_IdQueryVariables>(
    ActivityModalConfig_By_IdDocument,
    options,
  );
}
export function useActivityModalConfig_By_IdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ActivityModalConfig_By_IdQuery, ActivityModalConfig_By_IdQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ActivityModalConfig_By_IdQuery, ActivityModalConfig_By_IdQueryVariables>(
    ActivityModalConfig_By_IdDocument,
    options,
  );
}
export type ActivityModalConfig_By_IdQueryHookResult = ReturnType<typeof useActivityModalConfig_By_IdQuery>;
export type ActivityModalConfig_By_IdLazyQueryHookResult = ReturnType<typeof useActivityModalConfig_By_IdLazyQuery>;
export type ActivityModalConfig_By_IdQueryResult = Apollo.QueryResult<
  ActivityModalConfig_By_IdQuery,
  ActivityModalConfig_By_IdQueryVariables
>;
