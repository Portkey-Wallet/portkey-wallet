import { useCallback, useState } from 'react';
import { Camera } from 'expo-camera';
import { changeCanLock } from 'utils/LockManager';
import navigationService from 'utils/navigationService';
import { checkIsUrl, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { expandQrData } from '@portkey-wallet/utils/qrCode';
import { useDiscoverJumpWithNetWork } from './discover';
import {
  InvalidQRCodeText,
  RouteInfoType,
  handleAelfQrCode,
  handlePortkeyQRCodeData,
  invalidQRCode,
  isWeb3Address,
} from 'utils/qrcode';
import { useNavigation } from '@react-navigation/native';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { isAelfAddress } from '@portkey-wallet/utils/aelf';
import { NetworkType } from '@portkey-wallet/types';
import { parseLinkPortkeyUrl } from 'utils/scheme';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';

export const useQrScanPermission = (): [boolean, () => Promise<boolean>] => {
  const [hasPermission, setHasPermission] = useState<any>(null);

  const requirePermission = useCallback(async () => {
    changeCanLock(false);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const permissionResult: boolean = status === 'granted';
      setHasPermission(permissionResult);
      return permissionResult;
    } catch (error) {
      console.log(error, '====requirePermission');
    } finally {
      changeCanLock(true);
    }
    return false;
  }, []);

  return [hasPermission, requirePermission];
};

export const useQrScanPermissionAndToast = () => {
  const [, requirePermission] = useQrScanPermission();
  const { t } = useLanguage();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Enable Camera Access'),
        message: t('Cannot connect to the camera. Please make sure it is turned on'),
        buttons: [
          {
            title: t('Close'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  return useCallback(async () => {
    const result = await requirePermission();
    if (!result) {
      showDialog();
    }

    return result;
  }, [requirePermission, showDialog]);
};

export const useHandleUrl = () => {
  const jumpToWebview = useDiscoverJumpWithNetWork();

  return useCallback(
    async (data: string) => {
      const str = data.replace(/("|'|\s)/g, '');

      const { id, type } = parseLinkPortkeyUrl(str);
      if (id && type) {
        throw data;
      }

      jumpToWebview({
        item: {
          name: prefixUrlWithProtocol(str),
          url: prefixUrlWithProtocol(str),
        },
      });
      navigationService.goBack();
    },
    [jumpToWebview],
  );
};

export const useHandleAelfAddress = () => {
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation?.getState()?.routes || [];
  const previousRouteInfo = routesArr[routesArr.length - 2];
  return useCallback(
    (data: string) => {
      handleAelfQrCode(data, previousRouteInfo);
    },
    [previousRouteInfo],
  );
};

export const useHandleObjectData = () => {
  const currentNetwork = useCurrentNetwork();
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation?.getState()?.routes || [];
  const previousRouteInfo = routesArr[routesArr.length - 2];
  return useCallback(
    (data: string) => {
      const qrCodeData = expandQrData(JSON.parse(data));
      if (!qrCodeData?.networkType || !qrCodeData?.address || !qrCodeData?.type) {
        throw data;
      }

      if (qrCodeData.networkType.includes('MAIN')) {
        qrCodeData.networkType = 'MAINNET' as NetworkType;
      }

      // check network
      if (currentNetwork !== qrCodeData.networkType) {
        return invalidQRCode(
          currentNetwork === 'MAINNET' ? InvalidQRCodeText.SWITCH_TO_TESTNET : InvalidQRCodeText.SWITCH_TO_MAINNET,
        );
      }
      handlePortkeyQRCodeData(qrCodeData, previousRouteInfo);
    },
    [currentNetwork, previousRouteInfo],
  );
};

export const useHandleDataFromQrCode = () => {
  const handleAelfAddress = useHandleAelfAddress();
  const handleUrl = useHandleUrl();
  const handleObjectData = useHandleObjectData();

  return useCallback(
    async (data: string) => {
      const dataString = data.replace(/("|'|\s)*/g, '');

      if (checkIsUrl(dataString)) {
        await handleUrl(dataString);
      } else if (isAelfAddress(dataString) && !dataString.includes(',')) {
        handleAelfAddress(dataString);
      } else if ((await isWeb3Address(dataString)) && !dataString.includes(',')) {
        handleAelfAddress(dataString);
      } else {
        handleObjectData(data);
      }
    },
    [handleAelfAddress, handleObjectData, handleUrl],
  );
};
