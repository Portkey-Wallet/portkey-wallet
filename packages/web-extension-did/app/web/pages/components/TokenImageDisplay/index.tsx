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
  const [isError, setError] = useState<boolean>(true);
  const symbolImages = useSymbolImages();

  const tokenSrc = useMemo(() => src || symbolImages[symbol], [src, symbol, symbolImages]);

  const isShowDefault = useMemo(() => isError || !tokenSrc, [isError, tokenSrc]);

  return symbol === ELF_SYMBOL ? (
    <CustomSvg
      style={{ width, height: width }}
      className={clsx('token-logo', 'elf-token-logo', className)}
      type="elf-icon"
    />
  ) : (
    <div className={clsx('token-img-wrapper flex-center', className)} style={{ width, height: width }}>
      <div
        className={clsx('show-name-index', 'flex-center', !isShowDefault && 'hidden')}
        style={{ width, height: width }}>
        {symbol?.slice(0, 1)}
      </div>
      <img
        key={tokenSrc}
        className={clsx('show-image', isShowDefault && 'hidden')}
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
    </div>
  );
}
