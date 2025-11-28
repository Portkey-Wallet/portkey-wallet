import { useCallback, useState } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { useEffectOnce } from '../index';

export function useIsShowDeletion() {
  const [showDeletion, setShowDeletion] = useState(false);
  const init = useCallback(async () => {
    try {
      const req = await request.wallet.getShowDeletionEntrance();
      setShowDeletion(!!req?.entranceDisplay);
    } catch (error) {
      console.log(error, '===error');
    }
  }, []);
  useEffectOnce(() => {
    init();
  });

  return showDeletion;
}
