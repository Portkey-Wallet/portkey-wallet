import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CaHolderManagerChangeRecordInfoQueryVariables = Types.Exact<{
  dto?: Types.InputMaybe<Types.GetCaHolderManagerChangeRecordDto>;
}>;

export type CaHolderManagerChangeRecordInfoQuery = {
  __typename?: 'Query';
  caHolderManagerChangeRecordInfo?: Array<{
    __typename?: 'CAHolderManagerChangeRecordDto';
    caAddress?: string | null;
    caHash?: string | null;
    manager?: string | null;
    changeType?: string | null;
    blockHeight: number;
  } | null> | null;
};

export const CaHolderManagerChangeRecordInfoDocument = gql`
  query caHolderManagerChangeRecordInfo($dto: GetCAHolderManagerChangeRecordDto) {
    caHolderManagerChangeRecordInfo(dto: $dto) {
      caAddress
      caHash
      manager
      changeType
      blockHeight
    }
  }
`;

/**
 * __useCaHolderManagerChangeRecordInfoQuery__
 *
 * To run a query within a React component, call `useCaHolderManagerChangeRecordInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaHolderManagerChangeRecordInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaHolderManagerChangeRecordInfoQuery({
 *   variables: {
 *      dto: // value for 'dto'
 *   },
 * });
 */
export function useCaHolderManagerChangeRecordInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CaHolderManagerChangeRecordInfoQuery,
    CaHolderManagerChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CaHolderManagerChangeRecordInfoQuery, CaHolderManagerChangeRecordInfoQueryVariables>(
    CaHolderManagerChangeRecordInfoDocument,
    options,
  );
}
export function useCaHolderManagerChangeRecordInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CaHolderManagerChangeRecordInfoQuery,
    CaHolderManagerChangeRecordInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CaHolderManagerChangeRecordInfoQuery, CaHolderManagerChangeRecordInfoQueryVariables>(
    CaHolderManagerChangeRecordInfoDocument,
    options,
  );
}
export type CaHolderManagerChangeRecordInfoQueryHookResult = ReturnType<typeof useCaHolderManagerChangeRecordInfoQuery>;
export type CaHolderManagerChangeRecordInfoLazyQueryHookResult = ReturnType<
  typeof useCaHolderManagerChangeRecordInfoLazyQuery
>;
export type CaHolderManagerChangeRecordInfoQueryResult = Apollo.QueryResult<
  CaHolderManagerChangeRecordInfoQuery,
  CaHolderManagerChangeRecordInfoQueryVariables
>;
