import { useAppCASelector } from '.';
import { getPhoneCountryCode, setLocalPhoneCountryCodeAction } from '@portkey-wallet/store/store-ca/misc/actions';
import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { DefaultCountry, getCountryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';
import { CountryItem } from '@portkey-wallet/types/types-ca/country';
import signalrDid from '@portkey-wallet/socket/socket-did';
import { request } from '@portkey-wallet/api/api-did';
import { INIT_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';

export const useMisc = () => useAppCASelector(state => state.misc);

export function useSetLocalPhoneCountryCode() {
  const dispatch = useAppCommonDispatch();

  const setLocalPhoneCountryCode = useCallback(
    (countryItem: CountryItem) => {
      dispatch(setLocalPhoneCountryCodeAction(countryItem));
    },
    [dispatch],
  );

  return setLocalPhoneCountryCode;
}

export function usePhoneCountryCode(isInit = false) {
  const dispatch = useAppCommonDispatch();

  const {
    phoneCountryCodeListChainMap,
    defaultPhoneCountryCode,
    localPhoneCountryCode: storeLocalPhoneCountryCode,
  } = useMisc();
  const { networkType } = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const phoneCountryCodeList = useMemo(
    () => phoneCountryCodeListChainMap?.[networkType] || [],
    [networkType, phoneCountryCodeListChainMap],
  );

  const phoneCountryCodeIndex = useMemo(() => getCountryCodeIndex(phoneCountryCodeList), [phoneCountryCodeList]);

  const localPhoneCountryCode = useMemo(
    () => storeLocalPhoneCountryCode || defaultPhoneCountryCode || DefaultCountry,
    [defaultPhoneCountryCode, storeLocalPhoneCountryCode],
  );

  useEffect(() => {
    if (isInit) {
      networkList.forEach(item => {
        const phoneCountryCodeIndexChainMapItem = phoneCountryCodeListChainMap?.[item.networkType] || [];
        if (phoneCountryCodeIndexChainMapItem.length === 0) {
          dispatch(getPhoneCountryCode(item.networkType));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInit) {
      dispatch(getPhoneCountryCode(networkType));
    }
  }, [dispatch, isInit, networkType]);

  const setLocalPhoneCountryCode = useSetLocalPhoneCountryCode();

  return { phoneCountryCodeList, phoneCountryCodeIndex, localPhoneCountryCode, setLocalPhoneCountryCode };
}

export const useIsScanQRCode = (clientId: string | undefined) => {
  const [isScanQRCode, setIsScanQRCode] = useState(false);
  const signalrDidRemoveRef = useRef<() => void>();

  const isActiveRef = useRef(true);
  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const cleanSignalr = useCallback(() => {
    try {
      signalrDidRemoveRef.current?.();
      signalrDidRemoveRef.current = undefined;
      signalrDid.stop();
      signalrDid.signalr = null;
    } catch (error) {
      console.log(error);
    }
  }, []);
  const cleanSignalrRef = useRef(cleanSignalr);

  const registerSignalr = useCallback(async (clientId: string) => {
    try {
      const { remove } = signalrDid.onScanLogin(() => {
        setIsScanQRCode(true);
        cleanSignalrRef.current();
      });
      signalrDidRemoveRef.current = remove;
      await signalrDid.doOpen({
        url: `${request.defaultConfig.baseURL}/ca`,
        clientId,
      });
      if (!isActiveRef.current) {
        throw new Error('isActiveRef.current is false');
      }
    } catch (error) {
      console.log('registerSignalr: error', error);
    }
  }, []);
  const registerSignalrRef = useRef(registerSignalr);

  useEffect(() => {
    if (!clientId) return;
    registerSignalrRef.current(clientId);
    return cleanSignalrRef.current;
  }, [clientId]);

  return isScanQRCode;
};

export const useTimer = () => {
  const timerRef = useRef<NodeJS.Timeout | number>();

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, []);

  const setTimer = useCallback((callback: () => void, time: number) => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(callback, time);
  }, []);

  const clearTimer = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  return { setTimer, clearTimer };
};

export const useErrorMessage = () => {
  const { setTimer, clearTimer } = useTimer();
  const [error, setError] = useState(INIT_ERROR);

  const onSetError = useCallback(
    (errorMsg?: string, time?: number) => {
      clearTimer();
      if (errorMsg === undefined) {
        setError({ ...INIT_NONE_ERROR });
        return;
      }

      setError({
        errorMsg,
        isError: true,
      });
      if (time !== undefined) {
        setTimer(() => {
          setError({ ...INIT_NONE_ERROR });
        }, time);
      }
    },
    [clearTimer, setTimer],
  );

  return {
    error,
    setError: onSetError,
  };
};
