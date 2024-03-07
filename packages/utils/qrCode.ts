import { ChainId, ChainType, NetworkType } from '@portkey-wallet/types';

const enum IndexOfQrData {
  CHAIN_TYPE_INDEX = 0,
  NETWORK_TYPE_INDEX = 1,
  TYPE_INDEX = 2,
  ADDRESS_INDEX = 3,
  SYMBOL_INDEX = 4,
  TOKEN_CONTRACT_ADDRESS_INDEX = 5,
  CHAIN_ID_INDEX = 6,
  DECIMALS_INDEX = 7,
  DEVICE_TYPE_INDEX = 8,
}

export type QrCodeDataArrType = [
  ChainType,
  NetworkType,
  'login' | 'send',
  string,
  string,
  string,
  ChainId,
  string | number,
  number | undefined,
];

export type QRCodeDataObjType = {
  address: string;
  networkType: NetworkType;
  chainType: ChainType;
  type: 'login' | 'send';
  toInfo: { name: string; address: string };
  deviceType?: number;
  assetInfo: {
    symbol: string;
    tokenContractAddress: string;
    chainId: ChainId;
    decimals: string | number;
  };
};

export const shrinkSendQrData = (data: QRCodeDataObjType): QrCodeDataArrType => {
  // 1.chainType  2.networkType 3.data.type 4.toAddress 5. symbol 6. tokenContractAddress 7. chainId 8. decimals

  if (data.networkType?.includes('MAIN')) {
    data.networkType = 'MAIN' as NetworkType;
  }

  return [
    data.chainType,
    data.networkType,
    data.type,
    data.address,
    data.assetInfo.symbol,
    data.assetInfo.tokenContractAddress,
    data.assetInfo.chainId,
    data.assetInfo.decimals,
    data.deviceType,
  ];
};

export const expandQrData = (data: QrCodeDataArrType | QRCodeDataObjType): QRCodeDataObjType => {
  if (!Array.isArray(data)) return data;

  let dataArr = data;
  return {
    address: dataArr[IndexOfQrData.ADDRESS_INDEX],
    networkType: dataArr[IndexOfQrData.NETWORK_TYPE_INDEX],
    chainType: dataArr[IndexOfQrData.CHAIN_TYPE_INDEX],
    type: dataArr[IndexOfQrData.TYPE_INDEX],
    toInfo: { name: '', address: dataArr[IndexOfQrData.ADDRESS_INDEX] },
    assetInfo: {
      symbol: dataArr[IndexOfQrData.SYMBOL_INDEX],
      tokenContractAddress: dataArr[IndexOfQrData.TOKEN_CONTRACT_ADDRESS_INDEX],
      chainId: dataArr[IndexOfQrData.CHAIN_ID_INDEX],
      decimals: dataArr[IndexOfQrData.DECIMALS_INDEX],
    },
  };
};
