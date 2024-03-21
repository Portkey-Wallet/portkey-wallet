import { useState } from 'react';
import useEffectOnce from './useEffectOnce';

export default function useRefreshOnce() {
  const [, refresh] = useState<number>(0);
  useEffectOnce(() => {
    const timer = setTimeout(() => {
      refresh(i => i + 1);
      clearTimeout(timer);
    }, 0);
  });
}
