import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePin } from './store';

import { FCMMessageData } from 'types/common';
import { NOTIFY_ACTION } from 'constants/notify';
import messaging from '@react-native-firebase/messaging';
import { getFcmMessageNetwork } from 'utils/FCM';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useJumpToChatDetails, useJumpToChatGroupDetails } from './chat';
import myEvents from 'utils/deviceEvent';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import { useCurrentNetwork, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import { useChangeNetwork } from './network';
import Loading from 'components/Loading';

export const useNotifyAction = () => {
  const jumpToChatGroupDetails = useJumpToChatGroupDetails();
  const jumpToChatDetails = useJumpToChatDetails();

  return useCallback(
    async (action: NOTIFY_ACTION, data?: FCMMessageData) => {
      try {
        switch (action) {
          case NOTIFY_ACTION.openChat: {
            if (!data) return;
            Loading.show();

            try {
              const { channelId = '', channelType } = data;
              myEvents.navToBottomTab.emit({ tabName: ChatTabName });
              if (channelType === ChannelTypeEnum.GROUP) {
                // TODO: if group delete
                await jumpToChatGroupDetails({ channelUuid: channelId });
              } else {
                await jumpToChatDetails({ channelUuid: channelId });
              }
            } catch (error) {
              console.log('error', error);
            } finally {
              Loading.hide();
            }

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

  const logged = useMemo(() => !!address && caHash, [address, caHash]);
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
                // todo: switch network route
                await changeNetwork({ networkType: isMainnet ? 'TESTNET' : 'MAIN' }, false);
              },
            },
          ],
        });
      }
    },
    [changeNetwork, currentNetwork, isMainnet, notifyAct, t],
  );

  useEffect(() => {
    if (!logged) return;

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('--remoteMessage onNotificationOpenedApp', remoteMessage);
      setRemoteData(remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('--remoteMessage getInitialNotification', remoteMessage);
        setRemoteData(remoteMessage?.data);
      });
  }, [logged]);

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
