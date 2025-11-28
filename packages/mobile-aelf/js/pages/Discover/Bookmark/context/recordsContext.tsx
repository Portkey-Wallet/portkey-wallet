import { basicActions } from 'contexts/utils';
import React, { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';

export interface RecordState {
  isEdit?: boolean;
}
export const RecordContext = createContext<[RecordState, React.Dispatch<any>] | []>([]);

export function useBookmark() {
  return useContext(RecordContext) as [RecordState, React.Dispatch<any>];
}

export enum RecordActions {
  setEdit = 'setEdit',
}

// reducer
export function reducer(state: RecordState, { type, payload }: any) {
  switch (type) {
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

// actions
export const basicBookmarkActions = {
  setEdit: (isEdit: boolean) => basicActions(RecordActions.setEdit, { isEdit }),
};

export const { setEdit } = basicBookmarkActions;

// provider
export const INITIAL_STATE = {};

export function RecordsProvider({ children }: { children?: ReactNode | undefined }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <RecordContext.Provider value={value as [RecordState, React.Dispatch<any>]}>{children}</RecordContext.Provider>
  );
}
