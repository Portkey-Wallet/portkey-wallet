import { useEffectOnce } from '@portkey-wallet/hooks';
import { EffectCallback } from 'react';

export function useAfterTransitionEffectOnce(effect: EffectCallback, delay = 500) {
  useEffectOnce(() => {
    const timer = setTimeout(() => {
      effect();
    }, delay);
    return () => clearTimeout(timer);
  });
}
