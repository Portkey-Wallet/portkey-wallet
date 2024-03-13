/* eslint-disable no-useless-escape */
export function checkIsPortKeyUrl(url: string): boolean {
  const pattern = /^(portkey):\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?$/;
  const match = url.match(pattern);
  return match ? match.length > 1 && match[1] === 'portkey' : false;
}
export function parseUrl(
  url: string,
): { protocol: string; host: string; path: string; query: Map<string, string> } | null {
  const pattern = /^([^:]+):\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?$/;
  const match = url.match(pattern);

  if (match) {
    const protocol = match[1];
    const host = match[2];
    const path = match[3] || '';
    const query = match[4] || '';

    const queryMap = new Map<string, string>();
    const queryParams = query.substring(1).split('&');
    queryParams.forEach(param => {
      const [key, value] = param.split('=');
      queryMap.set(key, value);
    });

    return { protocol, host, path, query: queryMap };
  }

  return null;
}
export function isEntryScheme(url: string) {
  const parsed = parseUrl(url);
  if (
    parsed &&
    parsed.protocol === ENTRY_PROTOCOL &&
    parsed.host === ENTRY_HOST &&
    parsed.path === ENTRY_PATH &&
    parsed.query.has(ENTRY_KEY)
  ) {
    return {
      entry: parsed.query.get(ENTRY_KEY),
      query: Array.from(parsed.query).reduce((obj: any, [key, value]) => {
        if (key !== ENTRY_KEY) {
          obj[key] = value;
        }
        return obj;
      }, {}),
    };
  }
  return false;
}
export const ENTRY_PROTOCOL = 'portkey';
export const ENTRY_HOST = 'www.portkey.com';
export const ENTRY_PATH = '/rn';
export const ENTRY_KEY = 'entry';
