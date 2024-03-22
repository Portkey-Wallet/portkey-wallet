import { EffectCallback, useEffect } from 'react';

export default function useEffectOnce(effect: EffectCallback) {
  useEffect(effect, []);
}
