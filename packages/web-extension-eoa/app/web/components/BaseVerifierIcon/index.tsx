import clsx from 'clsx';
import ImgLoading from 'components/ImgLoading';
import { useMemo } from 'react';
import './index.less';

interface BaseVerifierIconProps {
  fallback?: string; // Error
  rootClassName?: string;
  src?: string;
}

export default function BaseVerifierIcon({ fallback, rootClassName, src }: BaseVerifierIconProps) {
  const fallbackEle = useMemo(() => <span className="fallback-wrapper">{fallback}</span>, [fallback]);

  return (
    <ImgLoading
      className={clsx('base-verifier-icon', rootClassName)}
      src={src}
      loadEle={fallbackEle}
      errorEle={fallbackEle}
    />
  );
}
