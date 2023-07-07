import { usePayment, useGetAchTokenInfo, useSellTransfer } from './payment';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { PaymentState } from '../../../test/data/paymentState';
import { GuardianState } from '../../../test/data/guardianState';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { useAppCommonDispatch } from '../index';
import * as networkHook from './network';
import { renderHook } from '@testing-library/react';
import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { randomId } from '@portkey-wallet/utils';
import signalrSell from '@portkey-wallet/socket/socket-sell';
import { request } from '@portkey-wallet/api/api-did';

jest.mock('@portkey-wallet/api/api-did/payment/util');
jest.mock('../index');
jest.mocked(useAppCommonDispatch).mockReturnValue(async (call: () => void) => {
  return call;
});
jest.mock('@portkey-wallet/utils');
jest.mock('@portkey-wallet/socket/socket-sell');
jest.mock('@portkey-wallet/api/api-did');

beforeAll(() => {
  jest.useFakeTimers();
});
beforeEach(() => {
  jest.restoreAllMocks();
});

describe('usePayment', () => {
  test('get payment data successfully', () => {
    const { result } = renderHookWithProvider(usePayment, setupStore(PaymentState));

    expect(result.current).toHaveProperty('achTokenInfo');
    expect(result.current).toHaveProperty('buyFiatList');
    expect(result.current).toHaveProperty('sellFiatList');
  });
  test('failed to get payment data', () => {
    const { result } = renderHookWithProvider(usePayment, setupStore({}));

    expect(result.current).toBeUndefined();
  });
});

