/**
 *
 * @param imgUrl
 * @returns
 */
export const checkIsSvgUrl = (imgUrl: string) => {
  return /.svg$/.test(imgUrl);
};
