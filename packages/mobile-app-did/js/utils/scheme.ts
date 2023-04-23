import { DID_SCHEME, SCHEME_ACTION } from 'constants/scheme';
import { parseUrl } from 'query-string';
import { SchemeParsedUrl } from 'types/common';
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
  switch (action) {
    case SCHEME_ACTION.login:
      // TODO: check query
      console.log(domain, action, query, '====domain, action, query');

      break;
    default:
      console.log('this action is not supported');
  }
}
