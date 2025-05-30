import { INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import { NftInfo } from '@portkey-wallet/types/types-ca/activity';
import { NFTItemBaseType, SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { SvgType } from 'components/CustomSvg';
import { ISendPreviewProps } from 'pages/Send/components/SendPreview';
import { TNFTLocationState } from 'types/router';

export enum NFTSizeEnum {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export type TSeedTypeTag = {
  isSeed: boolean;
  seedType?: SeedTypeEnum;
};

export const getSeedTypeTag = (
  nft: NFTItemBaseType | TNFTLocationState | NftInfo | BaseToken | ISendPreviewProps | INftInfoType | TSeedTypeTag,
  size = NFTSizeEnum.medium,
): SvgType | '' => {
  if (nft.isSeed) {
    if (nft.seedType === SeedTypeEnum.Token) {
      switch (size) {
        case NFTSizeEnum.large:
          return 'TokenTagLarge';
        case NFTSizeEnum.small:
          return 'TokenTagSmall';
        default:
          return 'TokenTagMedium';
      }
    }
    if (nft.seedType === SeedTypeEnum.NFT) {
      switch (size) {
        case NFTSizeEnum.large:
          return 'NFTTagLarge';
        case NFTSizeEnum.small:
          return 'NFTTagSmall';
        default:
          return 'NFTTagMedium';
      }
    }
    return '';
  }
  return '';
};
