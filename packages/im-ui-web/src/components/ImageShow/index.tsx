import { Image, ImageProps } from 'antd';
import CustomSvg from '../CustomSvg';
import { useState } from 'react';

export interface IImageShowProps extends ImageProps {
  src: string;
  fallback?: string;
}
export default function ImageShow({ src, fallback = '', ...props }: IImageShowProps) {
  const [loadErr, setLoadErr] = useState<boolean>(false);
  return loadErr ? (
    <CustomSvg type="ImgErr" />
  ) : (
    <Image
      {...props}
      src={src}
      alt="pin-img"
      fallback={fallback}
      onError={(error: any) => {
        if (error.target?.currentSrc === fallback) {
          setLoadErr(true);
        }
      }}
    />
  );
}
