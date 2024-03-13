import {
  getAddressInfo,
  getChainNumber,
  getEntireDIDAelfAddress,
  isAelfAddress,
  isDIDAelfAddress,
  isEqAddress,
  isAllowAelfAddress,
  getAelfAddress,
  getWallet,
  getAelfInstance,
  getELFContract,
  transformArrayToMap,
  encodedTx,
  isCrossChain,
} from './aelf';
import AElf from 'aelf-sdk';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('aelf-sdk');

beforeEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('isEqAddress', () => {
  test('params is empty, and return true', () => {
    const res = isEqAddress();
    expect(res).toBe(true);
  });
  test('have one params, and return false', () => {
    const res = isEqAddress('address');
    expect(res).toBe(false);
  });
  test('have two same params, and return true', () => {
    const res = isEqAddress('address', 'ADDRESS');
    expect(res).toBe(true);
  });
  test('have two different params, and return false', () => {
    const res = isEqAddress('address', 'ADD');
    expect(res).toBe(false);
  });
});

// FIXME regexp
describe('isAelfAddress', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('params is empty, and return false', () => {
    const res = isAelfAddress();
    expect(res).toBe(false);
  });
  test('params without _, and return false', () => {
    const res = isAelfAddress('add_re');
    expect(res).toBe(false);
  });
  test('params without _, and return false2', () => {
    const res = isAelfAddress('add_re_ss');
    expect(res).toBe(false);
  });
  test('params is 2A6...xHzh, mock, and return true', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = isAelfAddress('2A6...xHzh');
    expect(res).toBe(true);
  });
  test('throw error, and return false', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockImplementation(() => {
      throw new Error('error');
    });
    const res = isAelfAddress('2A6...xHzh');
    expect(res).toBe(false);
  });
});

describe('getChainNumber', () => {
  test('get AELF chain number', () => {
    jest.spyOn(AElf.utils.chainIdConvertor, 'base58ToChainId').mockReturnValue(9992731);
    const res = getChainNumber('AELF');
    expect(res).toBe(9992731);
  });
});

// FIXME regexp
describe('isDIDAelfAddress', () => {
  test('input empty, and return false', () => {
    const res = isDIDAelfAddress('');
    expect(res).toBe(false);
  });
  test('input add_r, and return false', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = isDIDAelfAddress('add_r');
    expect(res).toBe(false);
  });
  test('input a_ddr, and throw error, return true', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = isDIDAelfAddress('a_ddr');
    expect(res).toBe(true);
  });
  test('input a_ddr, and return true', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockImplementation(() => {
      throw new Error('error');
    });
    const res = isDIDAelfAddress('a_ddr');
    expect(res).toBe(false);
  });
  test('input address without underline, and return false', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = isDIDAelfAddress('address');
    expect(res).toBe(false);
  });
  test('input address without underline, throw error, and return false', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockImplementation(() => {
      throw new Error('error');
    });
    const res = isDIDAelfAddress('address');
    expect(res).toBe(false);
  });
});

describe('getAddressInfo', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const prefix = 'AELF',
    address = 'av9c...8csu',
    suffix = 'ELF';
  test('the address is divided into four segments, and return empty string', () => {
    const res = getAddressInfo(prefix + '_' + address + '_' + suffix + '_' + suffix);
    expect(res.prefix).toBe('');
    expect(res.address).toBe('');
    expect(res.suffix).toBe('');
  });
  test('only have address, and return successfully', () => {
    const res = getAddressInfo(address);
    expect(res.prefix).toBe('');
    expect(res.address).toBe(address);
    expect(res.suffix).toBe('');
  });
  test('have address with prefix and suffix, and return successfully', () => {
    const res = getAddressInfo(prefix + '_' + address + '_' + suffix);
    expect(res.prefix).toBe(prefix);
    expect(res.address).toBe(address);
    expect(res.suffix).toBe(suffix);
  });
  test('have address only with prefix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = getAddressInfo(prefix + '_' + address);
    expect(res.prefix).toBe(prefix);
    expect(res.address).toBe(address);
    expect(res.suffix).toBe('');
  });
  test('have address with only suffix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = getAddressInfo(address + '_' + suffix);
    expect(res.prefix).toBe('');
    expect(res.address).toBe(address);
    expect(res.suffix).toBe(suffix);
  });
});

