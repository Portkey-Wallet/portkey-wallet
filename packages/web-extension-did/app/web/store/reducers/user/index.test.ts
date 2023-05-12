import { setGlobalLoading, setPasswordSeed, userSlice } from './slice';

const reducer = userSlice.reducer;
const mockState = {
  passwordSeed: '',
  loadingInfo: {
    isLoading: false,
    loadingText: 'Loading...',
  },
};

describe('setPasswordSeed', () => {
  test('Prev passwordSeed is empty, set passwordSeed to 111111', () => {
    const res = reducer(mockState, setPasswordSeed('111111'));
    expect(res.passwordSeed).toBe('111111');
  });
});

describe('setGlobalLoading', () => {
  test('Prev isLoading is false, set isLoading true, update loadingText', () => {
    const mockPayload = {
      isLoading: true,
      loadingText: 'Loading chain...',
    };
    const res = reducer(mockState, setGlobalLoading(mockPayload));
    expect(res.loadingInfo.loadingText).toBe('Loading chain...');
  });
});
