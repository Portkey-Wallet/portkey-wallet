import { QRCode } from 'react-qrcode-logo';

export default function QRCodeCommon({
  value,
  logo,
}: {
  value: string;
  logo?: {
    url: string;
    width: number;
    height: number;
  };
}) {
  return (
    <QRCode
      value={value}
      size={200}
      quietZone={0}
      logoImage={logo?.url || 'assets/svgIcon/PortkeyQR.svg'}
      logoWidth={logo?.width || 40}
      logoHeight={logo?.height || 40}
      qrStyle={'squares'}
      eyeRadius={{ outer: 7, inner: 4 }}
      ecLevel={'L'}
    />
  );
}
