import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootCommonState } from '../types/store';
export { useAppEOASelector } from './hooks-eoa/index';
export { useAppCASelector } from './hooks-ca/index';

export const useAppCommonDispatch: () => any = useDispatch;
export const useAppCommonSelector: TypedUseSelectorHook<RootCommonState> = useSelector;
