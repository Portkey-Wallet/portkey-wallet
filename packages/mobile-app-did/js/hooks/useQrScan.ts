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
import { parseLinkPortkeyUrl } from 'utils/scheme';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useJoinGroupChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useJumpToChatGroupDetails } from './chat';

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
  const isChatShow = useIsChatShow();
  const joinGroup = useJoinGroupChannel();
  const jumpToGroup = useJumpToChatGroupDetails();

  return useCallback(
    async (params: { channelId: string; showLoading?: boolean }) => {
      const { channelId, showLoading = false } = params;
      if (!isChatShow) return CommonToast.fail(InvalidQRCodeText.INVALID_QR_CODE);
      try {
        if (showLoading) Loading.show();
        await joinGroup(channelId);
        jumpToGroup({ channelUuid: channelId || '' });
      } catch (error) {
        // TODO: has entered / network error / no this group
        console.log('error', error);
        CommonToast.fail("This group doesn't exist. Please check the Portkey group ID/QR code before you try again.");
      } finally {
        if (showLoading) Loading.hide();
      }
    },
    [isChatShow, joinGroup, jumpToGroup],
  );
};

export const useHandlePortkeyId = () => {
  const isChatShow = useIsChatShow();
  const { userId } = useWallet();

  return useCallback(
    async (params: { portkeyId: string; showLoading?: boolean; goBack?: boolean }) => {
      const { portkeyId, showLoading = true, goBack = false } = params;

      if (showLoading) Loading.show();
      if (!isChatShow) return CommonToast.fail(InvalidQRCodeText.INVALID_QR_CODE);
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
    [isChatShow, userId],
  );
};

export const useHandleUrl = () => {
  const handlePortkeyId = useHandlePortkeyId();
  const handleGroupId = useHandleGroupId();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  return useCallback(
    async (data: string) => {
      const str = data.replace(/("|'|\s)/g, '');

      const { id, type } = parseLinkPortkeyUrl(
        'https://portkey-website-dev.vercel.app/sc/ag/72597ddca4674fd1a098f414a56a1153',
      );

      if (type === 'addContact' && id) return handlePortkeyId({ portkeyId: id || '', showLoading: true, goBack: true });
      if (type === 'addGroup') return handleGroupId({ channelId: id, showLoading: true });

      jumpToWebview({
        item: {
          name: prefixUrlWithProtocol(str),
          url: prefixUrlWithProtocol(str),
        },
      });
      return navigationService.goBack();
    },
    [handleGroupId, handlePortkeyId, jumpToWebview],
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
