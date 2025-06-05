import useInterval from '@portkey-wallet/hooks/useInterval';
import { useCommonState } from 'store/Provider/hooks';
import { activeLockStatusAction } from 'utils/lib/serviceWorkerAction';

export const useActiveLockStatus = () => {
  const { isPrompt } = useCommonState();
  const skipTime = isPrompt ? 60 : 3;
  const timer = useInterval(
    () => {
      activeLockStatusAction();
    },
    [],
    1000 * skipTime,
  );
  return () => timer.remove();
};
