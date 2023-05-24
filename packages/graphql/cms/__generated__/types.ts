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
  /** A Float or a String */
  GraphQLStringOrFloat: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Query = {
  __typename?: 'Query';
  discoverGroup: Array<DiscoverGroup>;
  discoverGroup_aggregated: Array<DiscoverGroup_Aggregated>;
  discoverGroup_by_id?: Maybe<DiscoverGroup>;
  discoverItem: Array<DiscoverItem>;
  discoverItem_aggregated: Array<DiscoverItem_Aggregated>;
  discoverItem_by_id?: Maybe<DiscoverItem>;
  socialMedia: Array<SocialMedia>;
  socialMedia_aggregated: Array<SocialMedia_Aggregated>;
  socialMedia_by_id?: Maybe<SocialMedia>;
  tabMenu: Array<TabMenu>;
  tabMenu_aggregated: Array<TabMenu_Aggregated>;
  tabMenu_by_id?: Maybe<TabMenu>;
  tabType: Array<TabType>;
  tabType_aggregated: Array<TabType_Aggregated>;
  tabType_by_id?: Maybe<TabType>;
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
  /** Not support svg */
  imgUrl?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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
  imgUrl?: InputMaybe<String_Filter_Operators>;
  index?: InputMaybe<Number_Filter_Operators>;
  sort?: InputMaybe<Number_Filter_Operators>;
  status?: InputMaybe<String_Filter_Operators>;
  title?: InputMaybe<String_Filter_Operators>;
  user_created?: InputMaybe<String_Filter_Operators>;
  user_updated?: InputMaybe<String_Filter_Operators>;
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
  /** Only support svg */
  svgUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  user_created?: Maybe<Scalars['String']>;
  user_updated?: Maybe<Scalars['String']>;
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
  svgUrl?: InputMaybe<String_Filter_Operators>;
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
