export const getPixel = (url: string) => {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    return [img.width, img.height];
  };
};
