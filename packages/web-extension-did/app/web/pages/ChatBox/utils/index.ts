export const getPixel = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    } catch (e) {
      resolve({ width: 0, height: 0 });
    }
  });
};
