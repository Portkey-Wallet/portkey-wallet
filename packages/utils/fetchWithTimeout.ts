import memoize from 'lodash/memoize';
import { SECOND } from '@portkey-wallet/constants';
// How to use
// const fetchWithTimeout = getFetchWithTimeout();
// const response = await (
//   await fetchWithTimeout('https://github.com/')
// ).json();

const getFetchWithTimeout = memoize((timeout = SECOND * 30) => {
  if (!Number.isInteger(timeout) || timeout < 1) {
    throw new Error('Must specify positive integer timeout.');
  }

  return async function _fetch(url: RequestInfo | URL, opts?: RequestInit) {
    const abortController = new window.AbortController();
    const { signal } = abortController;
    const f = window.fetch(url, {
      ...(opts ?? {}),
      signal,
    });

    const timer = setTimeout(() => abortController.abort(), timeout);

    try {
      const res = await f;
      clearTimeout(timer);
      return res;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  };
});

export default getFetchWithTimeout;
