import { paymentSlice } from './slice';
import { resetPayment, setAchTokenInfo, fetchBuyFiatListAsync, fetchSellFiatListAsync } from './actions';
import { request } from 'packages/api/api-did';
import { configureStore } from '@reduxjs/toolkit';
import { jest, describe, test, expect } from '@jest/globals';
jest.mock('packages/api/api-did');
const reducer = paymentSlice.reducer;
const state = {
  buyFiatList: [],
  sellFiatList: [],
  achTokenInfo: undefined,
};
const fiatList = {
  currency: 'EUR',
  country: 'AD',
  payWayCode: '10001',
  payWayName: 'Credit Card',
  fixedFee: '0.410000',
  rateFee: null,
  payMin: '15.000000',
  payMax: '5153.000000',
};
describe('fetchBuyFiatListAsync', () => {
  test('fetchBuyFiatListAsync will set buyFiatList successful', async () => {
    jest.mocked(request.payment.getFiatList).mockResolvedValue({
      data: [fiatList],
    });
    const store = configureStore({ reducer });
    await store.dispatch(fetchBuyFiatListAsync());
    expect(store.getState().buyFiatList).toHaveLength(1);
  });
  test('fetchBuyFiatListAsync failed', async () => {
    jest.mocked(request.payment.getFiatList).mockRejectedValue({
      error: 'error',
    });
    const store = configureStore({ reducer });
    await store.dispatch(fetchBuyFiatListAsync());
    expect(store.getState().buyFiatList).toHaveLength(0);
  });
});

describe('fetchSellFiatListAsync', () => {
  test('fetchSellFiatListAsync will set sellFiatList successful', async () => {
    jest.mocked(request.payment.getFiatList).mockResolvedValue({
      data: [fiatList],
    });
    const store = configureStore({ reducer });
    await store.dispatch(fetchSellFiatListAsync());
    expect(store.getState().sellFiatList).toHaveLength(1);
  });
  test('fetchSellFiatListAsync failed', async () => {
    jest.mocked(request.payment.getFiatList).mockRejectedValue({
      error: 'error',
    });
    const store = configureStore({ reducer });
    await store.dispatch(fetchSellFiatListAsync());
    expect(store.getState().sellFiatList).toHaveLength(0);
  });
});

describe('setAchTokenInfo', () => {
  const achTokenInfo = {
    token: 'ELF',
    expires: 3077,
  };
  test('achTokenInfo is empty, will add achTokenInfo', async () => {
    const res = reducer(state, setAchTokenInfo(achTokenInfo));
    expect(res.achTokenInfo).toEqual(achTokenInfo);
  });
  test('achTokenInfo is exist, will update achTokenInfo', async () => {
    const prevAchTokenInfo = {
      token: 'ELF',
      expires: 3076,
    };
    const res = reducer({ ...state, achTokenInfo: prevAchTokenInfo }, setAchTokenInfo(achTokenInfo));
    expect(res.achTokenInfo).toEqual(achTokenInfo);
  });
});

describe('resetPayment', () => {
  const achTokenInfo = {
    token: 'ELF',
    expires: 3077,
  };
  test('reset achTokenInfo', async () => {
    const res = reducer({ ...state, achTokenInfo }, resetPayment());
    expect(res.achTokenInfo).toBeUndefined();
  });
});
