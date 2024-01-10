import * as networkHook from '@portkey-wallet/hooks/hooks-ca/network'; //{ useCurrentNetworkInfo, useNetworkList }
import * as cmsStore from '@portkey-wallet/store/store-ca/cms/actions'; //{ getDiscoverGroupAsync, getSocialMediaAsync }
import { useCMS, useSocialMediaList, useDiscoverGroupList } from './cms';
import * as indexHook from '../index';
import { MainnetNetworkInfo, TestnetNetworkInfo } from '../../../test/data/networkState';
import { setupStore } from '../../../test/utils/setup';
import { renderHookWithProvider } from '../../../test/utils/render';
import { CmsState } from '../../../test/data/cmsState';

const dispatchMock = jest.fn();
jest.spyOn(indexHook, 'useAppCommonDispatch').mockReturnValue(dispatchMock);
jest.spyOn(cmsStore, 'getDiscoverGroupAsync').mockReturnValue(dispatchMock);
jest.spyOn(cmsStore, 'getSocialMediaAsync').mockReturnValue(dispatchMock);

describe('useCMS', () => {
  test('get cms data successfully', () => {
    const { result } = renderHookWithProvider(useCMS, setupStore(CmsState));

    expect(result.current).toHaveProperty('socialMediaListNetMap');
    expect(result.current).toHaveProperty('discoverGroupListNetMap');
    expect(result.current).toHaveProperty('tabMenuListNetMap');
  });
  test('failed to get cms data', () => {
    const { result } = renderHookWithProvider(useCMS, setupStore({}));

    expect(result.current).toBeUndefined();
  });
});

describe('useSocialMediaList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return social media list when isInit is false', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(useSocialMediaList, setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.socialMediaListNetMap.TESTNET);
  });

  it('should return social media list when isInit is true', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(() => useSocialMediaList(true), setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.socialMediaListNetMap.TESTNET);
  });

  it('should return [] when cms.socialMediaListNetMap state is empty', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(
      () => useSocialMediaList(true),
      setupStore({ cms: { socialMediaListNetMap: [] } }),
    );

    expect(result.current).toEqual([]);
  });
});

describe('useDiscoverGroupList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return discover group list when isInit is false', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(useDiscoverGroupList, setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.discoverGroupListNetMap.TESTNET);
  });

  it('should return discover group list when isInit is true', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(() => useDiscoverGroupList(true), setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.discoverGroupListNetMap.TESTNET);
  });

  it('should return [] when cms.discoverGroupListNetMap state is empty', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(
      () => useDiscoverGroupList(true),
      setupStore({ cms: { discoverGroupListNetMap: [] } }),
    );

    expect(result.current).toEqual([]);
  });
});
