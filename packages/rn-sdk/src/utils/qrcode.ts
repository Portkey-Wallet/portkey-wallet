import { LoginQRData, QRData } from '@portkey-wallet/types/types-ca/qrcode';

export const isLoginQRData = (data: QRData): data is LoginQRData => {
  return data.type === 'login';
};
