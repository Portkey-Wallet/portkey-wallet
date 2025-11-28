import { MAIN_CHAIN, SIDE_CHAIN, TEST_NET } from '@portkey-wallet/constants/constants-ca/activity';
import { getCurrentActivityMapKey, transNetworkText } from './activity';

describe('transNetworkText', () => {
  test('MainChain and Testnet', () => {
    const res = transNetworkText('AELF', true);
    expect(res).toBe(MAIN_CHAIN + ' AELF ' + TEST_NET);
  });
  test('MainChain and Mainnet', () => {
    const res = transNetworkText('AELF', false);
    expect(res).toBe(MAIN_CHAIN + ' AELF');
  });
  test('dAppChain and Testnet', () => {
    const res = transNetworkText('tDVV', true);
    expect(res).toBe(SIDE_CHAIN + ' tDVV ' + TEST_NET);
  });
  test('dAppChain and Mainnet', () => {
    const res = transNetworkText('tDVV', false);
    expect(res).toBe(SIDE_CHAIN + ' tDVV');
  });
});

describe('getCurrentActivityMapKey', () => {
  test('MainChain and ELF', () => {
    const res = getCurrentActivityMapKey('AELF', 'ELF');
    expect(res).toBe('AELF_ELF');
  });
  test('MainChain and empty symbol', () => {
    const res = getCurrentActivityMapKey('AELF', '');
    expect(res).toBe('AELF_');
  });
  test('dAppChain and ELF', () => {
    const res = getCurrentActivityMapKey('tDVV', 'ELF');
    expect(res).toBe('tDVV_ELF');
  });
  test('dAppChain and empty symbol', () => {
    const res = getCurrentActivityMapKey('tDVV', '');
    expect(res).toBe('tDVV_');
  });
  test('empty chainId and empty symbol', () => {
    const res = getCurrentActivityMapKey('', '');
    expect(res).toBe('TOTAL');
  });
});
