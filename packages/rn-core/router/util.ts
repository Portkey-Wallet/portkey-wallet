import router from '.';
import { PortkeyEntries } from './types';

export function initRouter(value: { from: string; params: any } | undefined) {
  const currentPage = value?.from as PortkeyEntries;
  router.push({ name: currentPage, params: value?.params });
  console.log('wfs current route list', router.pages);
}
