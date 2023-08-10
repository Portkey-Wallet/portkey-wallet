import { Message } from '@portkey-wallet/im';
import React, { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';

export function basicActions<T extends string>(type: T, payload?: any) {
  return {
    type,
    payload,
  };
}
export type BasicActions<T = string> = {
  dispatch: (actions: { type: T; payload: any }) => void;
};

export interface ChannelState {
  list: Message[];
  hasNext: boolean;
}

export const INITIAL_STATE = {
  list: [],
  hasNext: false,
};

export const ChannelContext = createContext<[ChannelState, React.Dispatch<any>] | []>([]);

export function useChannelContext() {
  return useContext(ChannelContext) as [ChannelState, React.Dispatch<any>];
}

export enum ChannelActions {
  CLEAR_CHANNEL = 'clearChannel',
  ADD_MESSAGE = 'addMessage',
  NEXT_LIST = 'nextList',
  SET_LIST = 'setList',
  SET_HAS_NEXT = 'setHasNext',
  DELETE_MESSAGE = 'deleteMessage',
}

// reducer
export function reducer(state: ChannelState, { type, payload }: { type: ChannelActions; payload: any }) {
  switch (type) {
    case ChannelActions.ADD_MESSAGE:
      return Object.assign({}, state, {
        list: [...state.list, payload],
      });

    case ChannelActions.NEXT_LIST:
      return Object.assign({}, state, {
        list: [...payload, ...state.list],
      });

    case ChannelActions.SET_LIST:
      return Object.assign({}, state, {
        list: payload,
      });

    case ChannelActions.SET_HAS_NEXT:
      return Object.assign({}, state, {
        hasNext: payload,
      });
    case ChannelActions.DELETE_MESSAGE:
      return Object.assign({}, state, {
        list: state.list.filter(item => item.sendUuid !== payload),
      });

    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

// actions
export const basicChannelActions = {
  clearChannel: () =>
    basicActions(ChannelActions.CLEAR_CHANNEL, {
      ...INITIAL_STATE,
    }),
  addMessage: (message: Message) => basicActions(ChannelActions.ADD_MESSAGE, message),
  nextList: (list: Message[]) => basicActions(ChannelActions.NEXT_LIST, list),
  setList: (list: Message[]) => basicActions(ChannelActions.NEXT_LIST, list),
  setHasNext: (value: boolean) => basicActions(ChannelActions.SET_HAS_NEXT, value),
  deleteMessage: (sendUuid: string) => basicActions(ChannelActions.DELETE_MESSAGE, sendUuid),
};

export const { clearChannel, addMessage, nextList, setList, setHasNext, deleteMessage } = basicChannelActions;

// provider
export function ChannelProvider({ children }: { children?: ReactNode | undefined }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <ChannelContext.Provider value={value as [ChannelState, React.Dispatch<any>]}>{children}</ChannelContext.Provider>
  );
}
