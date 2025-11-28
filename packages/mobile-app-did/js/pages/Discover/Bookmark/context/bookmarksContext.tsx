import { basicActions } from 'contexts/utils';
import React, { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';

export interface BookmarkState {
  isEdit?: boolean;
}
export const BookmarkContext = createContext<[BookmarkState, React.Dispatch<any>] | []>([]);

export function useBookmark() {
  return useContext(BookmarkContext) as [BookmarkState, React.Dispatch<any>];
}

export enum BookmarkActions {
  setEdit = 'setEdit',
}

// reducer
export function reducer(state: BookmarkState, { type, payload }: any) {
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
  setEdit: (isEdit: boolean) => basicActions(BookmarkActions.setEdit, { isEdit }),
};

export const { setEdit } = basicBookmarkActions;

// provider
export const INITIAL_STATE = {};

export function BookmarkProvider({ children }: { children?: ReactNode | undefined }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <BookmarkContext.Provider value={value as [BookmarkState, React.Dispatch<any>]}>
      {children}
    </BookmarkContext.Provider>
  );
}
