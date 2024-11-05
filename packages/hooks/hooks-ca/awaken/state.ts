import { useCallback, useMemo, useRef } from 'react';
import { useAppCASelector } from '../.';
import { useGetAwakenGasFee } from './request';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { useCurrentNetwork } from '../network';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  updateAwakenGasFee,
  updateAwakenUserExpiration,
  updateAwakenUserSlippageTolerance,
} from '@portkey-wallet/store/store-ca/awaken/actions';
import { DEFAULT_EXPIRATION, DEFAULT_SLIPPAGE_TOLERANCE } from '@portkey-wallet/constants/constants-ca/awaken';

export const useAwakenState = () => useAppCASelector(state => state.awaken);

export const useAwakenGasFeeState = () => useAppCASelector(state => state.awaken.gasFee);
export const useAwakenGasFee = () => {
  const currentNetwork = useCurrentNetwork();
  const awakenGasFeeState = useAwakenGasFeeState();

  return useMemo(() => awakenGasFeeState[currentNetwork] || '', [awakenGasFeeState, currentNetwork]);
};

export const useInitAwakenGasFeeState = () => {
  const dispatch = useAppCommonDispatch();
  const getAwakenGasFee = useGetAwakenGasFee();
  const network = useCurrentNetwork();
  const networkRef = useRef(network);
  networkRef.current = network;

  const init = useCallback(async () => {
    const _network = networkRef.current;
    try {
      const gasFee = await handleLoopFetch({
        fetch: getAwakenGasFee,
        times: 5,
        checkIsInvalid: () => _network !== networkRef.current,
      });
      if (!gasFee) return;
      dispatch(
        updateAwakenGasFee({
          network: _network,
          gasFee,
        }),
      );
    } catch (error) {
      console.log('useInitAwakenGasFeeState error', error);
    }
  }, [dispatch, getAwakenGasFee]);

  useEffectOnce(() => {
    init();
  });
};

export const useAwakenUserSlippageToleranceState = () => useAppCASelector(state => state.awaken.userSlippageTolerance);

export const useAwakenUserSlippageTolerance = () => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  const awakenUserSlippageToleranceState = useAwakenUserSlippageToleranceState();

  const userSlippageTolerance = useMemo(
    () => awakenUserSlippageToleranceState[currentNetwork] || DEFAULT_SLIPPAGE_TOLERANCE,
    [awakenUserSlippageToleranceState, currentNetwork],
  );

  const update = useCallback(
    (val: string) => {
      dispatch(
        updateAwakenUserSlippageTolerance({
          network: currentNetwork,
          userSlippageTolerance: val,
        }),
      );
    },
    [currentNetwork, dispatch],
  );

  return {
    userSlippageTolerance,
    update,
  };
};

export const useAwakenUserExpirationState = () => useAppCASelector(state => state.awaken.userExpiration);

export const useAwakenUserExpiration = () => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  const awakenUserExpirationState = useAwakenUserExpirationState();

  const userExpirationState = useMemo(
    () => awakenUserExpirationState[currentNetwork] || DEFAULT_EXPIRATION,
    [awakenUserExpirationState, currentNetwork],
  );

  const update = useCallback(
    (val: string) => {
      dispatch(
        updateAwakenUserExpiration({
          network: currentNetwork,
          userExpiration: val,
        }),
      );
    },
    [currentNetwork, dispatch],
  );

  return {
    userExpirationState,
    update,
  };
};
