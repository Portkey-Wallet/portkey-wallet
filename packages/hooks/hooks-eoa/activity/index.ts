import { useAppEOASelector } from '../index';
export const useActivity = () => useAppEOASelector(state => state.activity);
