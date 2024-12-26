import * as Types from '../types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpgradePush_DeviceTypeQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.DeviceType_Filter>;
  sort?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  page?: Types.InputMaybe<Types.Scalars['Int']>;
  search?: Types.InputMaybe<Types.Scalars['String']>;
  filter1?: Types.InputMaybe<Types.UpgradeStyle_Filter>;
  sort1?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit1?: Types.InputMaybe<Types.Scalars['Int']>;
  offset1?: Types.InputMaybe<Types.Scalars['Int']>;
  page1?: Types.InputMaybe<Types.Scalars['Int']>;
  search1?: Types.InputMaybe<Types.Scalars['String']>;
  filter2?: Types.InputMaybe<Types.AppVersion_Filter>;
  sort2?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit2?: Types.InputMaybe<Types.Scalars['Int']>;
  offset2?: Types.InputMaybe<Types.Scalars['Int']>;
  page2?: Types.InputMaybe<Types.Scalars['Int']>;
  search2?: Types.InputMaybe<Types.Scalars['String']>;
  filter3?: Types.InputMaybe<Types.AppVersion_Filter>;
  sort3?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit3?: Types.InputMaybe<Types.Scalars['Int']>;
  offset3?: Types.InputMaybe<Types.Scalars['Int']>;
  page3?: Types.InputMaybe<Types.Scalars['Int']>;
  search3?: Types.InputMaybe<Types.Scalars['String']>;
  filter4?: Types.InputMaybe<Types.Country_Filter>;
  sort4?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit4?: Types.InputMaybe<Types.Scalars['Int']>;
  offset4?: Types.InputMaybe<Types.Scalars['Int']>;
  page4?: Types.InputMaybe<Types.Scalars['Int']>;
  search4?: Types.InputMaybe<Types.Scalars['String']>;
  filter5?: Types.InputMaybe<Types.DeviceBrand_Filter>;
  sort5?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit5?: Types.InputMaybe<Types.Scalars['Int']>;
  offset5?: Types.InputMaybe<Types.Scalars['Int']>;
  page5?: Types.InputMaybe<Types.Scalars['Int']>;
  search5?: Types.InputMaybe<Types.Scalars['String']>;
  filter6?: Types.InputMaybe<Types.DeviceType_Filter>;
  sort6?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit6?: Types.InputMaybe<Types.Scalars['Int']>;
  offset6?: Types.InputMaybe<Types.Scalars['Int']>;
  page6?: Types.InputMaybe<Types.Scalars['Int']>;
  search6?: Types.InputMaybe<Types.Scalars['String']>;
  filter7?: Types.InputMaybe<Types.UpgradePush_Filter>;
  sort7?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit7?: Types.InputMaybe<Types.Scalars['Int']>;
  offset7?: Types.InputMaybe<Types.Scalars['Int']>;
  page7?: Types.InputMaybe<Types.Scalars['Int']>;
  search7?: Types.InputMaybe<Types.Scalars['String']>;
  filter8?: Types.InputMaybe<Types.UpgradePush_DeviceType_Filter>;
  sort8?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit8?: Types.InputMaybe<Types.Scalars['Int']>;
  offset8?: Types.InputMaybe<Types.Scalars['Int']>;
  page8?: Types.InputMaybe<Types.Scalars['Int']>;
  search8?: Types.InputMaybe<Types.Scalars['String']>;
  filter9?: Types.InputMaybe<Types.UpgradePush_Filter>;
  sort9?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit9?: Types.InputMaybe<Types.Scalars['Int']>;
  offset9?: Types.InputMaybe<Types.Scalars['Int']>;
  page9?: Types.InputMaybe<Types.Scalars['Int']>;
  search9?: Types.InputMaybe<Types.Scalars['String']>;
  filter10?: Types.InputMaybe<Types.UpgradePush_DeviceBrand_Filter>;
  sort10?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit10?: Types.InputMaybe<Types.Scalars['Int']>;
  offset10?: Types.InputMaybe<Types.Scalars['Int']>;
  page10?: Types.InputMaybe<Types.Scalars['Int']>;
  search10?: Types.InputMaybe<Types.Scalars['String']>;
  filter11?: Types.InputMaybe<Types.UpgradePush_Filter>;
  sort11?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit11?: Types.InputMaybe<Types.Scalars['Int']>;
  offset11?: Types.InputMaybe<Types.Scalars['Int']>;
  page11?: Types.InputMaybe<Types.Scalars['Int']>;
  search11?: Types.InputMaybe<Types.Scalars['String']>;
  filter12?: Types.InputMaybe<Types.UpgradePush_Country_Filter>;
  sort12?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit12?: Types.InputMaybe<Types.Scalars['Int']>;
  offset12?: Types.InputMaybe<Types.Scalars['Int']>;
  page12?: Types.InputMaybe<Types.Scalars['Int']>;
  search12?: Types.InputMaybe<Types.Scalars['String']>;
  filter13?: Types.InputMaybe<Types.UpgradePush_Filter>;
  sort13?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit13?: Types.InputMaybe<Types.Scalars['Int']>;
  offset13?: Types.InputMaybe<Types.Scalars['Int']>;
  page13?: Types.InputMaybe<Types.Scalars['Int']>;
  search13?: Types.InputMaybe<Types.Scalars['String']>;
  filter14?: Types.InputMaybe<Types.UpgradePush_AppVersion_Filter>;
  sort14?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit14?: Types.InputMaybe<Types.Scalars['Int']>;
  offset14?: Types.InputMaybe<Types.Scalars['Int']>;
  page14?: Types.InputMaybe<Types.Scalars['Int']>;
  search14?: Types.InputMaybe<Types.Scalars['String']>;
  filter15?: Types.InputMaybe<Types.UpgradePush_Filter>;
  sort15?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit15?: Types.InputMaybe<Types.Scalars['Int']>;
  offset15?: Types.InputMaybe<Types.Scalars['Int']>;
  page15?: Types.InputMaybe<Types.Scalars['Int']>;
  search15?: Types.InputMaybe<Types.Scalars['String']>;
  filter16?: Types.InputMaybe<Types.UpgradePush_DeviceType_Filter>;
  sort16?: Types.InputMaybe<
    Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>
  >;
  limit16?: Types.InputMaybe<Types.Scalars['Int']>;
  offset16?: Types.InputMaybe<Types.Scalars['Int']>;
  page16?: Types.InputMaybe<Types.Scalars['Int']>;
  search16?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type UpgradePush_DeviceTypeQuery = {
  __typename?: 'Query';
  upgradePush_deviceType: Array<{
    __typename?: 'upgradePush_deviceType';
    id: string;
    deviceType_id?: {
      __typename?: 'deviceType';
      date_created?: any | null;
      date_updated?: any | null;
      id: string;
      label?: string | null;
      sort?: number | null;
      status?: string | null;
      user_created?: string | null;
      user_updated?: string | null;
      value?: number | null;
      date_created_func?: {
        __typename?: 'datetime_functions';
        year?: number | null;
        month?: number | null;
        week?: number | null;
        day?: number | null;
        weekday?: number | null;
        hour?: number | null;
        minute?: number | null;
        second?: number | null;
      } | null;
      date_updated_func?: {
        __typename?: 'datetime_functions';
        year?: number | null;
        month?: number | null;
        week?: number | null;
        day?: number | null;
        weekday?: number | null;
        hour?: number | null;
        minute?: number | null;
        second?: number | null;
      } | null;
    } | null;
    upgradePush_id?: {
      __typename?: 'upgradePush';
      appId?: string | null;
      content?: string | null;
      date_created?: any | null;
      date_updated?: any | null;
      downloadUrl?: string | null;
      id: string;
      isApproved?: boolean | null;
      isForceUpdate?: boolean | null;
      operatingSystemVersions?: any | null;
      sort?: number | null;
      status?: string | null;
      title?: string | null;
      user_created?: string | null;
      user_updated?: string | null;
      date_created_func?: {
        __typename?: 'datetime_functions';
        year?: number | null;
        month?: number | null;
        week?: number | null;
        day?: number | null;
        weekday?: number | null;
        hour?: number | null;
        minute?: number | null;
        second?: number | null;
      } | null;
      date_updated_func?: {
        __typename?: 'datetime_functions';
        year?: number | null;
        month?: number | null;
        week?: number | null;
        day?: number | null;
        weekday?: number | null;
        hour?: number | null;
        minute?: number | null;
        second?: number | null;
      } | null;
      operatingSystemVersions_func?: { __typename?: 'count_functions'; count?: number | null } | null;
      styleType?: {
        __typename?: 'upgradeStyle';
        attribute?: string | null;
        date_created?: any | null;
        date_updated?: any | null;
        id: string;
        sort?: number | null;
        status?: string | null;
        user_created?: string | null;
        user_updated?: string | null;
        value?: number | null;
        date_created_func?: {
          __typename?: 'datetime_functions';
          year?: number | null;
          month?: number | null;
          week?: number | null;
          day?: number | null;
          weekday?: number | null;
          hour?: number | null;
          minute?: number | null;
          second?: number | null;
        } | null;
        date_updated_func?: {
          __typename?: 'datetime_functions';
          year?: number | null;
          month?: number | null;
          week?: number | null;
          day?: number | null;
          weekday?: number | null;
          hour?: number | null;
          minute?: number | null;
          second?: number | null;
        } | null;
      } | null;
      targetVersion?: {
        __typename?: 'appVersion';
        date_created?: any | null;
        date_updated?: any | null;
        id: string;
        label?: string | null;
        sort?: number | null;
        status?: string | null;
        user_created?: string | null;
        user_updated?: string | null;
        value?: string | null;
        date_created_func?: {
          __typename?: 'datetime_functions';
          year?: number | null;
          month?: number | null;
          week?: number | null;
          day?: number | null;
          weekday?: number | null;
          hour?: number | null;
          minute?: number | null;
          second?: number | null;
        } | null;
        date_updated_func?: {
          __typename?: 'datetime_functions';
          year?: number | null;
          month?: number | null;
          week?: number | null;
          day?: number | null;
          weekday?: number | null;
          hour?: number | null;
          minute?: number | null;
          second?: number | null;
        } | null;
      } | null;
      appVersions?: Array<{
        __typename?: 'upgradePush_appVersion';
        id: string;
        appVersion_id?: {
          __typename?: 'appVersion';
          date_created?: any | null;
          date_updated?: any | null;
          id: string;
          label?: string | null;
          sort?: number | null;
          status?: string | null;
          user_created?: string | null;
          user_updated?: string | null;
          value?: string | null;
          date_created_func?: {
            __typename?: 'datetime_functions';
            year?: number | null;
            month?: number | null;
            week?: number | null;
            day?: number | null;
            weekday?: number | null;
            hour?: number | null;
            minute?: number | null;
            second?: number | null;
          } | null;
          date_updated_func?: {
            __typename?: 'datetime_functions';
            year?: number | null;
            month?: number | null;
            week?: number | null;
            day?: number | null;
            weekday?: number | null;
            hour?: number | null;
            minute?: number | null;
            second?: number | null;
          } | null;
        } | null;
        upgradePush_id?: {
          __typename?: 'upgradePush';
          appId?: string | null;
          content?: string | null;
          date_created?: any | null;
          date_updated?: any | null;
          downloadUrl?: string | null;
          id: string;
          isApproved?: boolean | null;
          isForceUpdate?: boolean | null;
          operatingSystemVersions?: any | null;
          sort?: number | null;
          status?: string | null;
          title?: string | null;
          user_created?: string | null;
          user_updated?: string | null;
          appVersions_func?: { __typename?: 'count_functions'; count?: number | null } | null;
          countries?: Array<{
            __typename?: 'upgradePush_country';
            id: string;
            country_id?: {
              __typename?: 'country';
              date_created?: any | null;
              date_updated?: any | null;
              id: string;
              label?: string | null;
              sort?: number | null;
              status?: string | null;
              user_created?: string | null;
              user_updated?: string | null;
              value?: string | null;
              date_created_func?: {
                __typename?: 'datetime_functions';
                year?: number | null;
                month?: number | null;
                week?: number | null;
                day?: number | null;
                weekday?: number | null;
                hour?: number | null;
                minute?: number | null;
                second?: number | null;
              } | null;
              date_updated_func?: {
                __typename?: 'datetime_functions';
                year?: number | null;
                month?: number | null;
                week?: number | null;
                day?: number | null;
                weekday?: number | null;
                hour?: number | null;
                minute?: number | null;
                second?: number | null;
              } | null;
            } | null;
            upgradePush_id?: {
              __typename?: 'upgradePush';
              appId?: string | null;
              content?: string | null;
              date_created?: any | null;
              date_updated?: any | null;
              downloadUrl?: string | null;
              id: string;
              isApproved?: boolean | null;
              isForceUpdate?: boolean | null;
              operatingSystemVersions?: any | null;
              sort?: number | null;
              status?: string | null;
              title?: string | null;
              user_created?: string | null;
              user_updated?: string | null;
              countries_func?: { __typename?: 'count_functions'; count?: number | null } | null;
              deviceBrands?: Array<{
                __typename?: 'upgradePush_deviceBrand';
                id: string;
                deviceBrand_id?: {
                  __typename?: 'deviceBrand';
                  date_created?: any | null;
                  date_updated?: any | null;
                  id: string;
                  label?: string | null;
                  sort?: number | null;
                  status?: string | null;
                  user_created?: string | null;
                  user_updated?: string | null;
                  value?: string | null;
                  date_created_func?: {
                    __typename?: 'datetime_functions';
                    year?: number | null;
                    month?: number | null;
                    week?: number | null;
                    day?: number | null;
                    weekday?: number | null;
                    hour?: number | null;
                    minute?: number | null;
                    second?: number | null;
                  } | null;
                  date_updated_func?: {
                    __typename?: 'datetime_functions';
                    year?: number | null;
                    month?: number | null;
                    week?: number | null;
                    day?: number | null;
                    weekday?: number | null;
                    hour?: number | null;
                    minute?: number | null;
                    second?: number | null;
                  } | null;
                } | null;
                upgradePush_id?: {
                  __typename?: 'upgradePush';
                  appId?: string | null;
                  content?: string | null;
                  date_created?: any | null;
                  date_updated?: any | null;
                  downloadUrl?: string | null;
                  id: string;
                  isApproved?: boolean | null;
                  isForceUpdate?: boolean | null;
                  operatingSystemVersions?: any | null;
                  sort?: number | null;
                  status?: string | null;
                  title?: string | null;
                  user_created?: string | null;
                  user_updated?: string | null;
                  deviceBrands_func?: { __typename?: 'count_functions'; count?: number | null } | null;
                  deviceTypes?: Array<{
                    __typename?: 'upgradePush_deviceType';
                    id: string;
                    deviceType_id?: {
                      __typename?: 'deviceType';
                      date_created?: any | null;
                      date_updated?: any | null;
                      id: string;
                      label?: string | null;
                      sort?: number | null;
                      status?: string | null;
                      user_created?: string | null;
                      user_updated?: string | null;
                      value?: number | null;
                    } | null;
                    upgradePush_id?: {
                      __typename?: 'upgradePush';
                      appId?: string | null;
                      content?: string | null;
                      date_created?: any | null;
                      date_updated?: any | null;
                      downloadUrl?: string | null;
                      id: string;
                      isApproved?: boolean | null;
                      isForceUpdate?: boolean | null;
                      operatingSystemVersions?: any | null;
                      sort?: number | null;
                      status?: string | null;
                      title?: string | null;
                      user_created?: string | null;
                      user_updated?: string | null;
                      deviceTypes_func?: { __typename?: 'count_functions'; count?: number | null } | null;
                    } | null;
                  } | null> | null;
                } | null;
              } | null> | null;
            } | null;
          } | null> | null;
        } | null;
      } | null> | null;
    } | null;
  }>;
};

