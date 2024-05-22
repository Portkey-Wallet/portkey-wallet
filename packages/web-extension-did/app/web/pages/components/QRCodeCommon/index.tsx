import { QRCode } from 'react-qrcode-logo';

export interface IQRCodeCommonProps {
  value: string;
  logoWidth?: number;
  logoHeight?: number;
  size?: number;
  logoImage?: string;
}

export default function QRCodeCommon({
  value,
  logoWidth = 40,
  logoHeight = 40,
  size = 200,
  logoImage = 'assets/images/PortkeyText.png',
}: IQRCodeCommonProps) {
  return (
    <QRCode
      value={value}
      size={size}
      quietZone={0}
      logoImage={logoImage}
      logoWidth={logoWidth}
      logoHeight={logoHeight}
      qrStyle={'squares'}
      eyeRadius={{ outer: 7, inner: 4 }}
      ecLevel={'L'}
    />
  );
}
