import ModalSlice, { setAccountConnectModal, setCountryModal } from './slice';

const reducer = ModalSlice.reducer;
const mockState = {
  countryCodeModal: false,
  accountConnectModal: false,
};

describe('setAccountConnectModal', () => {
  test('Prev accountConnectModal is false, set accountConnectModal to true', () => {
    const res = reducer(mockState, setAccountConnectModal(true));
    expect(res.accountConnectModal).toBeTruthy();
  });
  test('Prev accountConnectModal is false, set accountConnectModal to false', () => {
    const res = reducer(mockState, setAccountConnectModal(false));
    expect(res.accountConnectModal).toBeFalsy();
  });
});

describe('setCountryModal', () => {
  test('Prev countryCodeModal is false, set countryCodeModal to true', () => {
    const res = reducer(mockState, setCountryModal(true));
    expect(res.countryCodeModal).toBeTruthy();
  });
  test('Prev countryCodeModal is false, set countryCodeModal to false', () => {
    const res = reducer(mockState, setCountryModal(false));
    expect(res.countryCodeModal).toBeFalsy();
  });
});
