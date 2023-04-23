import { DID_SCHEME, SCHEME_ACTION } from 'constants/scheme';
import { parseUrl } from 'query-string';
import { SchemeParsedUrl } from 'types/common';
import { showAuthLogin } from 'components/AuthLoginOverlay';
import { isAddress } from '@portkey-wallet/utils';

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

export function handleParsedUrl(parsedUrl: SchemeParsedUrl) {
  const { domain, action, query } = parsedUrl;

  try {
    switch (action) {
      case SCHEME_ACTION.login: {
        let { extraData, data } = query as any;
        extraData = JSON.parse(extraData);
        data = JSON.parse(data);
        if (checkAuthLoginData(extraData, data)) showAuthLogin({ loginData: data, extraData: extraData, domain });
        break;
      }

      default:
        console.log('this action is not supported');
    }
  } catch (error) {
    console.log(error);
  }
}

export function checkAuthLoginData(extraData: any, data: any) {
  const { type, address, netWorkType, chainType } = data;

  if (type !== 'login') return;
  if (typeof netWorkType !== 'string') return;
  if (!isAddress(address, chainType)) return;
  if (typeof extraData?.websiteName !== 'string') return;

  return true;
}