describe('getEntireDIDAelfAddress', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const defaultPrefix = 'ELF',
    value = 'av9c...8csu',
    defaultSuffix = 'AELF';
  test('have three complete params, and return successfully', () => {
    const res = getEntireDIDAelfAddress(value, defaultPrefix, defaultSuffix);
    expect(res).toBe(defaultPrefix + '_' + value + '_' + defaultSuffix);
  });
  test('have a complete value param, and return successfully', () => {
    const res = getEntireDIDAelfAddress(defaultPrefix + '_' + value + '_' + defaultSuffix);
    expect(res).toBe(defaultPrefix + '_' + value + '_' + defaultSuffix);
  });
  test('have a error value param, and return empty', () => {
    const res = getEntireDIDAelfAddress(defaultPrefix + '_' + value + '_' + defaultSuffix + '_' + defaultSuffix);
    expect(res).toBe('');
  });
  test('have a empty value param, and return error', () => {
    const res = getEntireDIDAelfAddress('');
    expect(res).toBe(defaultPrefix + '__' + defaultSuffix);
  });
  test('have value only with prefix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = getEntireDIDAelfAddress(defaultPrefix + '_' + value);
    expect(res).toBe(defaultPrefix + '_' + value + '_' + defaultSuffix);
  });
  test('have value with only suffix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = getEntireDIDAelfAddress(value + '_' + defaultSuffix);
    expect(res).toBe(defaultPrefix + '_' + value + '_' + defaultSuffix);
  });
});

describe('isAllowAelfAddress', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const defaultPrefix = 'ELF',
    value = 'av9c...8csu',
    defaultSuffix = 'AELF';
  test('have a error value param, and return false', () => {
    const res = isAllowAelfAddress(defaultPrefix + '_' + value + '_' + defaultSuffix + '_' + defaultSuffix);
    expect(res).toBe(false);
  });
  test('have a empty value param, and return false', () => {
    const res = isAllowAelfAddress('');
    expect(res).toBe(false);
  });
  test('have a complete value param, and return true', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = isAllowAelfAddress(defaultPrefix + '_' + value + '_' + defaultSuffix);
    expect(res).toBe(true);
  });
  test('have value only with prefix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = isAllowAelfAddress(defaultPrefix + '_' + value);
    expect(res).toBe(false);
  });
  test('have value with only suffix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = isAllowAelfAddress(value + '_' + defaultSuffix);
    expect(res).toBe(true);
  });
});

describe('getAelfAddress', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const defaultPrefix = 'ELF',
    value = 'av9c...8csu',
    defaultSuffix = 'AELF';
  test('have value with only suffix, and return successfully', () => {
    const res = getAelfAddress();
    expect(res).toBe('');
  });
  test('have a complete value param, and return true', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = getAelfAddress(defaultPrefix + '_' + value + '_' + defaultSuffix);
    expect(res).toBe(value);
  });
  test('have value only with prefix, and return successfully', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = getAelfAddress(defaultPrefix + '_' + value);
    expect(res).toBe(defaultPrefix + '_' + value);
  });
  test('have value with only suffix, and return successfully2', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = getAelfAddress(value + '_' + defaultSuffix);
    expect(res).toBe(value);
  });
});

describe('getWallet', () => {
  beforeEach(() => {
    jest.restoreAllMocks;
  });
  test('mock data, and return successfully', () => {
    const wallet = {
      mnemonic: '',
      BIP44Path: 'm.../0',
      childWallet: '',
      keyPair: {},
      privateKey: 'f6e...6f71',
      address: 'N99...zCY1',
    };
    jest.spyOn(AElf.wallet, 'getWalletByPrivateKey').mockReturnValue(wallet);
    const res = getWallet();
    expect(res).toEqual(wallet);
  });
});

describe('getAelfInstance', () => {
  beforeEach(() => {
    jest.restoreAllMocks;
  });
  test('mock function, and return successfully', () => {
    jest.spyOn(AElf.providers, 'HttpProvider').mockReturnValue(jest.fn());
    const res = getAelfInstance('');
    expect(res).toBeInstanceOf(AElf);
  });
});

