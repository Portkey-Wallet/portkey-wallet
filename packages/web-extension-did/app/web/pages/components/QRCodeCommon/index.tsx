import { QRCode } from 'react-qrcode-logo';

export default function QRCodeCommon({ value }: { value: string }) {
  return (
    <QRCode
      value={value}
      size={200}
      quietZone={0}
      logoImage={'assets/svgIcon/PortkeyQR.svg'}
      logoWidth={40}
      logoHeight={40}
      qrStyle={'squares'}
      eyeRadius={{ outer: 7, inner: 4 }}
      ecLevel={'L'}
    />
  );
}
