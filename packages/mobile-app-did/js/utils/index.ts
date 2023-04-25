import dayjs from 'dayjs';
import * as Network from 'expo-network';

/**
 * timestamp to formatted time like 'Nov 10 at 1:09 pm', if last year format to "2020 Nov 10 at 1:09 pm "
 * @param time
 * @returns
 */

export const formatTransferTime = (time: string | number) => {
  if (dayjs(time).isBefore(dayjs(), 'year')) {
    return dayjs(time).format('YYYY MMM D , h:mm a').replace(',', 'at');
  }

  return dayjs(time).format('MMM D , h:mm a').replace(',', 'at');
};

export const checkNetwork = async () => {
  const state = await Network.getNetworkStateAsync();
  if (!state.isConnected || !state.isInternetReachable) throw new Error('Unstable network. Please try again later.');
};

export const getFaviconUrl = (url: string) => {
  const reg = /:\/\/(.[^/]+)/;
  const domain = url.match(reg);
  const newDomain = domain ? domain[1] : '';
  return `http://${newDomain}/favicon.ico`;
};

export const getFaviconUrlFromDomain = (domain = '') => {
  return `https://${domain}/favicon.ico`;
};