export const UpgradePush_DeviceTypeDocument = gql`
  query upgradePush_deviceType(
    $filter: deviceType_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
    $filter1: upgradeStyle_filter
    $sort1: [String]
    $limit1: Int
    $offset1: Int
    $page1: Int
    $search1: String
    $filter2: appVersion_filter
    $sort2: [String]
    $limit2: Int
    $offset2: Int
    $page2: Int
    $search2: String
    $filter3: appVersion_filter
    $sort3: [String]
    $limit3: Int
    $offset3: Int
    $page3: Int
    $search3: String
    $filter4: country_filter
    $sort4: [String]
    $limit4: Int
    $offset4: Int
    $page4: Int
    $search4: String
    $filter5: deviceBrand_filter
    $sort5: [String]
    $limit5: Int
    $offset5: Int
    $page5: Int
    $search5: String
    $filter6: deviceType_filter
    $sort6: [String]
    $limit6: Int
    $offset6: Int
    $page6: Int
    $search6: String
    $filter7: upgradePush_filter
    $sort7: [String]
    $limit7: Int
    $offset7: Int
    $page7: Int
    $search7: String
    $filter8: upgradePush_deviceType_filter
    $sort8: [String]
    $limit8: Int
    $offset8: Int
    $page8: Int
    $search8: String
    $filter9: upgradePush_filter
    $sort9: [String]
    $limit9: Int
    $offset9: Int
    $page9: Int
    $search9: String
    $filter10: upgradePush_deviceBrand_filter
    $sort10: [String]
    $limit10: Int
    $offset10: Int
    $page10: Int
    $search10: String
    $filter11: upgradePush_filter
    $sort11: [String]
    $limit11: Int
    $offset11: Int
    $page11: Int
    $search11: String
    $filter12: upgradePush_country_filter
    $sort12: [String]
    $limit12: Int
    $offset12: Int
    $page12: Int
    $search12: String
    $filter13: upgradePush_filter
    $sort13: [String]
    $limit13: Int
    $offset13: Int
    $page13: Int
    $search13: String
    $filter14: upgradePush_appVersion_filter
    $sort14: [String]
    $limit14: Int
    $offset14: Int
    $page14: Int
    $search14: String
    $filter15: upgradePush_filter
    $sort15: [String]
    $limit15: Int
    $offset15: Int
    $page15: Int
    $search15: String
    $filter16: upgradePush_deviceType_filter
    $sort16: [String]
    $limit16: Int
    $offset16: Int
    $page16: Int
    $search16: String
  ) {
    upgradePush_deviceType(
      filter: $filter16
      sort: $sort16
      limit: $limit16
      offset: $offset16
      page: $page16
      search: $search16
    ) {
      deviceType_id(filter: $filter, sort: $sort, limit: $limit, offset: $offset, page: $page, search: $search) {
        date_created
        date_created_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        date_updated
        date_updated_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        id
        label
        sort
        status
        user_created
        user_updated
        value
      }
      id
      upgradePush_id(
        filter: $filter15
        sort: $sort15
        limit: $limit15
        offset: $offset15
        page: $page15
        search: $search15
      ) {
        appId
        content
        date_created
        date_created_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        date_updated
        date_updated_func {
          year
          month
          week
          day
          weekday
          hour
          minute
          second
        }
        downloadUrl
        id
        isApproved
        isForceUpdate
        operatingSystemVersions
        operatingSystemVersions_func {
          count
        }
        sort
        status
        styleType(filter: $filter1, sort: $sort1, limit: $limit1, offset: $offset1, page: $page1, search: $search1) {
          attribute
          date_created
          date_created_func {
            year
            month
            week
            day
            weekday
            hour
            minute
            second
          }
          date_updated
          date_updated_func {
            year
            month
            week
            day
            weekday
            hour
            minute
            second
          }
          id
          sort
          status
          user_created
          user_updated
          value
        }
        targetVersion(
          filter: $filter2
          sort: $sort2
          limit: $limit2
          offset: $offset2
          page: $page2
          search: $search2
        ) {
          date_created
          date_created_func {
            year
            month
            week
            day
            weekday
            hour
            minute
            second
          }
          date_updated
          date_updated_func {
            year
            month
            week
            day
            weekday
            hour
            minute
            second
          }
          id
          label
          sort
          status
          user_created
          user_updated
          value
        }
        title
        user_created
        user_updated
        appVersions(
          filter: $filter14
          sort: $sort14
          limit: $limit14
          offset: $offset14
          page: $page14
          search: $search14
        ) {
          appVersion_id(
            filter: $filter3
            sort: $sort3
            limit: $limit3
            offset: $offset3
            page: $page3
            search: $search3
          ) {
            date_created
            date_created_func {
              year
              month
              week
              day
              weekday
              hour
              minute
              second
            }
            date_updated
            date_updated_func {
              year
              month
              week
              day
              weekday
              hour
              minute
              second
            }
            id
            label
            sort
            status
            user_created
            user_updated
            value
          }
          id
          upgradePush_id(
            filter: $filter13
            sort: $sort13
            limit: $limit13
            offset: $offset13
            page: $page13
            search: $search13
          ) {
            appId
            content
            date_created
            date_updated
            downloadUrl
            id
            isApproved
            isForceUpdate
            operatingSystemVersions
            sort
            status
            title
            user_created
            user_updated
            appVersions_func {
              count
            }
            countries(
              filter: $filter12
              sort: $sort12
              limit: $limit12
              offset: $offset12
              page: $page12
              search: $search12
            ) {
              country_id(
                filter: $filter4
                sort: $sort4
                limit: $limit4
                offset: $offset4
                page: $page4
                search: $search4
              ) {
                date_created
                date_created_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                date_updated
                date_updated_func {
                  year
                  month
                  week
                  day
                  weekday
                  hour
                  minute
                  second
                }
                id
                label
                sort
                status
                user_created
                user_updated
                value
              }
              id
              upgradePush_id(
                filter: $filter11
                sort: $sort11
                limit: $limit11
                offset: $offset11
                page: $page11
                search: $search11
              ) {
                appId
                content
                date_created
                date_updated
                downloadUrl
                id
                isApproved
                isForceUpdate
                operatingSystemVersions
                sort
                status
                title
                user_created
                user_updated
                countries_func {
                  count
                }
                deviceBrands(
                  filter: $filter10
                  sort: $sort10
                  limit: $limit10
                  offset: $offset10
                  page: $page10
                  search: $search10
                ) {
                  deviceBrand_id(
                    filter: $filter5
                    sort: $sort5
                    limit: $limit5
                    offset: $offset5
                    page: $page5
                    search: $search5
                  ) {
                    date_created
                    date_created_func {
                      year
                      month
                      week
                      day
                      weekday
                      hour
                      minute
                      second
                    }
                    date_updated
                    date_updated_func {
                      year
                      month
                      week
                      day
                      weekday
                      hour
                      minute
                      second
                    }
                    id
                    label
                    sort
                    status
                    user_created
                    user_updated
                    value
                  }
                  id
                  upgradePush_id(
                    filter: $filter9
                    sort: $sort9
                    limit: $limit9
                    offset: $offset9
                    page: $page9
                    search: $search9
                  ) {
                    appId
                    content
                    date_created
                    date_updated
                    downloadUrl
                    id
                    isApproved
                    isForceUpdate
                    operatingSystemVersions
                    sort
                    status
                    title
                    user_created
                    user_updated
                    deviceBrands_func {
                      count
                    }
                    deviceTypes(
                      filter: $filter8
                      sort: $sort8
                      limit: $limit8
                      offset: $offset8
                      page: $page8
                      search: $search8
                    ) {
                      deviceType_id(
                        filter: $filter6
                        sort: $sort6
                        limit: $limit6
                        offset: $offset6
                        page: $page6
                        search: $search6
                      ) {
                        date_created
                        date_updated
                        id
                        label
                        sort
                        status
                        user_created
                        user_updated
                        value
                      }
                      id
                      upgradePush_id(
                        filter: $filter7
                        sort: $sort7
                        limit: $limit7
                        offset: $offset7
                        page: $page7
                        search: $search7
                      ) {
                        appId
                        content
                        date_created
                        date_updated
                        downloadUrl
                        id
                        isApproved
                        isForceUpdate
                        operatingSystemVersions
                        sort
                        status
                        title
                        user_created
                        user_updated
                        deviceTypes_func {
                          count
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * __useUpgradePush_DeviceTypeQuery__
 *
 * To run a query within a React component, call `useUpgradePush_DeviceTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePush_DeviceTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePush_DeviceTypeQuery({
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
 *      filter2: // value for 'filter2'
 *      sort2: // value for 'sort2'
 *      limit2: // value for 'limit2'
 *      offset2: // value for 'offset2'
 *      page2: // value for 'page2'
 *      search2: // value for 'search2'
 *      filter3: // value for 'filter3'
 *      sort3: // value for 'sort3'
 *      limit3: // value for 'limit3'
 *      offset3: // value for 'offset3'
 *      page3: // value for 'page3'
 *      search3: // value for 'search3'
 *      filter4: // value for 'filter4'
 *      sort4: // value for 'sort4'
 *      limit4: // value for 'limit4'
 *      offset4: // value for 'offset4'
 *      page4: // value for 'page4'
 *      search4: // value for 'search4'
 *      filter5: // value for 'filter5'
 *      sort5: // value for 'sort5'
 *      limit5: // value for 'limit5'
 *      offset5: // value for 'offset5'
 *      page5: // value for 'page5'
 *      search5: // value for 'search5'
 *      filter6: // value for 'filter6'
 *      sort6: // value for 'sort6'
 *      limit6: // value for 'limit6'
 *      offset6: // value for 'offset6'
 *      page6: // value for 'page6'
 *      search6: // value for 'search6'
 *      filter7: // value for 'filter7'
 *      sort7: // value for 'sort7'
 *      limit7: // value for 'limit7'
 *      offset7: // value for 'offset7'
 *      page7: // value for 'page7'
 *      search7: // value for 'search7'
 *      filter8: // value for 'filter8'
 *      sort8: // value for 'sort8'
 *      limit8: // value for 'limit8'
 *      offset8: // value for 'offset8'
 *      page8: // value for 'page8'
 *      search8: // value for 'search8'
 *      filter9: // value for 'filter9'
 *      sort9: // value for 'sort9'
 *      limit9: // value for 'limit9'
 *      offset9: // value for 'offset9'
 *      page9: // value for 'page9'
 *      search9: // value for 'search9'
 *      filter10: // value for 'filter10'
 *      sort10: // value for 'sort10'
 *      limit10: // value for 'limit10'
 *      offset10: // value for 'offset10'
 *      page10: // value for 'page10'
 *      search10: // value for 'search10'
 *      filter11: // value for 'filter11'
 *      sort11: // value for 'sort11'
 *      limit11: // value for 'limit11'
 *      offset11: // value for 'offset11'
 *      page11: // value for 'page11'
 *      search11: // value for 'search11'
 *      filter12: // value for 'filter12'
 *      sort12: // value for 'sort12'
 *      limit12: // value for 'limit12'
 *      offset12: // value for 'offset12'
 *      page12: // value for 'page12'
 *      search12: // value for 'search12'
 *      filter13: // value for 'filter13'
 *      sort13: // value for 'sort13'
 *      limit13: // value for 'limit13'
 *      offset13: // value for 'offset13'
 *      page13: // value for 'page13'
 *      search13: // value for 'search13'
 *      filter14: // value for 'filter14'
 *      sort14: // value for 'sort14'
 *      limit14: // value for 'limit14'
 *      offset14: // value for 'offset14'
 *      page14: // value for 'page14'
 *      search14: // value for 'search14'
 *      filter15: // value for 'filter15'
 *      sort15: // value for 'sort15'
 *      limit15: // value for 'limit15'
 *      offset15: // value for 'offset15'
 *      page15: // value for 'page15'
 *      search15: // value for 'search15'
 *      filter16: // value for 'filter16'
 *      sort16: // value for 'sort16'
 *      limit16: // value for 'limit16'
 *      offset16: // value for 'offset16'
 *      page16: // value for 'page16'
 *      search16: // value for 'search16'
 *   },
 * });
 */
export function useUpgradePush_DeviceTypeQuery(
  baseOptions?: Apollo.QueryHookOptions<UpgradePush_DeviceTypeQuery, UpgradePush_DeviceTypeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UpgradePush_DeviceTypeQuery, UpgradePush_DeviceTypeQueryVariables>(
    UpgradePush_DeviceTypeDocument,
    options,
  );
}
export function useUpgradePush_DeviceTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UpgradePush_DeviceTypeQuery, UpgradePush_DeviceTypeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UpgradePush_DeviceTypeQuery, UpgradePush_DeviceTypeQueryVariables>(
    UpgradePush_DeviceTypeDocument,
    options,
  );
}
export type UpgradePush_DeviceTypeQueryHookResult = ReturnType<typeof useUpgradePush_DeviceTypeQuery>;
export type UpgradePush_DeviceTypeLazyQueryHookResult = ReturnType<typeof useUpgradePush_DeviceTypeLazyQuery>;
export type UpgradePush_DeviceTypeQueryResult = Apollo.QueryResult<
  UpgradePush_DeviceTypeQuery,
  UpgradePush_DeviceTypeQueryVariables
>;
