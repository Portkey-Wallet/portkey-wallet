import { LoginQRData, QRData, SendTokenQRDataType } from '@portkey-wallet/types/types-ca/qrcode';
import { isAddress } from '@portkey-wallet/utils';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import AssetsOverlay from '@portkey-wallet/rn-components/components/AssetsOverlay';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';

export interface RouteInfoType {
  name: 'SendHome' | 'Tab';
  params: IToSendHomeParamsType;
}

export enum InvalidQRCodeText {
  SWITCH_TO_MAINNET = 'Please switch to aelf Mainnet before scanning the QR code',
  SWITCH_TO_TESTNET = 'Please switch to aelf Testnet before scanning the QR code',
}

export function invalidQRCode(text: InvalidQRCodeText, isBack?: boolean) {
  CommonToast.fail(text);
  console.log('wfs goBack 6');
  isBack && navigationService.goBack();
}

export function handlePortkeyQRCodeData(data: QRData, previousRouteInfo: RouteInfoType) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType) || !type) throw data;

  if (type === 'login') return navigationService.navigate('ScanLogin', { data: data as LoginQRData });

  // send event
  const newData: SendTokenQRDataType = { ...data } as SendTokenQRDataType;
  if (previousRouteInfo.name === 'SendHome') {
    if (previousRouteInfo.params.assetInfo.symbol !== newData.assetInfo.symbol) {
      // different symbol
      CommonToast.fail(
        'The selected token for the transfer is incorrect. Please make sure you select the token that matches the recipient address.',
      );
    } else {
      const previousAssetsInfo = { ...previousRouteInfo.params.assetInfo };
      const params: IToSendHomeParamsType = {
        ...newData,
        assetInfo: { ...newData.assetInfo, ...previousAssetsInfo },
      };
      navigationService.navigate('SendHome', params);
    }
  } else {
    navigationService.navigate('SendHome', newData);
  }
}

export function handleAelfQrCode(data: string, previousRouteInfo: RouteInfoType) {
  if (previousRouteInfo.name === 'SendHome') {
    const params: IToSendHomeParamsType = {
      ...previousRouteInfo.params,
      toInfo: {
        address: data,
        name: '',
        chainId: MAIN_CHAIN_ID,
      },
    };
    navigationService.navigate('SendHome', params);
  } else {
    console.log('wfs goBack 7');
    navigationService.goBack();
    AssetsOverlay.showAssetList({ toAddress: data });
  }
}
