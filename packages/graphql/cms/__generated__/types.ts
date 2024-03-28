export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** ISO8601 Date values */
  Date: any;
  /** BigInt value */
  GraphQLBigInt: any;
  /** A Float or a String */
  GraphQLStringOrFloat: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Query = {
  __typename?: 'Query';
  bottomMenu: Array<BottomMenu>;
  bottomMenu_aggregated: Array<BottomMenu_Aggregated>;
  bottomMenu_by_id?: Maybe<BottomMenu>;
  bottomSecondMenu: Array<BottomSecondMenu>;
  bottomSecondMenu_aggregated: Array<BottomSecondMenu_Aggregated>;
  bottomSecondMenu_by_id?: Maybe<BottomSecondMenu>;
  buyButton?: Maybe<BuyButton>;
  codePushControl: Array<CodePushControl>;
  codePushControl_aggregated: Array<CodePushControl_Aggregated>;
  codePushControl_by_id?: Maybe<CodePushControl>;
  deviceBrand: Array<DeviceBrand>;
  deviceBrand_aggregated: Array<DeviceBrand_Aggregated>;
  deviceBrand_by_id?: Maybe<DeviceBrand>;
  deviceType: Array<DeviceType>;
  deviceType_aggregated: Array<DeviceType_Aggregated>;
  deviceType_by_id?: Maybe<DeviceType>;
  discoverGroup: Array<DiscoverGroup>;
  discoverGroup_aggregated: Array<DiscoverGroup_Aggregated>;
  discoverGroup_by_id?: Maybe<DiscoverGroup>;
  discoverItem: Array<DiscoverItem>;
  discoverItem_aggregated: Array<DiscoverItem_Aggregated>;
  discoverItem_by_id?: Maybe<DiscoverItem>;
  download?: Maybe<Download>;
  entrance: Array<Entrance>;
  entranceMatch: Array<EntranceMatch>;
  entranceMatch_aggregated: Array<EntranceMatch_Aggregated>;
  entranceMatch_by_id?: Maybe<EntranceMatch>;
  entranceModuleName: Array<EntranceModuleName>;
  entranceModuleName_aggregated: Array<EntranceModuleName_Aggregated>;
  entranceModuleName_by_id?: Maybe<EntranceModuleName>;
  entrance_aggregated: Array<Entrance_Aggregated>;
  entrance_by_id?: Maybe<Entrance>;
  entrance_entranceMatch: Array<Entrance_EntranceMatch>;
  entrance_entranceMatch_aggregated: Array<Entrance_EntranceMatch_Aggregated>;
  entrance_entranceMatch_by_id?: Maybe<Entrance_EntranceMatch>;
  home?: Maybe<Home>;
  loginMode: Array<LoginMode>;
  loginModeMatch: Array<LoginModeMatch>;
  loginModeMatch_aggregated: Array<LoginModeMatch_Aggregated>;
  loginModeMatch_by_id?: Maybe<LoginModeMatch>;
  loginMode_aggregated: Array<LoginMode_Aggregated>;
  loginMode_by_id?: Maybe<LoginMode>;
  loginMode_loginModeMatch: Array<LoginMode_LoginModeMatch>;
  loginMode_loginModeMatch_aggregated: Array<LoginMode_LoginModeMatch_Aggregated>;
  loginMode_loginModeMatch_by_id?: Maybe<LoginMode_LoginModeMatch>;
  loginType: Array<LoginType>;
  loginType_aggregated: Array<LoginType_Aggregated>;
  loginType_by_id?: Maybe<LoginType>;
  mediaKit: Array<MediaKit>;
  mediaKitPage?: Maybe<MediaKitPage>;
  mediaKitPage_mediaKit: Array<MediaKitPage_MediaKit>;
  mediaKitPage_mediaKit_aggregated: Array<MediaKitPage_MediaKit_Aggregated>;
  mediaKitPage_mediaKit_by_id?: Maybe<MediaKitPage_MediaKit>;
  mediaKit_aggregated: Array<MediaKit_Aggregated>;
  mediaKit_by_id?: Maybe<MediaKit>;
  navigationType: Array<NavigationType>;
  navigationType_aggregated: Array<NavigationType_Aggregated>;
  navigationType_by_id?: Maybe<NavigationType>;
  officialSocialMedia: Array<OfficialSocialMedia>;
  officialSocialMedia_aggregated: Array<OfficialSocialMedia_Aggregated>;
  officialSocialMedia_by_id?: Maybe<OfficialSocialMedia>;
  rememberMeBlackListSites: Array<RememberMeBlackListSites>;
  rememberMeBlackListSites_aggregated: Array<RememberMeBlackListSites_Aggregated>;
  rememberMeBlackListSites_by_id?: Maybe<RememberMeBlackListSites>;
  socialMedia: Array<SocialMedia>;
  socialMedia_aggregated: Array<SocialMedia_Aggregated>;
  socialMedia_by_id?: Maybe<SocialMedia>;
  tabMenu: Array<TabMenu>;
  tabMenu_aggregated: Array<TabMenu_Aggregated>;
  tabMenu_by_id?: Maybe<TabMenu>;
  tabType: Array<TabType>;
  tabType_aggregated: Array<TabType_Aggregated>;
  tabType_by_id?: Maybe<TabType>;
  topMenu: Array<TopMenu>;
  topMenu_aggregated: Array<TopMenu_Aggregated>;
  topMenu_by_id?: Maybe<TopMenu>;
  topSecondMenu: Array<TopSecondMenu>;
  topSecondMenu_aggregated: Array<TopSecondMenu_Aggregated>;
  topSecondMenu_by_id?: Maybe<TopSecondMenu>;
};

