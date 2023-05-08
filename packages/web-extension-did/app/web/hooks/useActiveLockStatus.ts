import useInterval from '@portkey-wallet/hooks/useInterval';
import { useCommonState } from 'store/Provider/hooks';
import { useActiveLockStatusAction } from 'utils/lib/serviceWorkerAction';

export const useActiveLockStatus = () => {
  const activeLockStatus = useActiveLockStatusAction();
  const { isPrompt } = useCommonState();
  const timer = useInterval(
    () => {
      if (isPrompt) {
        timer.remove();
      } else {
        activeLockStatus().catch((err) => {
          console.log('useActiveLockStatus error', err);
        });
      }
    },
    1000 * 60,
    [],
  );
  return () => timer.remove();
};
