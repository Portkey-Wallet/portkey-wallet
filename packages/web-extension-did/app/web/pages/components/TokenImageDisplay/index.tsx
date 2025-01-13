import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import './index.less';
import { CustomSvgV3 } from '../../../components/CustomSvgV3';

interface TokenImageDisplayProps {
  src?: string;
  className?: string;
  key?: string;
  width?: number; // deprecated in the future,
  diameter?: number;
  subDiameter?: number;
  symbol?: string;
  hasBorder?: boolean;
  chain?: 'main' | 'dApp';
  subDisplay?: boolean;
  size?: 'large' | 'medium' | 'small';
}

const defaultDiameter = {
  icon: {
    large: 60,
    medium: 40,
    small: 25,
  },
  subIcon: {
    large: 26,
    medium: 22,
    small: 18,
  },
};

export default function TokenImageDisplay({
  src,
  symbol = 'ELF',
  width,
  diameter,
  subDiameter,
  hasBorder = false,
  className,
  chain = 'main',
  subDisplay = false,
  size = 'medium',
}: TokenImageDisplayProps) {
  const [isError, setError] = useState<boolean>(true);
  const symbolImages = useSymbolImages();

  const tokenSrc = useMemo(() => src || symbolImages[symbol], [src, symbol, symbolImages]);

  const isShowDefault = useMemo(() => isError || !tokenSrc, [isError, tokenSrc]);

  const _diameter = diameter || width || defaultDiameter.icon[size];
  const _subDiameter = subDiameter || defaultDiameter.subIcon[size];

  return (
    <div
      className={clsx('token-img-wrapper flex-center', hasBorder ? 'has-border' : '', className)}
      style={{ width: _diameter, height: _diameter }}>
      <div
        className={clsx('show-name-index', 'flex-center', !isShowDefault && 'hidden')}
        style={{ width: _diameter, height: _diameter }}>
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
        alt={tokenSrc}
      />
      {subDisplay && (
        <div
          className="sub-icon"
          style={{
            width: _subDiameter,
            height: _subDiameter,
          }}>
          {chain === 'main' ? (
            <CustomSvgV3 type="Chain=AELF Main" className="Chain-AELF-Main-icon" />
          ) : (
            <CustomSvgV3 type="Chain=AELF Side" className="Chain-AELF-Side-icon" />
          )}
        </div>
      )}
    </div>
  );
}
