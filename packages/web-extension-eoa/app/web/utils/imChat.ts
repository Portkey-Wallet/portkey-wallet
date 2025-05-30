import { LINK_PATH_ENUM } from '@portkey-wallet/constants/constants-ca/link';
import { LinkPortkeyWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { LinkPortkeyType } from 'types/im';

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
