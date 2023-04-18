// import { useLocation } from 'react-use';

import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useCommonState } from 'store/Provider/hooks';
import { setIsPopupInit } from 'store/reducers/common/slice';
import { setLocalStorage } from 'utils/storage/chromeStorage';
let timer: NodeJS.Timeout;

export default function useLocationChange() {
  const location = useLocation();
  const { isPrompt, isPopupInit } = useCommonState();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location.pathname.startsWith('/unlock')) {
      dispatch(setIsPopupInit(true));
      return;
    }
    if (!isPopupInit) return clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      dispatch(setIsPopupInit(false));
    }, 500);
  }, [dispatch, isPopupInit, location.pathname]);

  const locationSet = useCallback(async () => {
    let locationState = null;
    // TODO Only use setting guardians; Support for others is a feature
    if (location.pathname.startsWith('/setting/guardians')) {
      locationState = {
        path: `${location.pathname}${location.search}`,
        state: location.state,
      };
    }
    setLocalStorage({
      locationState,
    });
  }, [location]);

  useEffect(() => {
    if (isPrompt) return;
    locationSet();
  }, [isPrompt, locationSet]);
}
