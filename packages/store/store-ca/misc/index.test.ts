import { miscSlice } from './slice';
import { request } from '@portkey-wallet/api/api-did';
import { configureStore } from '@reduxjs/toolkit';
import { setUpdateVersionInfo } from './actions';

jest.mock('@portkey-wallet/api/api-did');
const reducer = miscSlice.reducer;
describe('setUpdateVersionInfo', () => {
  test('setUpdateVersionInfo will set versionInfo', async () => {
    const returnValue = {
      content: 'content',
      downloadUrl: 'http://download.com',
      isForceUpdate: true,
      targetVersion: 'v1.2.0',
      title: 'title',
    };
    jest.mocked(request.wallet.pullNotify).mockResolvedValueOnce(returnValue);
    const payload = {
      deviceId: 'deviceId',
      deviceType: 1,
      appId: '10001',
      appVersion: 'v1.1.0',
    };
    const store = configureStore({ reducer });
    await store.dispatch(setUpdateVersionInfo(payload));
    expect(store.getState().versionInfo).toEqual(returnValue);
  });
});
