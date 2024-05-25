import { QRCode } from 'react-qrcode-logo';
export interface IQRCodeCommonProps {
  value: string;
  size?: number;
  logo?: {
    url: string;
    width: number;
    height: number;
  };
}

export default function QRCodeCommon({ value, size = 200, logo }: IQRCodeCommonProps) {
  return (
    <QRCode
      value={value}
      size={size}
      quietZone={0}
      logoImage={logo?.url || 'assets/images/PortkeyText.png'}
      logoWidth={logo?.width || 40}
      logoHeight={logo?.height || 40}
      qrStyle={'squares'}
      eyeRadius={{ outer: 7, inner: 4 }}
      ecLevel={'L'}
    />
  );
}
