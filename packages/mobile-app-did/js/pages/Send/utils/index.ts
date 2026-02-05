import { request } from '@portkey-wallet/api/api-did';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainId } from '@portkey-wallet/types';
import { INetworkItem } from '../components/SelectNetwork';
import { TransferType } from '@portkey-wallet/types/types-ca/routeParams';
import { eBridgeWaringShow } from '../components/WarningActionSheet';
import ActionSheet from 'components/ActionSheet';
import { Linking } from 'react-native';

// FairyVault URLs
const FAIRYVAULT_DOWNLOAD_URL = 'https://fairyvault.com/download';
const FAIRYVAULT_TUTORIAL_URL = 'https://fairyvault.gitbook.io/fairyvault-docs';

/**
 * Show FairyVault guide modal for cross-chain transfers.
 * ETransfer and eBridge cross-chain services are no longer supported in Portkey DID wallet.
 * Users should use FairyVault (EOA wallet) for cross-chain transfers instead.
 */
export const showFairyVaultGuideModal = () => {
  ActionSheet.alert({
    title: 'Service Update',
    messageList: [
      'Cross-Chain Transfer Service Update',
      '1. Download FairyVault and create a new wallet',
      '2. Transfer your assets to your FairyVault address',
      '3. Complete the cross-chain transfer in FairyVault',
      'FairyVault offers broader network support and enhanced security for cross-chain transfers.',
    ],
    buttonGroupDirection: 'column',
    buttons: [
      {
        title: 'Download FairyVault',
        type: 'primary',
        onPress: () => {
          Linking.openURL(FAIRYVAULT_DOWNLOAD_URL);
        },
      },
      {
        title: 'View Tutorial',
        type: 'outline',
        onPress: () => {
          Linking.openURL(FAIRYVAULT_TUTORIAL_URL);
        },
      },
      {
        title: 'Cancel',
        type: 'outline',
      },
    ],
  });
};

export interface IGetSendNetworkListParams {
  symbol: string;
  chainId: ChainId;
  toAddress: string;
}

export function getSendNetworkList(params: IGetSendNetworkListParams) {
  return request.sendApi.getSendNetworkList({
    params,
  });
}

export function getSmallerValue(v1: string, v2: string) {
  if (!v1 || !v2) {
    throw 'invalid value';
  }
  return ZERO.plus(v1).isGreaterThan(v2) ? v2 : v1;
}

export function getLimitTips(symbol: string, from: string | number, to: string | number) {
  return `Transfer limit: ${from} to ${to} ${symbol}`;
}

export const getEstimatedTime = (targetNetwork: INetworkItem, transferType: TransferType) => {
  const transferItem = targetNetwork?.serviceList?.find(ele =>
    ele?.serviceName?.toLocaleLowerCase()?.includes('transfer'),
  );
  const bridgeItem = targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('bridge'));

  if (transferType === TransferType.E_TRANSFER) {
    return transferItem?.multiConfirmTime;
  }
  if (transferType === TransferType.E_BRIDGE) {
    return bridgeItem?.multiConfirmTime;
  }
  return '';
};

export const eBridgeActionSheet = () => {
  return new Promise((resolve, reject) => {
    eBridgeWaringShow({
      confirm: () => {
        resolve(true);
      },
      cancel: () => {
        reject(false);
      },
    });
  });
};

export const isValidAmount = (input: string) => {
  if (input === '0' || !input) {
    return false;
  }
  if (ZERO.plus(input).isEqualTo(0)) {
    return false;
  }

  const regex = /^(0|([1-9]\d*|0\d+))(\.\d+)?$/;

  return regex.test(input);
};
