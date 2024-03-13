import { DID_SCHEME, SCHEME_ACTION, V1_DID_SCHEME } from 'constants/scheme';
import { parseUrl } from 'query-string';
import { SchemeParsedUrl } from 'types/common';
import { isAddress } from '@portkey-wallet/utils';
import { LinkPortkeyWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { LINK_PATH_ENUM } from '@portkey-wallet/constants/constants-ca/link';
export type LinkPortkeyType = 'addContact' | 'addGroup';

export function handleScheme(str: string): SchemeParsedUrl | undefined {
  str = str.replace(`${DID_SCHEME}://`, '').replace(`${V1_DID_SCHEME}://`, '');
  const parsedUrl = parseUrl(str, {
    decode: true,
  });
  const { url, query } = parsedUrl || {};
  const domain = url.split('/')[0];
  const action = url.split('/')[1] as SCHEME_ACTION;
  return { domain, action, query };
}

export function checkAuthLoginData(extraData: any, data: any) {
  const { type, address, networkType, chainType } = data;

  if (type !== 'login') return;
  if (typeof networkType !== 'string') return;
  if (!isAddress(address, chainType)) return;
  if (typeof extraData?.websiteName !== 'string') return;

  return true;
}

export function parseLinkPortkeyUrl(url: string) {
  if (!checkLinkPortkeyUrl(url)) return {};
  url = url.replace(LinkPortkeyWebsite, '');
  const path = url.substring(0, 7);
  const idPath = url.slice(7);
  const id = idPath.indexOf('/') ? idPath.split('/')[0] : idPath;
  let type: LinkPortkeyType | undefined;
  switch (path) {
    case LINK_PATH_ENUM.addContact:
      type = 'addContact';
      break;
    case LINK_PATH_ENUM.addGroup:
      type = 'addGroup';
      break;
  }
  if (type) return { type, id };
  return {};
}

export function checkLinkPortkeyUrl(url: string) {
  return typeof url === 'string' && url.startsWith(LinkPortkeyWebsite);
}
