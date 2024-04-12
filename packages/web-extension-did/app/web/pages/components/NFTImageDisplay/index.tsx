import clsx from 'clsx';
import { useMemo, useState } from 'react';
import CustomSvg from 'components/CustomSvg';
import { NFTSizeEnum, getSeedTypeTag } from 'utils/assets';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import './index.less';

interface NFTImageDisplayProps {
  src?: string;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  className?: string;
  width?: number;
  seedTypeTagSize?: NFTSizeEnum;
  alias?: string;
}

export default function NFTImageDisplay({
  src,
  isSeed = false,
  seedType,
  width = 32,
  seedTypeTagSize = NFTSizeEnum.small,
  className,
  alias = '',
}: NFTImageDisplayProps) {
  const [isError, setError] = useState<boolean>(false);
  const isShowDefault = useMemo(() => isError || !src, [isError, src]);
  const seedTypeTag = getSeedTypeTag({ seedType, isSeed }, seedTypeTagSize);
  return (
    <div className={clsx('nft-img-wrapper flex-center', className)} style={{ width, height: width }}>
      {seedTypeTag && <CustomSvg type={seedTypeTag} />}
      {isShowDefault ? (
        alias.slice(0, 1)
      ) : (
        <img
          className="show-image"
          src={src}
          onLoad={(e) => {
            setError(false);
            if (!(e.target as any).src.includes('brokenImg')) {
              (e.target as HTMLElement).className = 'show-image';
            }
          }}
          onError={() => {
            setError(true);
          }}
        />
      )}
    </div>
  );
}
