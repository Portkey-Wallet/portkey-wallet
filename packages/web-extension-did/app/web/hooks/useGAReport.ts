import { useDebounceCallback } from '@portkey-wallet/hooks';
import { useCallback, useMemo, useRef } from 'react';
import googleAnalytics from 'utils/googleAnalytics';
import { TGAPageKey } from 'utils/googleAnalytics/types';

const useGAReport = () => {
  const startRef = useRef<boolean>();

  const startReport = useCallback((pageKey: TGAPageKey, additionalParams?: object) => {
    if (startRef.current) return;
    googleAnalytics.pageStateUpdateStartEvent(pageKey, additionalParams);
  }, []);

  const endReport: (pageKey: TGAPageKey, additionalParams?: object) => void = useDebounceCallback(
    (pageKey: TGAPageKey, additionalParams?: object) => {
      googleAnalytics.pageStateUpdateEndEvent(pageKey, additionalParams);
    },
    [],
  );

  return useMemo(() => ({ startReport, endReport }), [startReport, endReport]);
};

export default useGAReport;
