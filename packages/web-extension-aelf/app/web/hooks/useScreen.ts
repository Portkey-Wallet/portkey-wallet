import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setIsNotLessThan768 } from 'store/reducers/common/slice';

export function useIsNotLessThan768() {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      appDispatch(setIsNotLessThan768(!(document?.documentElement.clientWidth < 768)));
    };

    handleResize();

    window.addEventListener('resize', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize, true);
    };
  });
}
