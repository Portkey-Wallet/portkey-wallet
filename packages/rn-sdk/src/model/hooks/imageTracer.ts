import { useEffect, useState } from 'react';
import { Image } from 'react-native';

export const useImageTracer = (imageList: Array<string> = []) => {
  const [targetImageUrl, setTargetImageUrl] = useState<string>(imageList[0]);
  useEffect(() => {
    imageList.forEach(imageUrl => {
      imageRacer(imageUrl, ({ status, url }) => {
        if (status) setTargetImageUrl(url);
      });
    });
  }, [imageList]);
  return {
    targetImageUrl,
  };
};

const imageRacer = async (
  imageUrl: string,
  callback: (result: { status: boolean; url: string }) => void | Promise<void>,
) => {
  if (!imageUrl) return;
  try {
    const status = await Image.prefetch(imageUrl);
    callback({ status, url: imageUrl });
  } catch (ignored) {}
};
