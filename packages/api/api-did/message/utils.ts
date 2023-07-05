import { request } from '../index';
type sendScanLoginSuccessParams = {
  targetClientId: string;
};

export async function sendScanLoginSuccess({ targetClientId }: sendScanLoginSuccessParams) {
  return request.message.sendScanLoginSuccess({ params: { targetClientId } });
}

export const checkQRCodeExist = (id: string): Promise<boolean> => {
  return request.message.checkQRCodeExist({ params: { id } });
};
