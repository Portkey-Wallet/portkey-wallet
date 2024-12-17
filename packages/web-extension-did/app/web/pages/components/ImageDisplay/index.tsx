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
  hasBorder?: boolean;
  borderRadius?: number | string;
  defaultWidth?: number | string;
  defaultHeight?: number | string;
  name?: string;
}

export default function ImageDisplay({
  src,
  className,
  backupSrc,
  notReady = false,
  hasBorder = false,
  borderRadius,
  defaultWidth = 'auto',
  defaultHeight = 'auto',
  name = 'A',
}: ImageDisplayProps) {
  const [isError, setError] = useState<boolean>();

  const isShowDefault = useMemo(() => isError || notReady || !src, [isError, notReady, src]);

  return (
    <div
      className={clsx('img-loading-wrapper', hasBorder && 'has-border', className)}
      style={{ width: defaultWidth, height: defaultHeight, borderRadius }}>
      {isShowDefault ? (
        backupSrc ? (
          <div className="flex-center">
            <CustomSvg type={backupSrc} />
          </div>
        ) : (
          <div className="image-backup flex-center">{name?.[0]}</div>
        )
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
