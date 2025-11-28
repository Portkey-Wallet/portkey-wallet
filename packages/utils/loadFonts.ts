export default async function loadFonts(fontFamily: string, fontUrl: string, config?: FontFaceDescriptors) {
  console.log(`url(${fontUrl})`, 'loadFonts===url');
  const font = new FontFace(fontFamily, `url(${fontUrl})`, config);
  await font.load();
  await document.fonts.ready;
  (document.fonts as any).add(font);
}
