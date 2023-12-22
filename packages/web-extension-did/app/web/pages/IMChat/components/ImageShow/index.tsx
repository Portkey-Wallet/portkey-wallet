import CustomSvg from 'components/CustomSvg';
import { useState } from 'react';

export interface IImageShowProps {
  src: string;
}
export default function ImageShow({ src }: IImageShowProps) {
  const [loadErr, setLoadErr] = useState<boolean>(false);
  return loadErr ? <CustomSvg type="ImgErr" /> : <img src={src} alt="pin-img" onError={() => setLoadErr(true)} />;
}
