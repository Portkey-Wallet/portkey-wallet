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

export function invalidQRCode() {
  CommonToast.fail('Invalid QR code, please re-confirm');
  navigationService.goBack();
}

export function handleQRCodeData(data: QRData, previousRouteInfo: RouteInfoType, setRefresh: (v: boolean) => void) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType)) return invalidQRCode();

  if (type !== 'login') {
    // send event

    const newData: SendTokenQRDataType = { ...data } as SendTokenQRDataType;

    if (
      previousRouteInfo.name === 'SendHome' &&
      previousRouteInfo.params.assetInfo.symbol !== newData.assetInfo.symbol
    ) {
      return invalidQRCode();
    }
    if (previousRouteInfo.name !== 'Tab') {
      const previousAssetsInfo = { ...previousRouteInfo.params.assetInfo };
      navigationService.navigate('SendHome', {
        ...newData,
        assetInfo: { ...newData.assetInfo, ...previousAssetsInfo },
      });
    } else {
      navigationService.navigate('SendHome', newData);
    }
  } else {
    navigationService.navigate('ScanLogin', { data: data as LoginQRData });
  }
  setRefresh(true);
}
