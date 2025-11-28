import { AssetsState } from '../../../test/data/assetsState';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { useAppCASelector, useResetStore } from './index';
import * as indexHook from '../index';
import { renderHook } from '@testing-library/react';
import React from 'react';

describe('useAppCASelector', () => {
  test('should first', () => {
    const useAssets = () => {
      return useAppCASelector(state => state.assets);
    };
    const { result } = renderHookWithProvider(useAssets, setupStore(AssetsState));
    expect(result.current).toEqual(AssetsState.assets);
  });
});

describe('useResetStore', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('should first', () => {
    jest.spyOn(React, 'useCallback').mockImplementation((call: Function) => {
      return call();
    });
    const fun = () => {
      return jest.fn();
    };
    jest.spyOn(indexHook, 'useAppCommonDispatch').mockImplementation(fun);

    const resetStore = useResetStore();
    renderHook(() => resetStore);

    expect(React.useCallback).toHaveBeenCalledTimes(1);
  });
});