describe('getELFContract', () => {
  beforeEach(() => {
    jest.restoreAllMocks;
  });
  const wallet = {
    mnemonic: '',
    BIP44Path: 'm.../0',
    childWallet: '',
    keyPair: {},
    privateKey: 'f6e...6f71',
    address: 'N99...zCY1',
  };
  test('mock function, and return successfully', async () => {
    jest.mocked(AElf).mockReturnValue({ chain: { contractAt: jest.fn(() => 'contract') } } as any);
    jest.spyOn(AElf.providers, 'HttpProvider').mockReturnValue(jest.fn());
    jest.spyOn(AElf.wallet, 'getWalletByPrivateKey').mockReturnValue(wallet);

    const res = await getELFContract('', '', '');

    expect(res).toBe('contract');
  });
  test('mock function, and return successfully2', async () => {
    jest.mocked(AElf).mockReturnValue({ chain: { contractAt: jest.fn(() => 'contract') } } as any);
    jest.spyOn(AElf.providers, 'HttpProvider').mockReturnValue(jest.fn());
    jest.spyOn(AElf.wallet, 'getWalletByPrivateKey').mockReturnValue(wallet);

    const res = await getELFContract('https://localhost', '0x1...7890', 'privateKey');

    expect(res).toBe('contract');
  });
});

describe('transformArrayToMap', () => {
  test('origin is undefined, and return empty string', () => {
    const res = transformArrayToMap({}, undefined as any);
    expect(res).toBe('');
  });
  test('inputType is empty object, origin is string, and return origin', () => {
    const res = transformArrayToMap({}, 'origin' as any);
    expect(res).toBe('origin');
  });
  test('inputType is empty object, origin is empty array, and return empty string', () => {
    const res = transformArrayToMap({}, []);
    expect(res).toBe('');
  });
  test('trigger [ !resolvedType.name ] condition', () => {
    const res = transformArrayToMap({}, ['origin']);
    expect(res).toEqual(['origin']);
  });
  test('trigger [ resolvedType.name !== name ] condition', () => {
    const res = transformArrayToMap({ name: 'address' }, ['origin']);
    expect(res).toEqual(['origin']);
  });
  test('trigger [ !resolvedType.fieldsArray ] condition', () => {
    const res = transformArrayToMap({ name: 'Address' }, ['origin']);
    expect(res).toEqual(['origin']);
  });
  test('trigger [ resolvedType?.fieldsArray[0].type === "bytes" ] condition', () => {
    const res = transformArrayToMap({ name: 'Address', fieldsArray: [{ type: 'bytes' }] }, ['origin']);
    expect(res).toBe('origin');
  });
  test('trigger [ resolvedType.fieldsArray.length !== 1 ] condition', () => {
    const res = transformArrayToMap({ name: 'Address', fieldsArray: [] }, ['origin']);
    expect(res).toEqual(['origin']);
  });
  test('trigger [ fieldsLength === 1 ] condition', () => {
    const res = transformArrayToMap({ name: 'Address', fieldsArray: [{ type: 'byte', name: 'byte' }] }, ['origin']);
    expect(res).toEqual({ byte: 'origin' });
  });
  test('trigger [ fieldsLength === 2 ] condition', () => {
    const res = transformArrayToMap(
      {
        name: 'Address',
        fieldsArray: [
          { type: 'byte', name: 'byte' },
          { type: 'bytes', name: 'bytes' },
        ],
      },
      ['origin'],
    );
    expect(res).toEqual({ '0': 'origin', byte: 'origin', bytes: undefined });
  });
});

describe('encodedTx', () => {
  const instance: any = {
    chain: {
      getChainStatus: () => {
        return { ChainId: 'AELF' };
      },
    },
  };
  test('return resolved value', async () => {
    const contract = {
      functionName: {
        getSignedTx: jest.fn<() => Promise<string>>().mockResolvedValue('raw'),
      },
    };
    const res = await encodedTx({ instance, functionName: 'functionName', paramsOption: 'paramsOption', contract });
    expect(res).toBe('raw');
  });
  test('return rejected value', async () => {
    const contract = {
      functionName: {
        getSignedTx: jest.fn<() => Promise<{ code: number }>>().mockRejectedValue({ code: 500 }),
      },
    };
    const res = await encodedTx({ instance, functionName: 'functionName', paramsOption: 'paramsOption', contract });
    expect(res.error).toEqual({ code: 500 });
  });
});

describe('isCrossChain', () => {
  test('toAddress does not contain underscores, and return false', () => {
    const res = isCrossChain('address', 'AELF');
    expect(res).toBe(false);
  });
  test('toAddress is right, and not cross chain', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(true);
    const res = isCrossChain('ELF_address_AELF', 'AELF');
    expect(res).toBe(false);
  });
  test('toAddress is right, and cross chain', () => {
    jest.spyOn(AElf.utils, 'decodeAddressRep').mockReturnValue(false);
    const res = isCrossChain('ELF_address_tDVV', 'AELF');
    expect(res).toBe(true);
  });
});
