import { useCallback, useMemo, useRef } from 'react';
import googleAnalytics from 'utils/googleAnalytics';
import { TGAPageKey } from 'utils/googleAnalytics/types';

const useGAReport = () => {
  const startRef = useRef<Record<string, boolean>>({});
  const endRef = useRef<Record<string, boolean>>({});

  const startReport = useCallback((pageKey: TGAPageKey, additionalParams?: object) => {
    if (startRef.current[pageKey]) return;
    startRef.current[pageKey] = true;
    googleAnalytics.pageStateUpdateStartEvent(pageKey, additionalParams);
  }, []);

  const endReport: (pageKey: TGAPageKey, additionalParams?: object) => void = useCallback(
    (pageKey: TGAPageKey, additionalParams?: object) => {
      if (endRef.current[pageKey]) return;
      endRef.current[pageKey] = true;
      googleAnalytics.pageStateUpdateEndEvent(pageKey, additionalParams);
    },
    [],
  );

  return useMemo(() => ({ startReport, endReport }), [startReport, endReport]);
};

export default useGAReport;
