import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { EOACommonState } from '../../types/types-eoa/store';

export const useAppEOASelector: TypedUseSelectorHook<EOACommonState> = useSelector;
