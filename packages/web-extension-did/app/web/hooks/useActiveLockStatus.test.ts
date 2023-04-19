import { renderHook } from '@testing-library/react';
import { useActiveLockStatus } from './useActiveLockStatus';
import { useActiveLockStatusAction } from 'utils/lib/serviceWorkerAction';
import { useCommonState } from 'store/Provider/hooks';

jest.mock('utils/lib/serviceWorkerAction');
jest.mock('store/Provider/hooks');

describe('useActiveLockStatus', () => {
  test('isPrompt is true, clear timer, and return successfully', () => {
    jest.mocked(useActiveLockStatusAction).mockReturnValue(() => Promise.resolve());
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: true, isPopupInit: true });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    expect(result.current).toBeEnabled;
  });
  test('isPrompt is false, execute the activeLockStatus method, and return successfully', () => {
    jest.mocked(useActiveLockStatusAction).mockReturnValue(() => Promise.resolve());
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: false, isPopupInit: true });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    expect(result.current).toBeEnabled;
  });

  test('isPrompt is false, catch activeLockStatus error, and return successfully', () => {
    jest.mocked(useActiveLockStatusAction).mockReturnValue(() => Promise.reject('error'));
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: false, isPopupInit: true });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    expect(result.current).toBeEnabled;
  });
});
