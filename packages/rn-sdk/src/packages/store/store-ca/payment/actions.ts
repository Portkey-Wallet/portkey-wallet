import { request } from 'packages/api/api-did';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { FiatType, AchTokenInfoType, GetFiatType } from './type';
import { countryCodeMap } from 'packages/constants/constants-ca/payment';

export const fetchBuyFiatListAsync = createAsyncThunk<FiatType[]>('payment/fetchBuyFiatListAsync', async () => {
  const rst: { data: GetFiatType[] } = await request.payment.getFiatList({
    params: {
      type: 'BUY',
    },
  });
  const { data } = rst;
  const fiatMap: Record<string, FiatType> = {};
  data.forEach(item => {
    const { currency, country } = item;
    const key = `${currency}-${country}`;
    if (!fiatMap[key]) {
      fiatMap[key] = item;
    }
  });

  return Object.values(fiatMap).map(item => ({
    ...item,
    icon: countryCodeMap[item.country]?.icon,
  }));
});

export const fetchSellFiatListAsync = createAsyncThunk<FiatType[]>('payment/fetchSellFiatListAsync', async () => {
  const rst: { data: FiatType[] } = await request.payment.getFiatList({
    params: {
      type: 'SELL',
    },
  });
  const { data } = rst;
  const fiatMap: Record<string, FiatType> = {};
  data.forEach(item => {
    const { currency, country } = item;
    const key = `${currency}-${country}`;
    if (!fiatMap[key]) {
      fiatMap[key] = item;
    }
  });

  return Object.values(fiatMap).map(item => ({
    ...item,
    icon: countryCodeMap[item.country]?.icon,
  }));
});

export const setAchTokenInfo = createAction<AchTokenInfoType>('payment/setAchTokenInfo');

export const resetPayment = createAction<void>('payment/resetPayment');
