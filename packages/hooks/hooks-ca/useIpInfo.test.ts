import { renderHook, act } from '@testing-library/react';
import useIpInfo from './useIpInfo';
import { request } from '@portkey-wallet/api/api-did';

jest.mock('@portkey-wallet/api/api-did');

describe('useIpInfo', () => {
  test('complete data, and return successfully', async () => {
    expect.assertions(3);

    jest
      .mocked(request.verify.getCountry)
      .mockResolvedValue({ code: 'HK', country: 'Hong Kong SAR China', iso: '852' });

    const res = await act(async () => renderHook(() => useIpInfo()));

    expect(res.result.current).toHaveProperty('code', 'HK');
    expect(res.result.current).toHaveProperty('country', 'Hong Kong SAR China');
    expect(res.result.current).toHaveProperty('iso', '852');
  });
  test('mock reject, and catch error', async () => {
    jest.mocked(request.verify.getCountry).mockRejectedValue({ code: 500, message: 'server error' });

    try {
      await act(async () => renderHook(() => useIpInfo()));
    } catch (e) {
      expect(e).toHaveProperty('code', 500);
      expect(e).toHaveProperty('message', 'server error');
    }
  });
});
