import { basicActions } from 'contexts/utils';
import React, { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';

export enum ChatBottomBarStatus {
  input,
  tools,
  emoji,
}

export interface ChatsState {
  showTools?: boolean;
  bottomBarStatus?: ChatBottomBarStatus;
  text: string;
}
export const ChatsContext = createContext<[ChatsState, React.Dispatch<any>] | []>([]);

export function useChats() {
  return useContext(ChatsContext) as [ChatsState, React.Dispatch<any>];
}

export enum ChatsActions {
  setShowTools = 'setShowTools',
  setBottomBarStatus = 'setBottomBarStatus',
  setText = 'setText',
}

// reducer
export function reducer(state: ChatsState, { type, payload }: any) {
  switch (type) {
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

// actions
export const basicChatsActions = {
  setShowTools: (showTools: boolean) => basicActions(ChatsActions.setShowTools, { showTools }),
  setBottomBarStatus: (bottomBarStatus?: ChatBottomBarStatus) =>
    basicActions(ChatsActions.setBottomBarStatus, { bottomBarStatus }),
  setText: (text?: string) => basicActions(ChatsActions.setText, { text }),
};

export const { setShowTools, setBottomBarStatus, setText } = basicChatsActions;

// provider
export const INITIAL_STATE = {
  text: '',
};

export function ChatsProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const value = useMemo(() => [state, dispatch], [state]);
  return <ChatsContext.Provider value={value as [ChatsState, React.Dispatch<any>]}>{children}</ChatsContext.Provider>;
}
