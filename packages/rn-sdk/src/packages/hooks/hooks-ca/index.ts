import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CACommonState } from 'packages/types/types-ca/store';

export const useAppCASelector: TypedUseSelectorHook<CACommonState> = useSelector;
