import { Image } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useState } from 'react';

export interface IImageShowProps {
  src: string;
  fallback?: string;
}
export default function ImageShow({ src, fallback = '' }: IImageShowProps) {
  const [loadErr, setLoadErr] = useState<boolean>(false);
  return loadErr ? (
    <CustomSvg type="ImgErr" />
  ) : (
    <Image
      src={src}
      fallback={fallback}
      alt="pin-img"
      onError={(error: any) => {
        if (error.target?.currentSrc === fallback) {
          setLoadErr(true);
        }
      }}
    />
  );
}
