import { useCallback, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { changeCanLock } from 'utils/LockManager';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from 'utils/navigationService';
import im from '@portkey-wallet/im';
import { GetOtherUserInfoDefaultResult } from '@portkey-wallet/im/types/service';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { checkIsUrl, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { expandQrData } from '@portkey-wallet/utils/qrCode';
import { useDiscoverJumpWithNetWork } from './discover';
import { InvalidQRCodeText, RouteInfoType, handleQRCodeData, invalidQRCode } from 'utils/qrcode';
import { useNavigation } from '@react-navigation/native';
import { checkAddContactUrl, getIDByAddContactUrl } from 'utils/scheme';

export const useQrScanPermission = (): [boolean, () => Promise<boolean>] => {
  const [hasPermission, setHasPermission] = useState<any>(null);

  const requirePermission = useCallback(async () => {
    changeCanLock(false);
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
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

export const useHandlePortkeyUrl = () => {
  const isChatShow = useIsChatShow();
  const { userId } = useWallet();

  return useCallback(
    async (params: { portkeyId: string; showLoading?: boolean; goBack?: boolean }) => {
      const { portkeyId, showLoading = true, goBack = false } = params;

      if (showLoading) Loading.show();
      // TODO: return what
      if (!isChatShow) return CommonToast.fail('Invalid qrCode');
      try {
        // myself
        if (userId === portkeyId) {
          if (goBack) navigationService.goBack();
          return navigationService.navigate('WalletName'); // my did
        }

        // others
        const { data } = await im.service.getUserInfo<GetOtherUserInfoDefaultResult>({
          address: portkeyId,
          fields: ['ADDRESS_WITH_CHAIN'],
        });
        if (data) {
          return navigationService.navigate('ChatContactProfile', { contact: data, relationId: data.relationId });
        } else {
          return CommonToast.fail('no portkey result');
        }
      } catch (error: any) {
        if (error.code === '12001') {
          return CommonToast.fail('no portkey result');
        }
      } finally {
        if (showLoading) Loading.hide();
      }
    },
    [isChatShow, userId],
  );
};

export const useHandleUrl = () => {
  const handlePortkeyUrl = useHandlePortkeyUrl();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  return useCallback(
    async (data: string) => {
      const str = data.replace(/("|'|\s)/g, '');

      console.log('checkAddContactUrl', str, checkAddContactUrl(str));
      if (checkAddContactUrl(str)) {
        const portkeyId = getIDByAddContactUrl(str);
        const result = await handlePortkeyUrl({ portkeyId: portkeyId || '', showLoading: true, goBack: true });
        return result;
      } else {
        jumpToWebview({
          item: {
            name: prefixUrlWithProtocol(str),
            url: prefixUrlWithProtocol(str),
          },
        });
        return navigationService.goBack();
      }
    },
    [handlePortkeyUrl, jumpToWebview],
  );
};

export const useHandleObjectData = () => {
  const { currentNetwork } = useWallet();
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  console.log(previousRouteInfo, '=====previousRouteInfo');

  return useCallback(
    async (data: string) => {
      const qrCodeData = expandQrData(JSON.parse(data));
      // check network
      if (currentNetwork !== qrCodeData.netWorkType)
        return invalidQRCode(
          currentNetwork === 'MAIN' ? InvalidQRCodeText.SWITCH_TO_TESTNET : InvalidQRCodeText.SWITCH_TO_MAINNET,
        );
      handleQRCodeData(qrCodeData, previousRouteInfo);
    },
    [currentNetwork, previousRouteInfo],
  );
};

export const useHandleDataFromQrCode = () => {
  const handleUrl = useHandleUrl();
  const handleObjectData = useHandleObjectData();

  return useCallback(
    async (data: string) => {
      const dataString = data.replace(/("|'|\s)*/g, '');
      if (checkIsUrl(dataString)) {
        await handleUrl(dataString);
      } else {
        handleObjectData(data);
      }
    },
    [handleObjectData, handleUrl],
  );
};
