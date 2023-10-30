import qs from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router';

export default function usePromptSearch<T = any>(): T {
  const { search } = useLocation();
  return useMemo(() => {
    const { detail } = qs.parse(search);
    return detail ? JSON.parse(detail as string) : {};
  }, [search]);
}
