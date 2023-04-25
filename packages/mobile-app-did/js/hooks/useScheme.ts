import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { usePin } from './store';
import useEffectOnce from './useEffectOnce';
import { handleParsedUrl, handleScheme } from 'utils/scheme';

export default function useScheme() {
  const { address, caHash } = useCurrentWalletInfo();
  const [schemeUrl, setSchemeUrl] = useState<string>();

  const pin = usePin();
  const logged = useMemo(() => !!address && caHash, [address, caHash]);

  const getInitialURL = useCallback(async () => {
    if (!logged) return;
    const url = await Linking.getInitialURL();
    url && setSchemeUrl(url);
  }, [logged]);

  useEffectOnce(() => {
    getInitialURL();
  });

  useEffect(() => {
    const linkingListener = Linking.addEventListener('url', ({ url }) => {
      if (!logged) return;
      url && setSchemeUrl(url);
    });
    return () => {
      linkingListener.remove();
    };
  }, [logged]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pin && schemeUrl) {
      timer = setTimeout(() => {
        const parsedUrl = handleScheme(schemeUrl);
        if (parsedUrl) handleParsedUrl(parsedUrl);
        setSchemeUrl(undefined);
      }, 500);
    }
    return () => {
      timer && clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, schemeUrl]);
}
