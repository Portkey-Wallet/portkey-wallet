import { useCallback, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { changeCanLock } from '../utils/LockManager';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentUserInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import navigationService from '@portkey-wallet/rn-inject-app';
import im from '@portkey-wallet/im';
import { GetOtherUserInfoDefaultResult } from '@portkey-wallet/im/types/service';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { checkIsUrl, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { expandQrData } from '@portkey-wallet/utils/qrCode';
import { useDiscoverJumpWithNetWork } from './discover';
import {
  InvalidQRCodeText,
  RouteInfoType,
  handleAelfQrCode,
  handlePortkeyQRCodeData,
  invalidQRCode,
} from '@portkey-wallet/rn-base/utils/qrcode';
import { useNavigation } from '@react-navigation/native';
import { parseLinkPortkeyUrl } from '@portkey-wallet/rn-base/utils/scheme';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useJumpToChatGroupDetails } from './chat';
import { ALREADY_JOINED_GROUP_CODE } from '@portkey-wallet/constants/constants-ca/chat';
import { isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { NetworkType } from '@portkey-wallet/types';

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
    if (!result) showDialog();

    return result;
  }, [requirePermission, showDialog]);
};

export const useHandleGroupId = () => {
  const joinGroup = useJoinGroupChannel();
  const jumpToGroup = useJumpToChatGroupDetails();

  return useCallback(
    async (params: { channelId: string; showLoading?: boolean; goBack?: boolean }) => {
      const { channelId, showLoading = true, goBack = false } = params;
      try {
        if (showLoading) Loading.show();
        await joinGroup(channelId);
        if (goBack) navigationService.goBack();
        jumpToGroup({ channelUuid: channelId || '' });
      } catch (error: any) {
        console.log('error', error);
        if (error.code === ALREADY_JOINED_GROUP_CODE) {
          if (goBack) navigationService.goBack();
          return jumpToGroup({ channelUuid: channelId || '' });
        } else {
          CommonToast.fail("This group doesn't exist. Please check the Portkey group ID/QR code before you try again.");
        }
      } finally {
        if (showLoading) Loading.hide();
      }
    },
    [joinGroup, jumpToGroup],
  );
};

export const useHandlePortkeyId = () => {
  const { userId } = useCurrentUserInfo();

  return useCallback(
    async (params: { portkeyId: string; showLoading?: boolean; goBack?: boolean }) => {
      const { portkeyId, showLoading = true, goBack = false } = params;

      if (showLoading) Loading.show();
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
        if (goBack) navigationService.goBack();
        // data standard
        if (data)
          return navigationService.navigate('ChatContactProfile', { contact: data, relationId: data.relationId });

        return CommonToast.fail("This user doesn't exist. Please check the Portkey ID/QR code before you try again.");
      } catch (error) {
        CommonToast.fail("This user doesn't exist. Please check the Portkey ID/QR code before you try again.");
      } finally {
        if (showLoading) Loading.hide();
      }
    },
    [userId],
  );
};

export const useHandleUrl = () => {
  const isChatShow = useIsChatShow();

  const handlePortkeyId = useHandlePortkeyId();
  const handleGroupId = useHandleGroupId();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  return useCallback(
    async (data: string) => {
      const str = data.replace(/("|'|\s)/g, '');

      const { id, type } = parseLinkPortkeyUrl(str);

      if (id && type && !isChatShow) throw data;
      if (type === 'addContact' && id) return handlePortkeyId({ portkeyId: id || '', showLoading: true, goBack: true });
      if (type === 'addGroup' && id) return handleGroupId({ channelId: id, showLoading: true, goBack: true });

      jumpToWebview({
        item: {
          name: prefixUrlWithProtocol(str),
          url: prefixUrlWithProtocol(str),
        },
      });
      navigationService.goBack();
    },
    [handleGroupId, handlePortkeyId, isChatShow, jumpToWebview],
  );
};

export const useHandleAelfAddress = () => {
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  return useCallback(
    (data: string) => {
      handleAelfQrCode(data, previousRouteInfo);
    },
    [previousRouteInfo],
  );
};

export const useHandleObjectData = () => {
  const { currentNetwork } = useWallet();
  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  return useCallback(
    (data: string) => {
      const qrCodeData = expandQrData(JSON.parse(data));
      if (!qrCodeData?.networkType || !qrCodeData?.address || !qrCodeData?.type) throw data;

      if (qrCodeData.networkType.includes('MAIN')) {
        qrCodeData.networkType = 'MAINNET' as NetworkType;
      }

      // check network
      if (currentNetwork !== qrCodeData.networkType)
        return invalidQRCode(
          currentNetwork === 'MAINNET' ? InvalidQRCodeText.SWITCH_TO_TESTNET : InvalidQRCodeText.SWITCH_TO_MAINNET,
        );
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

      if (isDIDAelfAddress(dataString) && !dataString.includes(',')) {
        handleAelfAddress(dataString);
      } else if (checkIsUrl(dataString)) {
        await handleUrl(dataString);
      } else {
        handleObjectData(data);
      }
    },
    [handleAelfAddress, handleObjectData, handleUrl],
  );
};
