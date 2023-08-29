import * as networkHook from '@portkey-wallet/hooks/hooks-ca/network'; //{ useCurrentNetworkInfo, useNetworkList }
import * as cmsStore from '@portkey-wallet/store/store-ca/cms/actions'; //{ getDiscoverGroupAsync, getSocialMediaAsync }
import { useCMS, useSocialMediaList, useDiscoverGroupList, useBuyButton, useBuyButtonShow } from './cms';
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

describe('useBuyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return buy button info when isInit is false', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(useBuyButton, setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.buyButtonNetMap?.TESTNET);
  });

  it('should return buy button info when isInit is true', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(() => useBuyButton(true), setupStore(CmsState));

    expect(result.current).toEqual(CmsState.cms.buyButtonNetMap?.TESTNET);
  });

  it('should return undefined when cms.buyButtonNetMap state is empty', () => {
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);
    jest.spyOn(networkHook, 'useNetworkList').mockReturnValue([TestnetNetworkInfo, MainnetNetworkInfo]);

    const { result } = renderHookWithProvider(() => useBuyButton(true), setupStore({ cms: { buyButtonNetMap: {} } }));

    expect(result.current).toBeUndefined();
  });
});

describe('useBuyButtonShow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return buy button info when testnet', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(false);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore(CmsState));

    expect(result.current).toHaveProperty('isBuyButtonShow', false);
    expect(result.current).toHaveProperty('isBuySectionShow', false);
    expect(result.current).toHaveProperty('isSellSectionShow', false);
    expect(result.current).toHaveProperty('refreshBuyButton');

    const res = await result.current?.refreshBuyButton();

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(() => {
      return {
        payload: {
          buyButtonNetMap: CmsState.cms.buyButtonNetMap,
        },
      } as any;
    });

    expect(res).toHaveProperty('isBuySectionShow', false);
    expect(res).toHaveProperty('isSellSectionShow', false);
  });

  it('should return buy button info when opened buy on mainnet', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(MainnetNetworkInfo);

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore(CmsState));

    expect(result.current).toHaveProperty('isBuyButtonShow', true);
    expect(result.current).toHaveProperty('isBuySectionShow', true);
    expect(result.current).toHaveProperty('isSellSectionShow', true);
    expect(result.current).toHaveProperty('refreshBuyButton');

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(() => {
      return {
        payload: {
          buyButtonNetMap: CmsState.cms.buyButtonNetMap,
        },
      } as any;
    });

    const res = await result.current?.refreshBuyButton();

    expect(res).toHaveProperty('isBuySectionShow', true);
    expect(res).toHaveProperty('isSellSectionShow', true);
  });

  it('should return error buy button info when closed buy on mainnet ', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(MainnetNetworkInfo);

    const buyButtonNetMap = {
      MAIN: {
        isBuySectionShow: false,
        isSellSectionShow: false,
      },
      TESTNET: {
        isBuySectionShow: false,
        isSellSectionShow: false,
      },
    };

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore({ cms: { buyButtonNetMap } }));

    expect(result.current).toHaveProperty('isBuyButtonShow', false);
    expect(result.current).toHaveProperty('isBuySectionShow', false);
    expect(result.current).toHaveProperty('isSellSectionShow', false);
    expect(result.current).toHaveProperty('refreshBuyButton');

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(dispatchMock);

    const res = await result.current?.refreshBuyButton();

    expect(res).toHaveProperty('isBuySectionShow', false);
    expect(res).toHaveProperty('isSellSectionShow', false);
  });
});

describe('useRememberMeBlackList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return buy button info when testnet', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(false);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(TestnetNetworkInfo);

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore(CmsState));

    expect(result.current).toHaveProperty('isBuyButtonShow', false);
    expect(result.current).toHaveProperty('isBuySectionShow', false);
    expect(result.current).toHaveProperty('isSellSectionShow', false);
    expect(result.current).toHaveProperty('refreshBuyButton');

    const res = await result.current?.refreshBuyButton();

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(() => {
      return {
        payload: {
          buyButtonNetMap: CmsState.cms.buyButtonNetMap,
        },
      } as any;
    });

    expect(res).toHaveProperty('isBuySectionShow', false);
    expect(res).toHaveProperty('isSellSectionShow', false);
  });

  it('should return buy button info when opened buy on mainnet', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(MainnetNetworkInfo);

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore(CmsState));

    expect(result.current).toHaveProperty('isBuyButtonShow', true);
    expect(result.current).toHaveProperty('isBuySectionShow', true);
    expect(result.current).toHaveProperty('isSellSectionShow', true);
    expect(result.current).toHaveProperty('refreshBuyButton');

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(() => {
      return {
        payload: {
          buyButtonNetMap: CmsState.cms.buyButtonNetMap,
        },
      } as any;
    });

    const res = await result.current?.refreshBuyButton();

    expect(res).toHaveProperty('isBuySectionShow', true);
    expect(res).toHaveProperty('isSellSectionShow', true);
  });

  it('should return error buy button info when closed buy on mainnet ', async () => {
    jest.spyOn(networkHook, 'useIsMainnet').mockReturnValue(true);
    jest.spyOn(networkHook, 'useCurrentNetworkInfo').mockReturnValue(MainnetNetworkInfo);

    const buyButtonNetMap = {
      MAIN: {
        isBuySectionShow: false,
        isSellSectionShow: false,
      },
      TESTNET: {
        isBuySectionShow: false,
        isSellSectionShow: false,
      },
    };

    const { result } = renderHookWithProvider(useBuyButtonShow, setupStore({ cms: { buyButtonNetMap } }));

    expect(result.current).toHaveProperty('isBuyButtonShow', false);
    expect(result.current).toHaveProperty('isBuySectionShow', false);
    expect(result.current).toHaveProperty('isSellSectionShow', false);
    expect(result.current).toHaveProperty('refreshBuyButton');

    jest.spyOn(cmsStore, 'getBuyButtonAsync').mockReturnValue(dispatchMock);

    const res = await result.current?.refreshBuyButton();

    expect(res).toHaveProperty('isBuySectionShow', false);
    expect(res).toHaveProperty('isSellSectionShow', false);
  });
});
