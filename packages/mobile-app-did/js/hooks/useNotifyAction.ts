import { useCurrentWalletInfo, useOtherNetworkLogged } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePin } from './store';
import { FCMMessageData } from 'types/common';
import { NOTIFY_ACTION } from 'constants/notify';
import messaging from '@react-native-firebase/messaging';
import { getFcmMessageNetwork } from 'utils/FCM';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from './chat';
import { useCurrentNetwork, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import { useChangeNetwork } from './network';
import { useLatestRef } from '@portkey-wallet/hooks';
import { TabRouteNameEnum } from 'types/navigate';
import navigationService from 'utils/navigationService';

export const useNotifyAction = () => {
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const jumpToChatDetails = useJumpToChatDetails();

  return useCallback(
    async (action: NOTIFY_ACTION, data?: FCMMessageData) => {
      try {
        switch (action) {
          case NOTIFY_ACTION.openChat: {
            if (!data) return;
            const { channelId = '', channelType } = data;
            if (channelType === ChannelTypeEnum.GROUP) await jumpToChatGroupDetails({ channelUuid: channelId });
            if (channelType === ChannelTypeEnum.P2P) await jumpToChatDetails({ channelUuid: channelId });
            navigationService.navToBottomTab(TabRouteNameEnum.CHAT);
            break;
          }

          default:
            console.log('this action is not supported');
        }
      } catch (error) {
        console.log(error);
      }
    },
    [jumpToChatDetails, jumpToChatGroupDetails],
  );
};

export const useNotify = () => {
  const { t } = useLanguage();
  const { address, caHash } = useCurrentWalletInfo();

  const pin = usePin();
  const currentNetwork = useCurrentNetwork();
  const isMainnet = useIsMainnet();

  const otherNetworkLogged = useOtherNetworkLogged();
  const logged = useMemo(() => !!address && caHash, [address, caHash]);
  const lastLogged = useLatestRef(logged);
  const lastOtherNetworkLogged = useLatestRef(otherNetworkLogged);
  const [remoteData, setRemoteData] = useState<any>();

  const notifyAct = useNotifyAction();
  const changeNetwork = useChangeNetwork({ key: 'tab', name: 'tab' });

  const handleBackGroundMessage = useCallback(
    (data: FCMMessageData) => {
      const messageNetworkType = getFcmMessageNetwork(data);

      console.log('messageNetworkType', messageNetworkType, 'currentNetwork', currentNetwork, 'data', data);

      if (currentNetwork === messageNetworkType) {
        notifyAct(NOTIFY_ACTION.openChat, data);
      } else {
        ActionSheet.alert({
          title: t(`Do you want to switch to ${messageNetworkType} to view the new messages?`),
          message: t(`Upon confirmation, you will be switched to ${messageNetworkType} to view the messages.`),
          buttons: [
            {
              title: t('Cancel'),
              type: 'outline',
            },
            {
              title: t('Confirm'),
              onPress: async () => {
                await changeNetwork({ networkType: isMainnet ? 'TESTNET' : 'MAINNET' }, false);
              },
            },
          ],
        });
      }
    },
    [changeNetwork, currentNetwork, isMainnet, notifyAct, t],
  );

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!lastLogged.current && !lastOtherNetworkLogged.current) return;

      console.log('--remoteMessage onNotificationOpenedApp', remoteMessage);
      setRemoteData(remoteMessage.data);
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!lastLogged.current && !lastOtherNetworkLogged.current) return;
        console.log('--remoteMessage getInitialNotification', remoteMessage);
        setRemoteData(remoteMessage?.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (pin && remoteData && logged) {
      timer = setTimeout(() => {
        handleBackGroundMessage(remoteData as FCMMessageData);
        setRemoteData(undefined);
      }, 400);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [remoteData, pin, handleBackGroundMessage, logged]);
};

export default useNotify;
