import { DID_SCHEME, SCHEME_ACTION } from 'constants/scheme';
import { parseUrl } from 'query-string';
import { SchemeParsedUrl } from 'types/common';
import { isAddress } from '@portkey-wallet/utils';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';

const AddContactUrl = OfficialWebsite + '/sc/ac/';

export function handleScheme(str: string): SchemeParsedUrl | undefined {
  if (!str.includes(DID_SCHEME)) return;
  str = str.replace(`${DID_SCHEME}://`, '');
  const parsedUrl = parseUrl(str, {
    decode: true,
  });
  const { url, query } = parsedUrl || {};
  const domain = url.split('/')[0];
  const action = url.split('/')[1] as SCHEME_ACTION;
  return { domain, action, query };
}

export function checkAuthLoginData(extraData: any, data: any) {
  const { type, address, netWorkType, chainType } = data;

  if (type !== 'login') return;
  if (typeof netWorkType !== 'string') return;
  if (!isAddress(address, chainType)) return;
  if (typeof extraData?.websiteName !== 'string') return;

  return true;
}

export function checkAddContactUrl(url: string) {
  return typeof url === 'string' && url.startsWith(AddContactUrl);
}

export function getIDByAddContactUrl(url: string) {
  if (!checkAddContactUrl(url)) return;
  return url.replace(AddContactUrl, '').replace('/', '');
}
