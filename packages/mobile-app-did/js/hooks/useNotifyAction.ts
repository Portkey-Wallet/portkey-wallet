import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useMemo } from 'react';
import { usePin } from './store';

import { FCMMessageData } from 'types/common';
import { NOTIFY_ACTION } from 'constants/notify';
import messaging from '@react-native-firebase/messaging';
import { checkMessageIsFromMainnet, parseFCMMessage } from 'utils/FCM';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from './chat';
import myEvents from 'utils/deviceEvent';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';

export function useNotifyAction() {
  const { t } = useLanguage();

  const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const jumpToChatDetails = useJumpToChatDetails();

  return useCallback((action: NOTIFY_ACTION, data?: FCMMessageData) => {
    try {
      switch (action) {
        case NOTIFY_ACTION.switchNetwork: {
          ActionSheet.alert({
            title: t('Switch????'),
            message: t('switch.'),
            buttons: [
              {
                title: t('No'),
                type: 'outline',
              },
              {
                title: t('Yes'),
                onPress: async () => {
                  // TODO switch to another network
                },
              },
            ],
          });
          break;
        }

        case NOTIFY_ACTION.openChat: {
          // TODO: change
          const { channelId, type } = parseFCMMessage(data);
          myEvents.navToBottomTab.emit({ tabName: ChatTabName });

          // is channel exit
          if (type === 'group') {
            // jumpToChatGroupDetails();
          } else {
            // jumpToChatDetails({ channelId });
          }

          // if (redpacket) {
          // await sleep(500);
          // ViewRedpacket()
          // }

          break;
        }

        default:
          console.log('this action is not supported');
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
}

export default function useScheme() {
  const { address, caHash } = useCurrentWalletInfo();

  const pin = usePin();
  const isMainnet = useIsMainnet();
  const logged = useMemo(() => !!address && caHash, [address, caHash]);
  const notifyAct = useNotifyAction();

  const handleBackGroundMessage = useCallback(
    (data: FCMMessageData) => {
      const fromMainnet = checkMessageIsFromMainnet(data);
      if (isMainnet === fromMainnet) {
        notifyAct(NOTIFY_ACTION.switchNetwork);
      } else {
        notifyAct(NOTIFY_ACTION.openChat, data);
      }
    },
    [isMainnet, notifyAct],
  );

  useEffect(() => {
    if (!logged) return;

    // From app background status
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (pin && logged) {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
        handleBackGroundMessage(remoteMessage.data as FCMMessageData);
      }

      // console.log('Notification caused app to open from background state:', remoteMessage.notification);
      // alert('from background state:' + String(remoteMessage.notification));

      // navigationService.navigate('AboutUs');
    });
  }, [handleBackGroundMessage, logged, pin]);

  useEffect(() => {
    if (!logged) return;

    // From app quit status
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (pin && logged) {
          console.log('Notification caused app to open from background state:', remoteMessage?.notification);

          handleBackGroundMessage(remoteMessage?.data as FCMMessageData);
        }
        // if (remoteMessage) {
        //   console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        //   alert('from quit state:' + String(remoteMessage.notification));
        // }
      });
  }, [handleBackGroundMessage, logged, pin]);
}
