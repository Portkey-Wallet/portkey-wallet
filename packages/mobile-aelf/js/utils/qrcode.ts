import { QRData, SendTokenQRDataType } from '@portkey-wallet/types/types-ca/qrcode';
import { getChainIdByAddress, isAddress } from '@portkey-wallet/utils';
import CommonPrompt from 'components/CommonPromptCard';
import navigationService from './navigationService';

import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { request } from '@portkey-wallet/api/api-did';
import Loading from 'components/Loading';
import { ChainId } from '@portkey-wallet/types';

export interface RouteInfoType {
  name: 'SendHome' | 'Tab';
  params: IToSendHomeParamsType;
}

export enum InvalidQRCodeText {
  SWITCH_TO_MAINNET = 'Please switch to aelf Mainnet before scanning the QR code',
  SWITCH_TO_TESTNET = 'Please switch to aelf Testnet before scanning the QR code',
}

export function invalidQRCode(text: InvalidQRCodeText, isBack?: boolean) {
  CommonPrompt.error(text);
  isBack && navigationService.goBack();
}

export function handlePortkeyQRCodeData(data: QRData, previousRouteInfo: RouteInfoType) {
  const { type, address, chainType } = data;
  if (!isAddress(address, chainType) || !type) {
    throw data;
  }

  if (type === 'login') {
    return;
  }

  // send event
  const newData: SendTokenQRDataType = { ...data } as SendTokenQRDataType;
  if (previousRouteInfo.name === 'SendHome') {
    if (previousRouteInfo.params.assetInfo.symbol !== newData.assetInfo.symbol) {
      // different symbol
      CommonPrompt.error(
        'The selected token for the transfer is incorrect. Please make sure you select the token that matches the recipient address.',
      );
    } else {
      const previousAssetsInfo = { ...previousRouteInfo.params.assetInfo };
      const params: IToSendHomeParamsType = {
        ...newData,
        assetInfo: { ...newData.assetInfo, ...previousAssetsInfo },
        toInfo: { ...newData.toInfo, chainId: getChainIdByAddress(newData?.toInfo?.address) as ChainId },
      };
      navigationService.navigate('SendHome', params);
    }
  } else {
    navigationService.navigate('SendHome', {
      ...newData,
      toInfo: { ...newData.toInfo, chainId: getChainIdByAddress(newData?.toInfo?.address) as ChainId },
    });
  }
}

export function handleAelfQrCode(data: string, previousRouteInfo: RouteInfoType) {
  if (previousRouteInfo.name === 'SendHome') {
    const params: IToSendHomeParamsType = {
      ...previousRouteInfo.params,
      toInfo: {
        address: data,
        name: '',
        chainId: getChainIdByAddress(data) as ChainId,
      },
    };
    navigationService.navigate('SendHome', params);
  } else {
    navigationService.goBack();
    navigationService.navigateByMultiLevelParams('SelectAsset', {
      multiLevelParams: {
        toAddress: data,
      },
    });
  }
}

export async function isWeb3Address(str: string) {
  try {
    Loading.show();
    const { data } = await request.sendApi.getSendNetworkList({
      params: {
        symbol: 'ELF',
        chainId: 'AELF',
        toAddress: str,
      },
    });

    const chainListLen = data?.networkList?.length;
    if (chainListLen === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  } finally {
    Loading.hide();
  }
}
