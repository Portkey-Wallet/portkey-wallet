import { createSlice, configureStore } from '@reduxjs/toolkit';

/**
 * example
 *
 * const { result } = renderHookWithProvider(useCurrentNetworkBalances, setupStore(state));
 */
export function setupStore(state: any) {
  const slice = createSlice({
    name: 'slice',
    initialState: state,
    reducers: {},
  });

  return configureStore({
    reducer: slice.reducer,
  });
}
