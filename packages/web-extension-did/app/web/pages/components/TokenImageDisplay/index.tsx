import clsx from 'clsx';
import { useMemo, useState } from 'react';
import './index.less';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import CustomSvg from 'components/CustomSvg';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';

interface TokenImageDisplayProps {
  src?: string;
  className?: string;
  key?: string;
  width?: number;
  symbol?: string;
}

export default function TokenImageDisplay({ src, symbol = 'ELF', width = 32, className }: TokenImageDisplayProps) {
  const [isError, setError] = useState<boolean>(false);
  const symbolImages = useSymbolImages();

  const tokenSrc = useMemo(() => src || symbolImages[symbol], [src, symbol, symbolImages]);

  const isShowDefault = useMemo(() => isError || !tokenSrc, [isError, tokenSrc]);

  return symbol === ELF_SYMBOL ? (
    <CustomSvg className={clsx('token-logo', className)} type="elf-icon" />
  ) : (
    <div className={clsx('token-img-loading-wrapper flex-center', className)} style={{ width, height: width }}>
      {isShowDefault ? (
        <div className="show-name-index flex-center" style={{ width, height: width }}>
          {symbol?.slice(0, 1)}
        </div>
      ) : (
        <img
          key={tokenSrc}
          className="show-image"
          src={tokenSrc}
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
