import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import './index.less';

interface ImgLoadingProps {
  src?: string;
  loadEle?: ReactNode;
  errorEle?: ReactNode;
  className?: string;
  key?: string;
  notReady?: boolean;
  defaultHeight?: number | string;
}

export default function ImgLoading({
  src,
  className,
  loadEle,
  errorEle,
  notReady = false,
  defaultHeight = 'auto',
}: ImgLoadingProps) {
  const [isLoad, setLoad] = useState<boolean>();
  const [isError, setError] = useState<boolean>();

  return (
    <div className={clsx('img-loading-wrapper', className)} style={{ height: !isLoad ? defaultHeight : 'auto' }}>
      {!notReady && src && (
        <img
          key={src}
          className="show-image"
          src={src}
          onLoad={(e) => {
            setLoad(true);
            setError(false);
            if (!(e.target as any).src.includes('brokenImg')) {
              (e.target as HTMLElement).className = 'show-image';
            }
          }}
          onError={() => {
            setError(true);
            setLoad(false);
          }}
        />
      )}

      {(!isLoad || notReady) && (
        <div className="flex-center loading-image-default-wrapper">
          {loadEle ? loadEle : <>{/* default loading */}</>}
        </div>
      )}

      {isError && (
        <div className="flex-center loading-image-default-wrapper">
          {errorEle ? errorEle : <>{/* default error element */}</>}
        </div>
      )}
    </div>
  );
}
