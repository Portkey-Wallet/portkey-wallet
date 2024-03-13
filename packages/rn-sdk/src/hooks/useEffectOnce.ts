import { EffectCallback, useEffect } from 'react';

export default function useEffectOnce(effect: EffectCallback | (() => Promise<any>)) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
