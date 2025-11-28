import { RequestOpts } from '@portkey/types';
import { stringify } from 'query-string';

export const timeoutPromise = (delay?: number) => {
  return new Promise<{ type: string }>(_resolve => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      _resolve({ type: 'timeout' });
    }, delay);
  });
};

const formatResponse = (response: string) => {
  try {
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
};
const formatError = (res: any, status: number) => {
  if (typeof res === 'string')
    return {
      message: res,
      status,
    };

  return { ...res, status };
};

const defaultHeaders = {
  Accept: 'text/plain;v=1.0',
  'Content-Type': 'application/json',
};

export const fetchFormat = async (config: RequestOpts, signal: AbortController['signal']) => {
  let { url: uri, method = 'GET', headers, query, body, params } = config;

  // TODO: adjust no url
  if (!uri) throw new Error('no url');

  if (!body && params) {
    body = JSON.stringify(params);
  }

  if (method === 'GET' || method === 'DELETE') {
    const _query = query || params;
    if (_query) {
      uri = Object.keys(_query).length > 0 ? `${uri}?${stringify(_query)}` : uri;
    }
    body = undefined;
  }

  // TODO:fix headers

  const myHeaders = { ...defaultHeaders, ...headers };

  const result = await fetch(uri, {
    method,
    headers: myHeaders,
    body,
    signal,
  });
  const text = await result.text();
  const res = formatResponse(text);

  if ((result.status as number).toString()[0] !== '2' || !result.ok) {
    throw formatError(res ? res : result.statusText, result.status);
  }
  return res;
};
