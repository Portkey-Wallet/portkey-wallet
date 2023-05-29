import { useGetRegisterInfo, useGuardiansInfo } from './guardian';
import { request } from '@portkey-wallet/api/api-did';
import { renderHook } from '@testing-library/react';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';

jest.mock('@portkey-wallet/api/api-did');

describe('useGetRegisterInfo', () => {
  test('complete data, and return successfully', async () => {
    expect.assertions(1);

    jest.mocked(request.wallet.getRegisterInfo).mockResolvedValue([]);

    const { result } = renderHook(() => useGetRegisterInfo());
    const res = await result.current({
      loginGuardianIdentifier: 'aa_bb_cc',
    });

    expect(res).toHaveLength(0);
  });
  test('mock reject, and catch error', async () => {
    expect.assertions(2);

    jest.mocked(request.wallet.getRegisterInfo).mockRejectedValue({ code: 500, message: 'server error' });
    const { result } = renderHook(() => useGetRegisterInfo());

    try {
      await result.current({
        loginGuardianIdentifier: '',
      });
    } catch (e) {
      expect(e).toHaveProperty('code', 500);
      expect(e).toHaveProperty('message', 'server error');
    }
  });
});

describe('useGuardiansInfo', () => {
  test('guardians in store, and return successfully', () => {
    const verifierMapItem = {
      '2ded6...68dbda8': {
        id: '2ded6...68dbda8', //aelf.Hash
        name: 'CryptoGuardian',
        imageUrl: 'https://localhost/img/CryptoGuardian.png',
        endPoints: ['http://localhost'],
        verifierAddresses: ['2bWw...dSb4hJz'],
      },
    };
    const state = {
      guardians: {
        verifierMap: [verifierMapItem],
      },
    };

    const { result } = renderHookWithProvider(useGuardiansInfo, setupStore(state));

    expect(result.current.verifierMap).toHaveLength(1);
  });

  test('no guardians in store, and return undefined', () => {
    const { result } = renderHookWithProvider(useGuardiansInfo, setupStore({}));

    expect(result.current).toBeUndefined();
  });
});
