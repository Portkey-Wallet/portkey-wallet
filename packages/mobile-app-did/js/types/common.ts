import { ChannelTypeEnum } from '@portkey-wallet/im';
import { SCHEME_ACTION } from 'constants/scheme';
import type { ParsedQuery } from 'query-string';

export type ErrorType = {
  errorMsg: string;
  isError: boolean;
  isWarning?: boolean;
};

export type SchemeParsedUrl = {
  domain: string;
  action: SCHEME_ACTION;
  query: ParsedQuery<string>;
};

export type LinkDappData = {
  url: string;
};

// todo: add more type
export type FCMMessageData = {
  badge: number;
  channelId: string;
  channelType: ChannelTypeEnum;
  fcm_options: {
    image: string;
  };
  network: string;
};
