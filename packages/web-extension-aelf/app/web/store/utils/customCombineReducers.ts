import { Action, AnyAction, combineReducers, ReducersMapObject } from '@reduxjs/toolkit';
import { CUSTOM_REHYDRATE } from 'constants/index';

function customReducer(key: string, baseReducer: any) {
  return (state: any, action: any) => {
    let newState: any;
    if (action.type === CUSTOM_REHYDRATE && key === action.key) {
      newState = action.payload;
    }
    return baseReducer(newState || state, action);
  };
}

export function customCombineReducers<S, A extends Action = AnyAction>(reducers: ReducersMapObject<S, A>) {
  const obj: any = {};
  Object.entries(reducers).forEach(([key, value]) => {
    obj[key] = customReducer(key, value);
  });
  return combineReducers(obj as ReducersMapObject<S, A>);
}
