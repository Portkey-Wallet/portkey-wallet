import { ChainId } from '../index';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';

export interface ICryptoBoxAssetItemType {
  chainId: ChainId;
  address: string;
  symbol: string;
  imageUrl: string;
  decimals: number | string;
  alias?: string;
  tokenId?: string;
  assetType?: AssetType;
}
