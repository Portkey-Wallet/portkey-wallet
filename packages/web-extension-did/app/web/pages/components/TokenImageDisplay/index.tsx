import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import './index.less';

interface TokenImageDisplayProps {
  src?: string;
  className?: string;
  key?: string;
  width?: number;
  symbol?: string;
  hasBorder?: boolean;
}

export default function TokenImageDisplay({
  src,
  symbol = 'ELF',
  width = 32,
  hasBorder = false,
  className,
}: TokenImageDisplayProps) {
  const [isError, setError] = useState<boolean>(true);
  const symbolImages = useSymbolImages();

  const tokenSrc = useMemo(() => src || symbolImages[symbol], [src, symbol, symbolImages]);

  const isShowDefault = useMemo(() => isError || !tokenSrc, [isError, tokenSrc]);

  return (
    <div
      className={clsx('token-img-wrapper flex-center', hasBorder ? 'has-border' : '', className)}
      style={{ width, height: width }}>
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
