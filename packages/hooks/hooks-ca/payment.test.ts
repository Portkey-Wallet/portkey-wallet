import { usePayment, useGetAchTokenInfo } from './payment';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { PaymentState } from '../../../test/data/paymentState';
import { GuardianState } from '../../../test/data/guardianState';
import { getAchToken } from '@portkey-wallet/api/api-did/payment/util';
import { useAppCommonDispatch } from '../index';

jest.mock('@portkey-wallet/api/api-did/payment/util');
jest.mock('../index');
jest.mocked(useAppCommonDispatch).mockReturnValue(async (call: () => void) => {
  return call;
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
