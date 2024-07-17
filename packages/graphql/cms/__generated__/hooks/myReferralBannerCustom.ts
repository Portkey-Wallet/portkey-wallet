import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyReferralBannerCustomQueryVariables = Types.Exact<{ [key: string]: never }>;

export type MyReferralBannerCustomQuery = {
  __typename?: 'Query';
  myReferralBanner?: {
    __typename?: 'myReferralBanner';
    status?: string | null;
    items?: Array<{
      __typename?: 'myReferralBanner_portkeyCard';
      portkeyCard_id?: {
        __typename?: 'portkeyCard';
        status?: string | null;
        title?: string | null;
        url?: string | null;
        appLink?: string | null;
        extensionLink?: string | null;
        index?: any | null;
        value?: string | null;
        description?: string | null;
        buttonTitle?: string | null;
        imgUrl?: never | null;
      } | null;
    } | null> | null;
  } | null;
};

export const MyReferralBannerCustomDocument = gql`
  query myReferralBannerCustom {
    myReferralBanner {
      status
      items {
        portkeyCard_id {
          status
          title
          url
          appLink
          extensionLink
          index
          value
          description
          buttonTitle
          imgUrl {
            filename_disk
          }
        }
      }
    }
  }
`;

/**
 * __useMyReferralBannerCustomQuery__
 *
 * To run a query within a React component, call `useMyReferralBannerCustomQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyReferralBannerCustomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyReferralBannerCustomQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyReferralBannerCustomQuery(
  baseOptions?: Apollo.QueryHookOptions<MyReferralBannerCustomQuery, MyReferralBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyReferralBannerCustomQuery, MyReferralBannerCustomQueryVariables>(
    MyReferralBannerCustomDocument,
    options,
  );
}
export function useMyReferralBannerCustomLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyReferralBannerCustomQuery, MyReferralBannerCustomQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyReferralBannerCustomQuery, MyReferralBannerCustomQueryVariables>(
    MyReferralBannerCustomDocument,
    options,
  );
}
export type MyReferralBannerCustomQueryHookResult = ReturnType<typeof useMyReferralBannerCustomQuery>;
export type MyReferralBannerCustomLazyQueryHookResult = ReturnType<typeof useMyReferralBannerCustomLazyQuery>;
export type MyReferralBannerCustomQueryResult = Apollo.QueryResult<
  MyReferralBannerCustomQuery,
  MyReferralBannerCustomQueryVariables
>;
