import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { isUrl } from '@portkey-wallet/utils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

function usePortkeyLink() {
  const navigate = useNavigate();
  return useCallback(
    (item: TBaseCardItemType) => {
      const extensionLink = parseLink(item.extensionLink, item.url);
      if (extensionLink.type === 'native') {
        navigate(`${extensionLink.location}${extensionLink.params}`);
      } else {
        if (isUrl(extensionLink.location)) {
          window.open(extensionLink.location, '_blank');
        }
      }
    },
    [navigate],
  );
}
export function usePortkeyCommonLink() {
  const navigate = useNavigate();
  return useCallback(
    (extensionLinkString: string) => {
      const extensionLink = parseLink(extensionLinkString, '');
      if (extensionLink.type === 'native') {
        navigate(`${extensionLink.location}${extensionLink.params}`);
      } else {
        if (isUrl(extensionLink.location)) {
          window.open(extensionLink.location, '_blank');
        }
      }
    },
    [navigate],
  );
}
export default usePortkeyLink;
