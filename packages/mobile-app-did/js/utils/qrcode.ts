import { LoginQRData, QRData, SendTokenQRDataType } from '@portkey-wallet/types/types-ca/qrcode';
import { isAddress } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import navigationService from './navigationService';

export interface RouteInfoType {
  name: 'SendHome' | 'Tab';
  params: {
    assetInfo: {
      symbol: string;
    };
  };
}

export enum InvalidQRCodeText {
  DIFFERENT_NETWORK = 'Please ensure that you are connected to the same network',
  INVALID_QR_CODE = 'The QR code is invalid',
}

export function invalidQRCode(text: InvalidQRCodeText, isBack?: boolean) {
  CommonToast.fail(text);
  isBack && navigationService.goBack();
}

export function handleQRCodeData(data: QRData, previousRouteInfo: RouteInfoType, setRefresh: (v: boolean) => void) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType)) return invalidQRCode(InvalidQRCodeText.INVALID_QR_CODE);

  if (type === 'login') {
    navigationService.navigate('ScanLogin', { data: data as LoginQRData });
  } else {
    // send event
    const newData: SendTokenQRDataType = { ...data } as SendTokenQRDataType;

    if (previousRouteInfo.name === 'SendHome') {
      if (previousRouteInfo.params.assetInfo.symbol !== newData.assetInfo.symbol) {
        // different symbol
        return invalidQRCode(InvalidQRCodeText.INVALID_QR_CODE, false);
      } else {
        const previousAssetsInfo = { ...previousRouteInfo.params.assetInfo };
        navigationService.navigate('SendHome', {
          ...newData,
          assetInfo: { ...newData.assetInfo, ...previousAssetsInfo },
        });
      }
    } else {
      navigationService.navigate('SendHome', newData);
    }
  }
  setRefresh(true);
}
