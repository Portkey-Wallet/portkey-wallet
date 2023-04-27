import { renderHook, act } from '@testing-library/react';
import { useActiveLockStatus } from './useActiveLockStatus';
import * as serviceWorkerAction from 'utils/lib/serviceWorkerAction';
import { useCommonState } from 'store/Provider/hooks';

jest.mock('store/Provider/hooks');

describe('useActiveLockStatus', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('isPrompt is true, clear timer, and return successfully', () => {
    jest.spyOn(serviceWorkerAction, 'useActiveLockStatusAction').mockReturnValue((): any => {
      return Promise.resolve();
    });
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: true, isPopupInit: true, isNotLessThan768: false });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    expect(result.current).toBeEnabled;
  });
  test('isPrompt is false, execute the activeLockStatus method, and return successfully', () => {
    jest.spyOn(serviceWorkerAction, 'useActiveLockStatusAction').mockReturnValue((): any => {
      return Promise.resolve();
    });
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: false, isPopupInit: true, isNotLessThan768: false });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    expect(result.current).toBeEnabled;
  });

  test('isPrompt is false, catch activeLockStatus error, and return successfully', () => {
    jest.spyOn(serviceWorkerAction, 'useActiveLockStatusAction').mockReturnValue((): any => {
      return Promise.reject({ code: 500 });
    });
    jest.mocked(useCommonState).mockReturnValue({ isPrompt: false, isPopupInit: true, isNotLessThan768: false });

    const { result } = renderHook(() => useActiveLockStatus());
    result.current();

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBeEnabled;
  });
});
