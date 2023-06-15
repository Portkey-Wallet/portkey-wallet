import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { useMemo, useState } from 'react';
import { IconType } from 'types/icon';
import './index.less';

interface ImageDisplayProps {
  src?: string;
  className?: string;
  backupSrc?: IconType;
  key?: string;
  notReady?: boolean;
  defaultHeight?: number | string;
}

export default function ImageDisplay({
  src,
  className,
  backupSrc,
  notReady = false,
  defaultHeight = 'auto',
}: ImageDisplayProps) {
  const [isError, setError] = useState<boolean>();

  const isShowDefault = useMemo(() => isError || notReady || !src, [isError, notReady, src]);

  return (
    <div className={clsx('img-loading-wrapper', className)} style={{ height: defaultHeight || 'auto' }}>
      {isShowDefault ? (
        <div className="flex-center">{backupSrc ? <CustomSvg type={backupSrc} /> : <>{/* default loading */}</>}</div>
      ) : (
        <img
          key={src}
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
