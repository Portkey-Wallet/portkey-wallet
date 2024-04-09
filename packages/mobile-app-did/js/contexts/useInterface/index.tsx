import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { ChainId } from '@portkey-wallet/types';
import { getAelfInstance } from '@portkey-wallet/utils/aelf';
import usePrevious from 'hooks/usePrevious';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { InterfaceActions, setCurrentInterface } from './actions';
import { State } from './types';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
import useScheme from 'hooks/useScheme';
import useNotify from 'hooks/useNotifyAction';

const INITIAL_STATE = {};
const InterfaceContext = createContext<any>(INITIAL_STATE);

export function useInterface(): [State, any] {
  return useContext(InterfaceContext);
}

//reducer
function reducer(state: State, { type, payload }: any) {
  switch (type) {
    case InterfaceActions.setViewContract: {
      const { viewContracts } = state;
      return Object.assign({}, state, { viewContracts: Object.assign({}, viewContracts, payload.viewContract) });
    }
    case InterfaceActions.setCAContract: {
      const { caContracts } = state;
      const { caContract, chainId } = payload;
      return Object.assign({}, state, {
        caContracts: Object.assign({}, caContracts, {
          [chainId]: { ...caContracts?.[chainId as ChainId], ...caContract },
        }),
      });
    }
    case InterfaceActions.setTokenContract: {
      const { tokenContracts } = state;
      const { tokenContract, chainId } = payload;
      return Object.assign({}, state, {
        tokenContracts: Object.assign({}, tokenContracts, {
          [chainId]: { ...tokenContracts?.[chainId as ChainId], ...tokenContract },
        }),
      });
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const currentNetwork = useCurrentNetwork();
  const prevRpcUrl = usePrevious(currentNetwork.rpcUrl);
  const [googleRequest, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    shouldAutoExchangeCode: false,
  });
  useScheme();
  useNotify();
  useEffect(() => {
    if (currentNetwork.chainType === 'aelf') {
      if (prevRpcUrl !== currentNetwork.rpcUrl) dispatch(setCurrentInterface(getAelfInstance(currentNetwork.rpcUrl)));
    } else {
      // TODO:ethereum
    }
  }, [currentNetwork.chainType, currentNetwork.rpcUrl, prevRpcUrl]);
  return (
    <InterfaceContext.Provider
      value={useMemo(
        () => [{ ...state, googleRequest, response, promptAsync }, dispatch],
        [state, googleRequest, response, promptAsync],
      )}>
      {children}
    </InterfaceContext.Provider>
  );
}
