import { loginSlice } from './slice';
import {
  setLoginAccountAction,
  setWalletInfoAction,
  resetLoginInfoAction,
  setRegisterVerifierAction,
  setCountryCodeAction,
} from './actions';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId } from '@portkey-wallet/types';

const reducer = loginSlice.reducer;
const mockState = {
  countryCode: {
    index: 'H',
    country: { country: 'Hong Kong', code: '852', iso: 'HK' },
  },
};

describe('setLoginAccountAction', () => {
  test('Params is valid, set loginAccount successful', () => {
    const mockPayload = {
      guardianAccount: 'guardianAccount',
      loginType: 0,
    };
    const res = reducer(mockState, setLoginAccountAction(mockPayload));
    expect(res.loginAccount).toHaveProperty('guardianAccount', 'guardianAccount');
    expect(res.loginAccount).toHaveProperty('loginType', 0);
  });

  test('Params is invalid, set loginAccount failed', () => {
    const res = reducer(mockState, setLoginAccountAction(undefined as any));
    expect(res.loginAccount).toBeUndefined();
  });
});

describe('setWalletInfoAction', () => {
  const mockPayload = {
    walletInfo: {},
    caWalletInfo: {
      originChainId: 'AELF' as ChainId,
      managerInfo: {
        managerUniqueId: 'string',
        loginAccount: 'string',
        type: 0 as LoginType,
        verificationType: 0 as VerificationType,
      },
    },
  };
  test('Set scanWalletInfo and scanCaWalletInfo', () => {
    const res = reducer(mockState, setWalletInfoAction(mockPayload));
    expect(res.scanWalletInfo).toEqual({});
    expect(res.scanCaWalletInfo).toEqual({
      originChainId: 'AELF' as ChainId,
      managerInfo: {
        managerUniqueId: 'string',
        loginAccount: 'string',
        type: 0 as LoginType,
        verificationType: 0 as VerificationType,
      },
    });
  });
});

describe('setRegisterVerifierAction', () => {
  test('Params is valid, set registerVerifier successful', () => {
    const mockPayload = {
      verifierId: 'verifierId',
      verificationDoc: 'verificationDoc',
      signature: 'signature',
    };
    const res = reducer(mockState, setRegisterVerifierAction(mockPayload));
    expect(res.registerVerifier).toEqual(mockPayload);
  });
  test('Params is invalid, set registerVerifier failed', () => {
    const res = reducer(mockState, setRegisterVerifierAction(undefined as any));
    expect(res.registerVerifier).toBeUndefined();
  });
});

describe('setCountryCodeAction', () => {
  test('Params is valid, set countryCode successful', () => {
    const mockPayload = {
      index: 'C',
      country: { country: 'China', code: '86', iso: 'ZH' },
    };
    const res = reducer(mockState, setCountryCodeAction(mockPayload));
    expect(res.countryCode).toEqual(mockPayload);
  });
  test('Params is invalid, set countryCode failed', () => {
    const res = reducer(mockState, setCountryCodeAction(undefined as any));
    expect(res.countryCode).toBeUndefined();
  });
});

describe('resetLoginInfoAction', () => {
  test('State only contains countryCode property', () => {
    const mockState = {
      countryCode: {
        index: 'C',
        country: { country: 'China', code: '86', iso: 'ZH' },
      },
    };
    const res = reducer(mockState, resetLoginInfoAction());
    expect(res).toEqual({
      countryCode: {
        index: 'H',
        country: { country: 'Hong Kong', code: '852', iso: 'HK' },
      },
    });
  });
});
