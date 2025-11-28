import { AssetsState } from '../../../test/data/assetsState';
import { renderHookWithProvider } from '../../../test/utils/render';
import { setupStore } from '../../../test/utils/setup';
import { useAssets } from './assets';

describe('useAssets', () => {
  test('get assets data successfully', () => {
    const { result } = renderHookWithProvider(useAssets, setupStore(AssetsState));

    expect(result.current).toHaveProperty('accountAssets');
    expect(result.current).toHaveProperty('accountBalance');
    expect(result.current).toHaveProperty('accountNFT');
    expect(result.current).toHaveProperty('accountToken');
    expect(result.current).toHaveProperty('tokenPrices');
  });
  test('failed to get assets data', () => {
    const { result } = renderHookWithProvider(useAssets, setupStore({}));

    expect(result.current).toBeUndefined();
  });
});