export type QueryBottomMenuArgs = {
  filter?: InputMaybe<BottomMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryBottomMenu_AggregatedArgs = {
  filter?: InputMaybe<BottomMenu_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryBottomMenu_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryBottomSecondMenuArgs = {
  filter?: InputMaybe<BottomSecondMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryBottomSecondMenu_AggregatedArgs = {
  filter?: InputMaybe<BottomSecondMenu_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryBottomSecondMenu_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryCodePushControlArgs = {
  filter?: InputMaybe<CodePushControl_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryCodePushControl_AggregatedArgs = {
  filter?: InputMaybe<CodePushControl_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryCodePushControl_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryDeviceBrandArgs = {
  filter?: InputMaybe<DeviceBrand_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDeviceBrand_AggregatedArgs = {
  filter?: InputMaybe<DeviceBrand_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDeviceBrand_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryDeviceTypeArgs = {
  filter?: InputMaybe<DeviceType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDeviceType_AggregatedArgs = {
  filter?: InputMaybe<DeviceType_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDeviceType_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryDiscoverGroupArgs = {
  filter?: InputMaybe<DiscoverGroup_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDiscoverGroup_AggregatedArgs = {
  filter?: InputMaybe<DiscoverGroup_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDiscoverGroup_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryDiscoverItemArgs = {
  filter?: InputMaybe<DiscoverItem_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDiscoverItem_AggregatedArgs = {
  filter?: InputMaybe<DiscoverItem_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryDiscoverItem_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryEntranceArgs = {
  filter?: InputMaybe<Entrance_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntranceMatchArgs = {
  filter?: InputMaybe<EntranceMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntranceMatch_AggregatedArgs = {
  filter?: InputMaybe<EntranceMatch_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntranceMatch_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryEntranceModuleNameArgs = {
  filter?: InputMaybe<EntranceModuleName_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntranceModuleName_AggregatedArgs = {
  filter?: InputMaybe<EntranceModuleName_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntranceModuleName_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryEntrance_AggregatedArgs = {
  filter?: InputMaybe<Entrance_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntrance_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryEntrance_EntranceMatchArgs = {
  filter?: InputMaybe<Entrance_EntranceMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntrance_EntranceMatch_AggregatedArgs = {
  filter?: InputMaybe<Entrance_EntranceMatch_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryEntrance_EntranceMatch_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryLoginModeArgs = {
  filter?: InputMaybe<LoginMode_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginModeMatchArgs = {
  filter?: InputMaybe<LoginModeMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginModeMatch_AggregatedArgs = {
  filter?: InputMaybe<LoginModeMatch_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginModeMatch_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryLoginMode_AggregatedArgs = {
  filter?: InputMaybe<LoginMode_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginMode_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryLoginMode_LoginModeMatchArgs = {
  filter?: InputMaybe<LoginMode_LoginModeMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginMode_LoginModeMatch_AggregatedArgs = {
  filter?: InputMaybe<LoginMode_LoginModeMatch_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginMode_LoginModeMatch_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryLoginTypeArgs = {
  filter?: InputMaybe<LoginType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginType_AggregatedArgs = {
  filter?: InputMaybe<LoginType_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryLoginType_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryMediaKitArgs = {
  filter?: InputMaybe<MediaKit_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryMediaKitPage_MediaKitArgs = {
  filter?: InputMaybe<MediaKitPage_MediaKit_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryMediaKitPage_MediaKit_AggregatedArgs = {
  filter?: InputMaybe<MediaKitPage_MediaKit_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryMediaKitPage_MediaKit_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryMediaKit_AggregatedArgs = {
  filter?: InputMaybe<MediaKit_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryMediaKit_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryNavigationTypeArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryNavigationType_AggregatedArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryNavigationType_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryOfficialSocialMediaArgs = {
  filter?: InputMaybe<OfficialSocialMedia_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryOfficialSocialMedia_AggregatedArgs = {
  filter?: InputMaybe<OfficialSocialMedia_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryOfficialSocialMedia_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryRememberMeBlackListSitesArgs = {
  filter?: InputMaybe<RememberMeBlackListSites_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryRememberMeBlackListSites_AggregatedArgs = {
  filter?: InputMaybe<RememberMeBlackListSites_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryRememberMeBlackListSites_By_IdArgs = {
  id: Scalars['ID'];
};

export type QuerySocialMediaArgs = {
  filter?: InputMaybe<SocialMedia_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QuerySocialMedia_AggregatedArgs = {
  filter?: InputMaybe<SocialMedia_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QuerySocialMedia_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryTabMenuArgs = {
  filter?: InputMaybe<TabMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTabMenu_AggregatedArgs = {
  filter?: InputMaybe<TabMenu_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTabMenu_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryTabTypeArgs = {
  filter?: InputMaybe<TabType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTabType_AggregatedArgs = {
  filter?: InputMaybe<TabType_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTabType_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryTopMenuArgs = {
  filter?: InputMaybe<TopMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTopMenu_AggregatedArgs = {
  filter?: InputMaybe<TopMenu_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTopMenu_By_IdArgs = {
  id: Scalars['ID'];
};

export type QueryTopSecondMenuArgs = {
  filter?: InputMaybe<TopSecondMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTopSecondMenu_AggregatedArgs = {
  filter?: InputMaybe<TopSecondMenu_Filter>;
  groupBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryTopSecondMenu_By_IdArgs = {
  id: Scalars['ID'];
};

export type Boolean_Filter_Operators = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nnull?: InputMaybe<Scalars['Boolean']>;
  _null?: InputMaybe<Scalars['Boolean']>;
};

export type BottomMenu = {
  __typename?: 'bottomMenu';
  children?: Maybe<Array<Maybe<BottomSecondMenu>>>;
  children_func?: Maybe<Count_Functions>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  path?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<NavigationType>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type BottomMenuChildrenArgs = {
  filter?: InputMaybe<BottomSecondMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BottomMenuTypeArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BottomMenu_Aggregated = {
  __typename?: 'bottomMenu_aggregated';
  avg?: Maybe<BottomMenu_Aggregated_Fields>;
  avgDistinct?: Maybe<BottomMenu_Aggregated_Fields>;
  count?: Maybe<BottomMenu_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<BottomMenu_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<BottomMenu_Aggregated_Fields>;
  min?: Maybe<BottomMenu_Aggregated_Fields>;
  sum?: Maybe<BottomMenu_Aggregated_Fields>;
  sumDistinct?: Maybe<BottomMenu_Aggregated_Fields>;
};

export type BottomMenu_Aggregated_Count = {
  __typename?: 'bottomMenu_aggregated_count';
  children?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type BottomMenu_Aggregated_Fields = {
  __typename?: 'bottomMenu_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type BottomMenu_Filter = {
  _and?: InputMaybe<Array<InputMaybe<BottomMenu_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<BottomMenu_Filter>>>;
  children?: InputMaybe<BottomSecondMenu_Filter>;
  children_func?: InputMaybe<Count_Function_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  path?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<NavigationType_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type BottomSecondMenu = {
  __typename?: 'bottomSecondMenu';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  parent?: Maybe<BottomMenu>;
  path?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<NavigationType>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type BottomSecondMenuParentArgs = {
  filter?: InputMaybe<BottomMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BottomSecondMenuTypeArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BottomSecondMenu_Aggregated = {
  __typename?: 'bottomSecondMenu_aggregated';
  avg?: Maybe<BottomSecondMenu_Aggregated_Fields>;
  avgDistinct?: Maybe<BottomSecondMenu_Aggregated_Fields>;
  count?: Maybe<BottomSecondMenu_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<BottomSecondMenu_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<BottomSecondMenu_Aggregated_Fields>;
  min?: Maybe<BottomSecondMenu_Aggregated_Fields>;
  sum?: Maybe<BottomSecondMenu_Aggregated_Fields>;
  sumDistinct?: Maybe<BottomSecondMenu_Aggregated_Fields>;
};

export type BottomSecondMenu_Aggregated_Count = {
  __typename?: 'bottomSecondMenu_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  parent?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type BottomSecondMenu_Aggregated_Fields = {
  __typename?: 'bottomSecondMenu_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  parent?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type BottomSecondMenu_Filter = {
  _and?: InputMaybe<Array<InputMaybe<BottomSecondMenu_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<BottomSecondMenu_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  parent?: InputMaybe<BottomMenu_Filter>;
  path?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<NavigationType_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type BuyButton = {
  __typename?: 'buyButton';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  isAndroidBuyShow?: Maybe<Scalars['Boolean']>;
  isAndroidSellShow?: Maybe<Scalars['Boolean']>;
  isBuySectionShow?: Maybe<Scalars['Boolean']>;
  isExtensionBuyShow?: Maybe<Scalars['Boolean']>;
  isExtensionSellShow?: Maybe<Scalars['Boolean']>;
  isIOSBuyShow?: Maybe<Scalars['Boolean']>;
  isIOSSellShow?: Maybe<Scalars['Boolean']>;
  isSellSectionShow?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type CodePushControl = {
  __typename?: 'codePushControl';
  content?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  isForceUpdate?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedContent?: Maybe<Scalars['String']>;
  updatedTitle?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type CodePushControl_Aggregated = {
  __typename?: 'codePushControl_aggregated';
  avg?: Maybe<CodePushControl_Aggregated_Fields>;
  avgDistinct?: Maybe<CodePushControl_Aggregated_Fields>;
  count?: Maybe<CodePushControl_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<CodePushControl_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<CodePushControl_Aggregated_Fields>;
  min?: Maybe<CodePushControl_Aggregated_Fields>;
  sum?: Maybe<CodePushControl_Aggregated_Fields>;
  sumDistinct?: Maybe<CodePushControl_Aggregated_Fields>;
};

export type CodePushControl_Aggregated_Count = {
  __typename?: 'codePushControl_aggregated_count';
  content?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  isForceUpdate?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  updatedContent?: Maybe<Scalars['Int']>;
  updatedTitle?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['Int']>;
};

export type CodePushControl_Aggregated_Fields = {
  __typename?: 'codePushControl_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type CodePushControl_Filter = {
  _and?: InputMaybe<Array<InputMaybe<CodePushControl_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<CodePushControl_Filter>>>;
  content?: InputMaybe<String_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  isForceUpdate?: InputMaybe<Boolean_Filter_Operators>;
  label?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  updatedContent?: InputMaybe<String_Filter_Operators>;
  updatedTitle?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  version?: InputMaybe<String_Filter_Operators>;
};

export type Count_Function_Filter_Operators = {
  count?: InputMaybe<Number_Filter_Operators>;
};

export type Count_Functions = {
  __typename?: 'count_functions';
  count?: Maybe<Scalars['Int']>;
};

export type Date_Filter_Operators = {
  _between?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _nbetween?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _neq?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _nnull?: InputMaybe<Scalars['Boolean']>;
  _null?: InputMaybe<Scalars['Boolean']>;
};

export type Datetime_Function_Filter_Operators = {
  day?: InputMaybe<Number_Filter_Operators>;
  hour?: InputMaybe<Number_Filter_Operators>;
  minute?: InputMaybe<Number_Filter_Operators>;
  month?: InputMaybe<Number_Filter_Operators>;
  second?: InputMaybe<Number_Filter_Operators>;
  week?: InputMaybe<Number_Filter_Operators>;
  weekday?: InputMaybe<Number_Filter_Operators>;
  year?: InputMaybe<Number_Filter_Operators>;
};

export type Datetime_Functions = {
  __typename?: 'datetime_functions';
  day?: Maybe<Scalars['Int']>;
  hour?: Maybe<Scalars['Int']>;
  minute?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  second?: Maybe<Scalars['Int']>;
  week?: Maybe<Scalars['Int']>;
  weekday?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type DeviceBrand = {
  __typename?: 'deviceBrand';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type DeviceBrand_Aggregated = {
  __typename?: 'deviceBrand_aggregated';
  avg?: Maybe<DeviceBrand_Aggregated_Fields>;
  avgDistinct?: Maybe<DeviceBrand_Aggregated_Fields>;
  count?: Maybe<DeviceBrand_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<DeviceBrand_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<DeviceBrand_Aggregated_Fields>;
  min?: Maybe<DeviceBrand_Aggregated_Fields>;
  sum?: Maybe<DeviceBrand_Aggregated_Fields>;
  sumDistinct?: Maybe<DeviceBrand_Aggregated_Fields>;
};

export type DeviceBrand_Aggregated_Count = {
  __typename?: 'deviceBrand_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type DeviceBrand_Aggregated_Fields = {
  __typename?: 'deviceBrand_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type DeviceBrand_Filter = {
  _and?: InputMaybe<Array<InputMaybe<DeviceBrand_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<DeviceBrand_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  label?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<String_Filter_Operators>;
};

export type DeviceType = {
  __typename?: 'deviceType';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type DeviceType_Aggregated = {
  __typename?: 'deviceType_aggregated';
  avg?: Maybe<DeviceType_Aggregated_Fields>;
  avgDistinct?: Maybe<DeviceType_Aggregated_Fields>;
  count?: Maybe<DeviceType_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<DeviceType_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<DeviceType_Aggregated_Fields>;
  min?: Maybe<DeviceType_Aggregated_Fields>;
  sum?: Maybe<DeviceType_Aggregated_Fields>;
  sumDistinct?: Maybe<DeviceType_Aggregated_Fields>;
};

export type DeviceType_Aggregated_Count = {
  __typename?: 'deviceType_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type DeviceType_Aggregated_Fields = {
  __typename?: 'deviceType_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

export type DeviceType_Filter = {
  _and?: InputMaybe<Array<InputMaybe<DeviceType_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<DeviceType_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  label?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<Number_Filter_Operators>;
};

export type Directus_Files = {
  __typename?: 'directus_files';
  charset?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  embed?: Maybe<Scalars['String']>;
  filename_disk?: Maybe<Scalars['String']>;
  filename_download: Scalars['String'];
  filesize?: Maybe<Scalars['GraphQLBigInt']>;
  folder?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['JSON']>;
  metadata_func?: Maybe<Count_Functions>;
  modified_by?: Maybe<Scalars['String']>;
  modified_on?: Maybe<Scalars['Date']>;
  modified_on_func?: Maybe<Datetime_Functions>;
  storage: Scalars['String'];
  tags?: Maybe<Scalars['JSON']>;
  tags_func?: Maybe<Count_Functions>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  uploaded_by?: Maybe<Scalars['String']>;
  uploaded_on?: Maybe<Scalars['Date']>;
  uploaded_on_func?: Maybe<Datetime_Functions>;
  width?: Maybe<Scalars['Int']>;
};

export type Directus_Files_Filter = {
  _and?: InputMaybe<Array<InputMaybe<Directus_Files_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<Directus_Files_Filter>>>;
  charset?: InputMaybe<String_Filter_Operators>;
  description?: InputMaybe<String_Filter_Operators>;
  duration?: InputMaybe<Number_Filter_Operators>;
  embed?: InputMaybe<String_Filter_Operators>;
  filename_disk?: InputMaybe<String_Filter_Operators>;
  filename_download?: InputMaybe<String_Filter_Operators>;
  filesize?: InputMaybe<Number_Filter_Operators>;
  folder?: InputMaybe<String_Filter_Operators>;
  height?: InputMaybe<Number_Filter_Operators>;
  id?: InputMaybe<String_Filter_Operators>;
  location?: InputMaybe<String_Filter_Operators>;
  metadata?: InputMaybe<String_Filter_Operators>;
  metadata_func?: InputMaybe<Count_Function_Filter_Operators>;
  modified_by?: InputMaybe<String_Filter_Operators>;
  modified_on?: InputMaybe<Date_Filter_Operators>;
  modified_on_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  storage?: InputMaybe<String_Filter_Operators>;
  tags?: InputMaybe<String_Filter_Operators>;
  tags_func?: InputMaybe<Count_Function_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<String_Filter_Operators>;
  uploaded_by?: InputMaybe<String_Filter_Operators>;
  uploaded_on?: InputMaybe<Date_Filter_Operators>;
  uploaded_on_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  width?: InputMaybe<Number_Filter_Operators>;
};

export type DiscoverGroup = {
  __typename?: 'discoverGroup';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<DiscoverItem>>>;
  items_func?: Maybe<Count_Functions>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type DiscoverGroupItemsArgs = {
  filter?: InputMaybe<DiscoverItem_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DiscoverGroup_Aggregated = {
  __typename?: 'discoverGroup_aggregated';
  avg?: Maybe<DiscoverGroup_Aggregated_Fields>;
  avgDistinct?: Maybe<DiscoverGroup_Aggregated_Fields>;
  count?: Maybe<DiscoverGroup_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<DiscoverGroup_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<DiscoverGroup_Aggregated_Fields>;
  min?: Maybe<DiscoverGroup_Aggregated_Fields>;
  sum?: Maybe<DiscoverGroup_Aggregated_Fields>;
  sumDistinct?: Maybe<DiscoverGroup_Aggregated_Fields>;
};

export type DiscoverGroup_Aggregated_Count = {
  __typename?: 'discoverGroup_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  items?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type DiscoverGroup_Aggregated_Fields = {
  __typename?: 'discoverGroup_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type DiscoverGroup_Filter = {
  _and?: InputMaybe<Array<InputMaybe<DiscoverGroup_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<DiscoverGroup_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  items?: InputMaybe<DiscoverItem_Filter>;
  items_func?: InputMaybe<Count_Function_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type DiscoverItem = {
  __typename?: 'discoverItem';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  description?: Maybe<Scalars['String']>;
  group?: Maybe<DiscoverGroup>;
  id: Scalars['ID'];
  imgUrl?: Maybe<Directus_Files>;
  index?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type DiscoverItemGroupArgs = {
  filter?: InputMaybe<DiscoverGroup_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DiscoverItemImgUrlArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DiscoverItem_Aggregated = {
  __typename?: 'discoverItem_aggregated';
  avg?: Maybe<DiscoverItem_Aggregated_Fields>;
  avgDistinct?: Maybe<DiscoverItem_Aggregated_Fields>;
  count?: Maybe<DiscoverItem_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<DiscoverItem_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<DiscoverItem_Aggregated_Fields>;
  min?: Maybe<DiscoverItem_Aggregated_Fields>;
  sum?: Maybe<DiscoverItem_Aggregated_Fields>;
  sumDistinct?: Maybe<DiscoverItem_Aggregated_Fields>;
};

export type DiscoverItem_Aggregated_Count = {
  __typename?: 'discoverItem_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['Int']>;
  group?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  /** Not support svg */
  imgUrl?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type DiscoverItem_Aggregated_Fields = {
  __typename?: 'discoverItem_aggregated_fields';
  group?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type DiscoverItem_Filter = {
  _and?: InputMaybe<Array<InputMaybe<DiscoverItem_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<DiscoverItem_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  description?: InputMaybe<String_Filter_Operators>;
  group?: InputMaybe<DiscoverGroup_Filter>;
  id?: InputMaybe<Number_Filter_Operators>;
  imgUrl?: InputMaybe<Directus_Files_Filter>;
  index?: InputMaybe<Number_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  url?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type Download = {
  __typename?: 'download';
  androidDownloadUrl?: Maybe<Scalars['String']>;
  androidProductImage?: Maybe<Directus_Files>;
  androidQRCode?: Maybe<Directus_Files>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  extensionDownloadUrl?: Maybe<Scalars['String']>;
  extensionProductImage?: Maybe<Directus_Files>;
  id: Scalars['ID'];
  iosDownloadUrl?: Maybe<Scalars['String']>;
  iosProductImage?: Maybe<Directus_Files>;
  iosQRCode?: Maybe<Directus_Files>;
  user_updated?: Maybe<Scalars['String']>;
};

export type DownloadAndroidProductImageArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DownloadAndroidQrCodeArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DownloadExtensionProductImageArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DownloadIosProductImageArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DownloadIosQrCodeArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Entrance = {
  __typename?: 'entrance';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  defaultSwitch?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  matchList?: Maybe<Array<Maybe<Entrance_EntranceMatch>>>;
  matchList_func?: Maybe<Count_Functions>;
  moduleName?: Maybe<EntranceModuleName>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type EntranceMatchListArgs = {
  filter?: InputMaybe<Entrance_EntranceMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type EntranceModuleNameArgs = {
  filter?: InputMaybe<EntranceModuleName_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type EntranceMatch = {
  __typename?: 'entranceMatch';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  matchRuleList?: Maybe<Scalars['JSON']>;
  matchRuleList_func?: Maybe<Count_Functions>;
  matchSwitch?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Int']>;
};

export type EntranceMatch_Aggregated = {
  __typename?: 'entranceMatch_aggregated';
  avg?: Maybe<EntranceMatch_Aggregated_Fields>;
  avgDistinct?: Maybe<EntranceMatch_Aggregated_Fields>;
  count?: Maybe<EntranceMatch_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<EntranceMatch_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<EntranceMatch_Aggregated_Fields>;
  min?: Maybe<EntranceMatch_Aggregated_Fields>;
  sum?: Maybe<EntranceMatch_Aggregated_Fields>;
  sumDistinct?: Maybe<EntranceMatch_Aggregated_Fields>;
};

export type EntranceMatch_Aggregated_Count = {
  __typename?: 'entranceMatch_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  matchRuleList?: Maybe<Scalars['Int']>;
  matchSwitch?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type EntranceMatch_Aggregated_Fields = {
  __typename?: 'entranceMatch_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
};

export type EntranceMatch_Filter = {
  _and?: InputMaybe<Array<InputMaybe<EntranceMatch_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<EntranceMatch_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  description?: InputMaybe<String_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  matchRuleList?: InputMaybe<String_Filter_Operators>;
  matchRuleList_func?: InputMaybe<Count_Function_Filter_Operators>;
  matchSwitch?: InputMaybe<Boolean_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  weight?: InputMaybe<Number_Filter_Operators>;
};

export type EntranceModuleName = {
  __typename?: 'entranceModuleName';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type EntranceModuleName_Aggregated = {
  __typename?: 'entranceModuleName_aggregated';
  avg?: Maybe<EntranceModuleName_Aggregated_Fields>;
  avgDistinct?: Maybe<EntranceModuleName_Aggregated_Fields>;
  count?: Maybe<EntranceModuleName_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<EntranceModuleName_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<EntranceModuleName_Aggregated_Fields>;
  min?: Maybe<EntranceModuleName_Aggregated_Fields>;
  sum?: Maybe<EntranceModuleName_Aggregated_Fields>;
  sumDistinct?: Maybe<EntranceModuleName_Aggregated_Fields>;
};

export type EntranceModuleName_Aggregated_Count = {
  __typename?: 'entranceModuleName_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type EntranceModuleName_Aggregated_Fields = {
  __typename?: 'entranceModuleName_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
};

export type EntranceModuleName_Filter = {
  _and?: InputMaybe<Array<InputMaybe<EntranceModuleName_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<EntranceModuleName_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  description?: InputMaybe<String_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<String_Filter_Operators>;
};

export type Entrance_Aggregated = {
  __typename?: 'entrance_aggregated';
  avg?: Maybe<Entrance_Aggregated_Fields>;
  avgDistinct?: Maybe<Entrance_Aggregated_Fields>;
  count?: Maybe<Entrance_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<Entrance_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<Entrance_Aggregated_Fields>;
  min?: Maybe<Entrance_Aggregated_Fields>;
  sum?: Maybe<Entrance_Aggregated_Fields>;
  sumDistinct?: Maybe<Entrance_Aggregated_Fields>;
};

export type Entrance_Aggregated_Count = {
  __typename?: 'entrance_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  defaultSwitch?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  matchList?: Maybe<Scalars['Int']>;
  moduleName?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type Entrance_Aggregated_Fields = {
  __typename?: 'entrance_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  moduleName?: Maybe<Scalars['Float']>;
};

export type Entrance_EntranceMatch = {
  __typename?: 'entrance_entranceMatch';
  entranceMatch_id?: Maybe<EntranceMatch>;
  entrance_id?: Maybe<Entrance>;
  id: Scalars['ID'];
};

export type Entrance_EntranceMatchEntranceMatch_IdArgs = {
  filter?: InputMaybe<EntranceMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Entrance_EntranceMatchEntrance_IdArgs = {
  filter?: InputMaybe<Entrance_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Entrance_EntranceMatch_Aggregated = {
  __typename?: 'entrance_entranceMatch_aggregated';
  avg?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
  avgDistinct?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
  count?: Maybe<Entrance_EntranceMatch_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<Entrance_EntranceMatch_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
  min?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
  sum?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
  sumDistinct?: Maybe<Entrance_EntranceMatch_Aggregated_Fields>;
};

export type Entrance_EntranceMatch_Aggregated_Count = {
  __typename?: 'entrance_entranceMatch_aggregated_count';
  entranceMatch_id?: Maybe<Scalars['Int']>;
  entrance_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

export type Entrance_EntranceMatch_Aggregated_Fields = {
  __typename?: 'entrance_entranceMatch_aggregated_fields';
  entranceMatch_id?: Maybe<Scalars['Float']>;
  entrance_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

export type Entrance_EntranceMatch_Filter = {
  _and?: InputMaybe<Array<InputMaybe<Entrance_EntranceMatch_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<Entrance_EntranceMatch_Filter>>>;
  entranceMatch_id?: InputMaybe<EntranceMatch_Filter>;
  entrance_id?: InputMaybe<Entrance_Filter>;
  id?: InputMaybe<Number_Filter_Operators>;
};

export type Entrance_Filter = {
  _and?: InputMaybe<Array<InputMaybe<Entrance_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<Entrance_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  defaultSwitch?: InputMaybe<Boolean_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  matchList?: InputMaybe<Entrance_EntranceMatch_Filter>;
  matchList_func?: InputMaybe<Count_Function_Filter_Operators>;
  moduleName?: InputMaybe<EntranceModuleName_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type Home = {
  __typename?: 'home';
  dAppSectionTitle?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  focusImage?: Maybe<Directus_Files>;
  id: Scalars['ID'];
  user_updated?: Maybe<Scalars['String']>;
  videoContent?: Maybe<Scalars['String']>;
  videoTitle?: Maybe<Scalars['String']>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type HomeFocusImageArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LoginMode = {
  __typename?: 'loginMode';
  androidIndex: Scalars['GraphQLBigInt'];
  androidRecommend: Scalars['Boolean'];
  defaultSwitch: Scalars['Boolean'];
  extensionIndex: Scalars['GraphQLBigInt'];
  extensionRecommend: Scalars['Boolean'];
  iOSIndex: Scalars['GraphQLBigInt'];
  iOSRecommend: Scalars['Boolean'];
  id: Scalars['ID'];
  matchList?: Maybe<Array<Maybe<LoginMode_LoginModeMatch>>>;
  matchList_func?: Maybe<Count_Functions>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<LoginType>;
};

export type LoginModeMatchListArgs = {
  filter?: InputMaybe<LoginMode_LoginModeMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LoginModeTypeArgs = {
  filter?: InputMaybe<LoginType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LoginModeMatch = {
  __typename?: 'loginModeMatch';
  description: Scalars['String'];
  id: Scalars['ID'];
  matchRuleList: Scalars['JSON'];
  matchRuleList_func?: Maybe<Count_Functions>;
  matchSwitch: Scalars['Boolean'];
  status?: Maybe<Scalars['String']>;
  weight: Scalars['GraphQLBigInt'];
};

export type LoginModeMatch_Aggregated = {
  __typename?: 'loginModeMatch_aggregated';
  avg?: Maybe<LoginModeMatch_Aggregated_Fields>;
  avgDistinct?: Maybe<LoginModeMatch_Aggregated_Fields>;
  count?: Maybe<LoginModeMatch_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<LoginModeMatch_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<LoginModeMatch_Aggregated_Fields>;
  min?: Maybe<LoginModeMatch_Aggregated_Fields>;
  sum?: Maybe<LoginModeMatch_Aggregated_Fields>;
  sumDistinct?: Maybe<LoginModeMatch_Aggregated_Fields>;
};

export type LoginModeMatch_Aggregated_Count = {
  __typename?: 'loginModeMatch_aggregated_count';
  description?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  matchRuleList?: Maybe<Scalars['Int']>;
  matchSwitch?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type LoginModeMatch_Aggregated_Fields = {
  __typename?: 'loginModeMatch_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
};

export type LoginModeMatch_Filter = {
  _and?: InputMaybe<Array<InputMaybe<LoginModeMatch_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<LoginModeMatch_Filter>>>;
  description?: InputMaybe<String_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  matchRuleList?: InputMaybe<String_Filter_Operators>;
  matchRuleList_func?: InputMaybe<Count_Function_Filter_Operators>;
  matchSwitch?: InputMaybe<Boolean_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  weight?: InputMaybe<Number_Filter_Operators>;
};

export type LoginMode_Aggregated = {
  __typename?: 'loginMode_aggregated';
  avg?: Maybe<LoginMode_Aggregated_Fields>;
  avgDistinct?: Maybe<LoginMode_Aggregated_Fields>;
  count?: Maybe<LoginMode_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<LoginMode_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<LoginMode_Aggregated_Fields>;
  min?: Maybe<LoginMode_Aggregated_Fields>;
  sum?: Maybe<LoginMode_Aggregated_Fields>;
  sumDistinct?: Maybe<LoginMode_Aggregated_Fields>;
};

export type LoginMode_Aggregated_Count = {
  __typename?: 'loginMode_aggregated_count';
  androidIndex?: Maybe<Scalars['Int']>;
  androidRecommend?: Maybe<Scalars['Int']>;
  defaultSwitch?: Maybe<Scalars['Int']>;
  extensionIndex?: Maybe<Scalars['Int']>;
  extensionRecommend?: Maybe<Scalars['Int']>;
  iOSIndex?: Maybe<Scalars['Int']>;
  iOSRecommend?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  matchList?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
};

export type LoginMode_Aggregated_Fields = {
  __typename?: 'loginMode_aggregated_fields';
  androidIndex?: Maybe<Scalars['Float']>;
  extensionIndex?: Maybe<Scalars['Float']>;
  iOSIndex?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type LoginMode_Filter = {
  _and?: InputMaybe<Array<InputMaybe<LoginMode_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<LoginMode_Filter>>>;
  androidIndex?: InputMaybe<Number_Filter_Operators>;
  androidRecommend?: InputMaybe<Boolean_Filter_Operators>;
  defaultSwitch?: InputMaybe<Boolean_Filter_Operators>;
  extensionIndex?: InputMaybe<Number_Filter_Operators>;
  extensionRecommend?: InputMaybe<Boolean_Filter_Operators>;
  iOSIndex?: InputMaybe<Number_Filter_Operators>;
  iOSRecommend?: InputMaybe<Boolean_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  matchList?: InputMaybe<LoginMode_LoginModeMatch_Filter>;
  matchList_func?: InputMaybe<Count_Function_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<LoginType_Filter>;
};

export type LoginMode_LoginModeMatch = {
  __typename?: 'loginMode_loginModeMatch';
  id: Scalars['ID'];
  loginModeMatch_id?: Maybe<LoginModeMatch>;
  loginMode_id?: Maybe<LoginMode>;
};

export type LoginMode_LoginModeMatchLoginModeMatch_IdArgs = {
  filter?: InputMaybe<LoginModeMatch_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LoginMode_LoginModeMatchLoginMode_IdArgs = {
  filter?: InputMaybe<LoginMode_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type LoginMode_LoginModeMatch_Aggregated = {
  __typename?: 'loginMode_loginModeMatch_aggregated';
  avg?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
  avgDistinct?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
  count?: Maybe<LoginMode_LoginModeMatch_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<LoginMode_LoginModeMatch_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
  min?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
  sum?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
  sumDistinct?: Maybe<LoginMode_LoginModeMatch_Aggregated_Fields>;
};

export type LoginMode_LoginModeMatch_Aggregated_Count = {
  __typename?: 'loginMode_loginModeMatch_aggregated_count';
  id?: Maybe<Scalars['Int']>;
  loginModeMatch_id?: Maybe<Scalars['Int']>;
  loginMode_id?: Maybe<Scalars['Int']>;
};

export type LoginMode_LoginModeMatch_Aggregated_Fields = {
  __typename?: 'loginMode_loginModeMatch_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  loginModeMatch_id?: Maybe<Scalars['Float']>;
  loginMode_id?: Maybe<Scalars['Float']>;
};

export type LoginMode_LoginModeMatch_Filter = {
  _and?: InputMaybe<Array<InputMaybe<LoginMode_LoginModeMatch_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<LoginMode_LoginModeMatch_Filter>>>;
  id?: InputMaybe<Number_Filter_Operators>;
  loginModeMatch_id?: InputMaybe<LoginModeMatch_Filter>;
  loginMode_id?: InputMaybe<LoginMode_Filter>;
};

export type LoginType = {
  __typename?: 'loginType';
  id: Scalars['ID'];
  label: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type LoginType_Aggregated = {
  __typename?: 'loginType_aggregated';
  avg?: Maybe<LoginType_Aggregated_Fields>;
  avgDistinct?: Maybe<LoginType_Aggregated_Fields>;
  count?: Maybe<LoginType_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<LoginType_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<LoginType_Aggregated_Fields>;
  min?: Maybe<LoginType_Aggregated_Fields>;
  sum?: Maybe<LoginType_Aggregated_Fields>;
  sumDistinct?: Maybe<LoginType_Aggregated_Fields>;
};

export type LoginType_Aggregated_Count = {
  __typename?: 'loginType_aggregated_count';
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type LoginType_Aggregated_Fields = {
  __typename?: 'loginType_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
};

export type LoginType_Filter = {
  _and?: InputMaybe<Array<InputMaybe<LoginType_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<LoginType_Filter>>>;
  id?: InputMaybe<Number_Filter_Operators>;
  label?: InputMaybe<String_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<String_Filter_Operators>;
};

export type MediaKit = {
  __typename?: 'mediaKit';
  backgroundColor?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  png?: Maybe<Directus_Files>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  svg?: Maybe<Directus_Files>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type MediaKitPngArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitSvgArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitPage = {
  __typename?: 'mediaKitPage';
  allMediaKitZip?: Maybe<Directus_Files>;
  boilerplateContent?: Maybe<Scalars['String']>;
  boilerplateTitle?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  mediaKitDescription?: Maybe<Scalars['String']>;
  mediaKitList?: Maybe<Array<Maybe<MediaKitPage_MediaKit>>>;
  mediaKitList_func?: Maybe<Count_Functions>;
  status?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type MediaKitPageAllMediaKitZipArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitPageMediaKitListArgs = {
  filter?: InputMaybe<MediaKitPage_MediaKit_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitPage_Filter = {
  _and?: InputMaybe<Array<InputMaybe<MediaKitPage_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<MediaKitPage_Filter>>>;
  allMediaKitZip?: InputMaybe<Directus_Files_Filter>;
  boilerplateContent?: InputMaybe<String_Filter_Operators>;
  boilerplateTitle?: InputMaybe<String_Filter_Operators>;
  content?: InputMaybe<String_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  mediaKitDescription?: InputMaybe<String_Filter_Operators>;
  mediaKitList?: InputMaybe<MediaKitPage_MediaKit_Filter>;
  mediaKitList_func?: InputMaybe<Count_Function_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type MediaKitPage_MediaKit = {
  __typename?: 'mediaKitPage_mediaKit';
  id: Scalars['ID'];
  mediaKitPage_id?: Maybe<MediaKitPage>;
  mediaKit_id?: Maybe<MediaKit>;
};

export type MediaKitPage_MediaKitMediaKitPage_IdArgs = {
  filter?: InputMaybe<MediaKitPage_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitPage_MediaKitMediaKit_IdArgs = {
  filter?: InputMaybe<MediaKit_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MediaKitPage_MediaKit_Aggregated = {
  __typename?: 'mediaKitPage_mediaKit_aggregated';
  avg?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
  avgDistinct?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
  count?: Maybe<MediaKitPage_MediaKit_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<MediaKitPage_MediaKit_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
  min?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
  sum?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
  sumDistinct?: Maybe<MediaKitPage_MediaKit_Aggregated_Fields>;
};

export type MediaKitPage_MediaKit_Aggregated_Count = {
  __typename?: 'mediaKitPage_mediaKit_aggregated_count';
  id?: Maybe<Scalars['Int']>;
  mediaKitPage_id?: Maybe<Scalars['Int']>;
  mediaKit_id?: Maybe<Scalars['Int']>;
};

export type MediaKitPage_MediaKit_Aggregated_Fields = {
  __typename?: 'mediaKitPage_mediaKit_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  mediaKitPage_id?: Maybe<Scalars['Float']>;
  mediaKit_id?: Maybe<Scalars['Float']>;
};

export type MediaKitPage_MediaKit_Filter = {
  _and?: InputMaybe<Array<InputMaybe<MediaKitPage_MediaKit_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<MediaKitPage_MediaKit_Filter>>>;
  id?: InputMaybe<Number_Filter_Operators>;
  mediaKitPage_id?: InputMaybe<MediaKitPage_Filter>;
  mediaKit_id?: InputMaybe<MediaKit_Filter>;
};

export type MediaKit_Aggregated = {
  __typename?: 'mediaKit_aggregated';
  avg?: Maybe<MediaKit_Aggregated_Fields>;
  avgDistinct?: Maybe<MediaKit_Aggregated_Fields>;
  count?: Maybe<MediaKit_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<MediaKit_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<MediaKit_Aggregated_Fields>;
  min?: Maybe<MediaKit_Aggregated_Fields>;
  sum?: Maybe<MediaKit_Aggregated_Fields>;
  sumDistinct?: Maybe<MediaKit_Aggregated_Fields>;
};

export type MediaKit_Aggregated_Count = {
  __typename?: 'mediaKit_aggregated_count';
  backgroundColor?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['Int']>;
  png?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  svg?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type MediaKit_Aggregated_Fields = {
  __typename?: 'mediaKit_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type MediaKit_Filter = {
  _and?: InputMaybe<Array<InputMaybe<MediaKit_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<MediaKit_Filter>>>;
  backgroundColor?: InputMaybe<String_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  name?: InputMaybe<String_Filter_Operators>;
  png?: InputMaybe<Directus_Files_Filter>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  svg?: InputMaybe<Directus_Files_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type NavigationType = {
  __typename?: 'navigationType';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type NavigationType_Aggregated = {
  __typename?: 'navigationType_aggregated';
  avg?: Maybe<NavigationType_Aggregated_Fields>;
  avgDistinct?: Maybe<NavigationType_Aggregated_Fields>;
  count?: Maybe<NavigationType_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<NavigationType_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<NavigationType_Aggregated_Fields>;
  min?: Maybe<NavigationType_Aggregated_Fields>;
  sum?: Maybe<NavigationType_Aggregated_Fields>;
  sumDistinct?: Maybe<NavigationType_Aggregated_Fields>;
};

export type NavigationType_Aggregated_Count = {
  __typename?: 'navigationType_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type NavigationType_Aggregated_Fields = {
  __typename?: 'navigationType_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

export type NavigationType_Filter = {
  _and?: InputMaybe<Array<InputMaybe<NavigationType_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<NavigationType_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  description?: InputMaybe<String_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<Number_Filter_Operators>;
};

export type Number_Filter_Operators = {
  _between?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _eq?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _gt?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _gte?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _in?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _lt?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _lte?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _nbetween?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _neq?: InputMaybe<Scalars['GraphQLStringOrFloat']>;
  _nin?: InputMaybe<Array<InputMaybe<Scalars['GraphQLStringOrFloat']>>>;
  _nnull?: InputMaybe<Scalars['Boolean']>;
  _null?: InputMaybe<Scalars['Boolean']>;
};

export type OfficialSocialMedia = {
  __typename?: 'officialSocialMedia';
  activeSvg?: Maybe<Directus_Files>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  link: Scalars['String'];
  name: Scalars['String'];
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  svg?: Maybe<Directus_Files>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type OfficialSocialMediaActiveSvgArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type OfficialSocialMediaSvgArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type OfficialSocialMedia_Aggregated = {
  __typename?: 'officialSocialMedia_aggregated';
  avg?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
  avgDistinct?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
  count?: Maybe<OfficialSocialMedia_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<OfficialSocialMedia_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
  min?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
  sum?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
  sumDistinct?: Maybe<OfficialSocialMedia_Aggregated_Fields>;
};

export type OfficialSocialMedia_Aggregated_Count = {
  __typename?: 'officialSocialMedia_aggregated_count';
  activeSvg?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  svg?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type OfficialSocialMedia_Aggregated_Fields = {
  __typename?: 'officialSocialMedia_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type OfficialSocialMedia_Filter = {
  _and?: InputMaybe<Array<InputMaybe<OfficialSocialMedia_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<OfficialSocialMedia_Filter>>>;
  activeSvg?: InputMaybe<Directus_Files_Filter>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  link?: InputMaybe<String_Filter_Operators>;
  name?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  svg?: InputMaybe<Directus_Files_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type RememberMeBlackListSites = {
  __typename?: 'rememberMeBlackListSites';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type RememberMeBlackListSites_Aggregated = {
  __typename?: 'rememberMeBlackListSites_aggregated';
  avg?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
  avgDistinct?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
  count?: Maybe<RememberMeBlackListSites_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<RememberMeBlackListSites_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
  min?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
  sum?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
  sumDistinct?: Maybe<RememberMeBlackListSites_Aggregated_Fields>;
};

export type RememberMeBlackListSites_Aggregated_Count = {
  __typename?: 'rememberMeBlackListSites_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type RememberMeBlackListSites_Aggregated_Fields = {
  __typename?: 'rememberMeBlackListSites_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type RememberMeBlackListSites_Filter = {
  _and?: InputMaybe<Array<InputMaybe<RememberMeBlackListSites_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<RememberMeBlackListSites_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  name?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  url?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type SocialMedia = {
  __typename?: 'socialMedia';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  svgUrl?: Maybe<Directus_Files>;
  title?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type SocialMediaSvgUrlArgs = {
  filter?: InputMaybe<Directus_Files_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type SocialMedia_Aggregated = {
  __typename?: 'socialMedia_aggregated';
  avg?: Maybe<SocialMedia_Aggregated_Fields>;
  avgDistinct?: Maybe<SocialMedia_Aggregated_Fields>;
  count?: Maybe<SocialMedia_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<SocialMedia_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<SocialMedia_Aggregated_Fields>;
  min?: Maybe<SocialMedia_Aggregated_Fields>;
  sum?: Maybe<SocialMedia_Aggregated_Fields>;
  sumDistinct?: Maybe<SocialMedia_Aggregated_Fields>;
};

export type SocialMedia_Aggregated_Count = {
  __typename?: 'socialMedia_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  /** Only support svg */
  svgUrl?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type SocialMedia_Aggregated_Fields = {
  __typename?: 'socialMedia_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type SocialMedia_Filter = {
  _and?: InputMaybe<Array<InputMaybe<SocialMedia_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<SocialMedia_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  link?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  svgUrl?: InputMaybe<Directus_Files_Filter>;
  title?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type String_Filter_Operators = {
  _contains?: InputMaybe<Scalars['String']>;
  _empty?: InputMaybe<Scalars['Boolean']>;
  _ends_with?: InputMaybe<Scalars['String']>;
  _eq?: InputMaybe<Scalars['String']>;
  _icontains?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _ncontains?: InputMaybe<Scalars['String']>;
  _nempty?: InputMaybe<Scalars['Boolean']>;
  _nends_with?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _nnull?: InputMaybe<Scalars['Boolean']>;
  _nstarts_with?: InputMaybe<Scalars['String']>;
  _null?: InputMaybe<Scalars['Boolean']>;
  _starts_with?: InputMaybe<Scalars['String']>;
};

export type TabMenu = {
  __typename?: 'tabMenu';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<TabType>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type TabMenuTypeArgs = {
  filter?: InputMaybe<TabType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TabMenu_Aggregated = {
  __typename?: 'tabMenu_aggregated';
  avg?: Maybe<TabMenu_Aggregated_Fields>;
  avgDistinct?: Maybe<TabMenu_Aggregated_Fields>;
  count?: Maybe<TabMenu_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<TabMenu_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<TabMenu_Aggregated_Fields>;
  min?: Maybe<TabMenu_Aggregated_Fields>;
  sum?: Maybe<TabMenu_Aggregated_Fields>;
  sumDistinct?: Maybe<TabMenu_Aggregated_Fields>;
};

export type TabMenu_Aggregated_Count = {
  __typename?: 'tabMenu_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type TabMenu_Aggregated_Fields = {
  __typename?: 'tabMenu_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type TabMenu_Filter = {
  _and?: InputMaybe<Array<InputMaybe<TabMenu_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<TabMenu_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<TabType_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type TabType = {
  __typename?: 'tabType';
  attribute?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type TabType_Aggregated = {
  __typename?: 'tabType_aggregated';
  avg?: Maybe<TabType_Aggregated_Fields>;
  avgDistinct?: Maybe<TabType_Aggregated_Fields>;
  count?: Maybe<TabType_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<TabType_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<TabType_Aggregated_Fields>;
  min?: Maybe<TabType_Aggregated_Fields>;
  sum?: Maybe<TabType_Aggregated_Fields>;
  sumDistinct?: Maybe<TabType_Aggregated_Fields>;
};

export type TabType_Aggregated_Count = {
  __typename?: 'tabType_aggregated_count';
  attribute?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
};

export type TabType_Aggregated_Fields = {
  __typename?: 'tabType_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
};

export type TabType_Filter = {
  _and?: InputMaybe<Array<InputMaybe<TabType_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<TabType_Filter>>>;
  attribute?: InputMaybe<String_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
  value?: InputMaybe<String_Filter_Operators>;
};

export type TopMenu = {
  __typename?: 'topMenu';
  children?: Maybe<Array<Maybe<TopSecondMenu>>>;
  children_func?: Maybe<Count_Functions>;
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  path?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<NavigationType>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type TopMenuChildrenArgs = {
  filter?: InputMaybe<TopSecondMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TopMenuTypeArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TopMenu_Aggregated = {
  __typename?: 'topMenu_aggregated';
  avg?: Maybe<TopMenu_Aggregated_Fields>;
  avgDistinct?: Maybe<TopMenu_Aggregated_Fields>;
  count?: Maybe<TopMenu_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<TopMenu_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<TopMenu_Aggregated_Fields>;
  min?: Maybe<TopMenu_Aggregated_Fields>;
  sum?: Maybe<TopMenu_Aggregated_Fields>;
  sumDistinct?: Maybe<TopMenu_Aggregated_Fields>;
};

export type TopMenu_Aggregated_Count = {
  __typename?: 'topMenu_aggregated_count';
  children?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type TopMenu_Aggregated_Fields = {
  __typename?: 'topMenu_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type TopMenu_Filter = {
  _and?: InputMaybe<Array<InputMaybe<TopMenu_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<TopMenu_Filter>>>;
  children?: InputMaybe<TopSecondMenu_Filter>;
  children_func?: InputMaybe<Count_Function_Filter_Operators>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  path?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<NavigationType_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};

export type TopSecondMenu = {
  __typename?: 'topSecondMenu';
  date_created?: Maybe<Scalars['Date']>;
  date_created_func?: Maybe<Datetime_Functions>;
  date_updated?: Maybe<Scalars['Date']>;
  date_updated_func?: Maybe<Datetime_Functions>;
  id: Scalars['ID'];
  index: Scalars['Int'];
  parent?: Maybe<TopMenu>;
  path?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<NavigationType>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
};

export type TopSecondMenuParentArgs = {
  filter?: InputMaybe<TopMenu_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TopSecondMenuTypeArgs = {
  filter?: InputMaybe<NavigationType_Filter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TopSecondMenu_Aggregated = {
  __typename?: 'topSecondMenu_aggregated';
  avg?: Maybe<TopSecondMenu_Aggregated_Fields>;
  avgDistinct?: Maybe<TopSecondMenu_Aggregated_Fields>;
  count?: Maybe<TopSecondMenu_Aggregated_Count>;
  countAll?: Maybe<Scalars['Int']>;
  countDistinct?: Maybe<TopSecondMenu_Aggregated_Count>;
  group?: Maybe<Scalars['JSON']>;
  max?: Maybe<TopSecondMenu_Aggregated_Fields>;
  min?: Maybe<TopSecondMenu_Aggregated_Fields>;
  sum?: Maybe<TopSecondMenu_Aggregated_Fields>;
  sumDistinct?: Maybe<TopSecondMenu_Aggregated_Fields>;
};

export type TopSecondMenu_Aggregated_Count = {
  __typename?: 'topSecondMenu_aggregated_count';
  date_created?: Maybe<Scalars['Int']>;
  date_updated?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  index?: Maybe<Scalars['Int']>;
  parent?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  user_created?: Maybe<Scalars['Int']>;
  user_updated?: Maybe<Scalars['Int']>;
};

export type TopSecondMenu_Aggregated_Fields = {
  __typename?: 'topSecondMenu_aggregated_fields';
  id?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
  parent?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['Float']>;
};

export type TopSecondMenu_Filter = {
  _and?: InputMaybe<Array<InputMaybe<TopSecondMenu_Filter>>>;
  _or?: InputMaybe<Array<InputMaybe<TopSecondMenu_Filter>>>;
  date_created?: InputMaybe<Date_Filter_Operators>;
  date_created_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  date_updated?: InputMaybe<Date_Filter_Operators>;
  date_updated_func?: InputMaybe<Datetime_Function_Filter_Operators>;
  id?: InputMaybe<Number_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  parent?: InputMaybe<TopMenu_Filter>;
  path?: InputMaybe<String_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  type?: InputMaybe<NavigationType_Filter>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
};