describe('useGetAchTokenInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('complete data, and return successfully', async () => {
    expect.assertions(2);

    const achToken = { id: 'achTokenId', email: 'aurora@porykey.finance', accessToken: 'ACH...gA==' };
    jest.mocked(getAchToken).mockResolvedValue(achToken);

    const state = { ...PaymentState, ...GuardianState };
    const { result } = renderHookWithProvider(useGetAchTokenInfo, setupStore(state));
    expect(result.current).toBeInstanceOf(Function);

    const res = await result.current();
    expect(res).toHaveProperty('token', PaymentState.payment.achTokenInfo?.token);
  });

  test('no userGuardiansList data, and catch error', async () => {
    expect.assertions(2);

    const state = { ...PaymentState, guardians: {} };

    const { result } = renderHookWithProvider(useGetAchTokenInfo, setupStore(state));
    expect(result.current).toBeInstanceOf(Function);

    try {
      await result.current();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('no emailGuardian data, and return undefined', async () => {
    expect.assertions(2);

    const state = { ...PaymentState, guardians: { userGuardiansList: [] } };

    const { result } = renderHookWithProvider(useGetAchTokenInfo, setupStore(state));
    expect(result.current).toBeInstanceOf(Function);
    expect(await result.current()).toBeUndefined();
  });

  test('no achTokenInfo data, fetch AchToken, and return successfully', async () => {
    expect.assertions(2);

    const state = { payment: { achTokenInfo: undefined }, ...GuardianState };
    const achToken = { id: 'achTokenId', email: 'aurora@porykey.finance', accessToken: 'ACH043...QpgA==' };
    jest.mocked(getAchToken).mockResolvedValue(achToken);

    const { result } = renderHookWithProvider(useGetAchTokenInfo, setupStore(state));
    expect(result.current).toBeInstanceOf(Function);

    const res = await result.current();
    expect(res).toHaveProperty('token', achToken.accessToken);
  });
});

describe('useSellTransfer', () => {
  test('testnet, and halfway return', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(false);

    const { result } = renderHook(() => useSellTransfer());

    const res = await result.current({ merchantName: ACH_MERCHANT_NAME, orderId: '', paymentSellTransfer: jest.fn() });
    expect(res).toBeUndefined();
  });
  test('merchantName !== ACH_MERCHANT_NAME, and halfway return', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);

    const { result } = renderHook(() => useSellTransfer());

    const res = await result.current({
      merchantName: (ACH_MERCHANT_NAME + 'test') as any,
      orderId: '',
      paymentSellTransfer: jest.fn(),
    });
    expect(res).toBeUndefined();
  });
  test('mainnet and signalrSellResult === null, throw TIMEOUT error', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.mocked(randomId).mockReturnValue('test_id');
    jest.mocked(signalrSell.doOpen).mockImplementation(jest.fn());
    const mockSignalrSell = jest.fn((_params, callback) => {
      callback(null); // mock callback behavior
      return {
        remove: jest.fn(), // return mock remove function
      };
    });
    jest.mocked(signalrSell.onAchTxAddressReceived).mockImplementation(mockSignalrSell);
    jest.mocked(signalrSell.requestAchTxAddress).mockImplementation(jest.fn());
    // jest.spyOn(window.Promise, 'race').mockResolvedValue(null);

    // renderHook
    const { result } = renderHook(() => useSellTransfer());

    const mockPaymentSellTransfer = jest.fn().mockResolvedValue({
      transactionId: 'transactionId',
    });

    try {
      await result.current({
        merchantName: ACH_MERCHANT_NAME,
        orderId: '',
        paymentSellTransfer: mockPaymentSellTransfer,
      });
    } catch (error) {
      expect(error).toEqual({ code: 'TIMEOUT', message: 'Transaction failed.' });
    }
  });
  test('mainnet, signalrSellResult and !transactionId, throw NO_TX_HASH error ', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.mocked(randomId).mockReturnValue('test_id');
    jest.mocked(signalrSell.doOpen).mockImplementation(jest.fn());
    const mockSignalrSell = jest.fn((params, callback) => {
      const data = { params };
      callback(data); // mock callback behavior
      return {
        remove: jest.fn(), // return mock remove function
      };
    });
    jest.mocked(signalrSell.onAchTxAddressReceived).mockImplementation(mockSignalrSell);
    jest.mocked(signalrSell.requestAchTxAddress).mockImplementation(jest.fn());
    jest.mocked(signalrSell.stop).mockImplementation(jest.fn());
    jest.spyOn(global, 'setTimeout');
    jest.runAllTimers();
    jest.mocked(request.payment.updateAlchemyOrderTxHash).mockResolvedValue({});

    // renderHook
    const { result } = renderHook(() => useSellTransfer());

    const mockPaymentSellTransfer = jest.fn().mockResolvedValue({
      transactionId: '',
    });
    try {
      await result.current({
        merchantName: ACH_MERCHANT_NAME,
        orderId: '',
        paymentSellTransfer: mockPaymentSellTransfer,
      });
    } catch (error) {
      // expect
      expect(error).toEqual({
        code: 'NO_TX_HASH',
        message: 'Transaction failed. Please contact the team for assistance.',
      });
    }
  });
  test('mainnet, signalrSellResult and transactionId, update order tx hash', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.mocked(randomId).mockReturnValue('test_id');
    jest.mocked(signalrSell.doOpen).mockImplementation(jest.fn());
    const mockSignalrSell = jest.fn((params, callback) => {
      const data = { params };
      callback(data); // mock callback behavior
      return {
        remove: jest.fn(), // return mock remove function
      };
    });
    jest.mocked(signalrSell.onAchTxAddressReceived).mockImplementation(mockSignalrSell);
    jest.mocked(signalrSell.requestAchTxAddress).mockImplementation(jest.fn());
    jest.mocked(signalrSell.stop).mockImplementation(jest.fn());
    jest.spyOn(global, 'setTimeout');
    jest.runAllTimers();
    jest.mocked(request.payment.updateAlchemyOrderTxHash).mockResolvedValue({});

    // renderHook
    const { result } = renderHook(() => useSellTransfer());

    const mockPaymentSellTransfer = jest.fn().mockResolvedValue({
      transactionId: 'transactionId',
    });
    await result.current({
      merchantName: ACH_MERCHANT_NAME,
      orderId: '',
      paymentSellTransfer: mockPaymentSellTransfer,
    });

    // expect
    expect(request.payment.updateAlchemyOrderTxHash).toBeCalled();
  });
});
