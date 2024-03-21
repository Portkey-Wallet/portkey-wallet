import { ChannelTypeEnum } from '@portkey-wallet/im';
import { SCHEME_ACTION } from 'constants/scheme';
import type { ParsedQuery } from 'query-string';

export type SchemeParsedUrl = {
  domain: string;
  action: SCHEME_ACTION;
  query: ParsedQuery<string>;
};

export type LinkDappData = {
  url: string;
};

export type FCMMessageData = {
  badge: number;
  channelId: string;
  channelType: ChannelTypeEnum;
  fcm_options: {
    image: string;
  };
  network: string;
};
