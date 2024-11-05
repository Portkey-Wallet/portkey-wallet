import { useCallback, useMemo, useRef } from 'react';
import { useAppCASelector } from '../.';
import { useGetAwakenGasFee } from './request';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { useCurrentNetwork } from '../network';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import { updateAwakenGasFee } from '@portkey-wallet/store/store-ca/awaken/actions';

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
