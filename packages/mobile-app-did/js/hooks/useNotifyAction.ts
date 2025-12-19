import { useCurrentWalletInfo, useOtherNetworkLogged } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePin } from './store';
import { FCMMessageData } from 'types/common';
import messaging from '@react-native-firebase/messaging';
import { getFcmMessageNetwork } from 'utils/FCM';
import ActionSheet from 'components/ActionSheet';
import { useLanguage } from 'i18n/hooks';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useChangeNetwork } from './network';
import { useLatestRef } from '@portkey-wallet/hooks';

export const useNotify = () => {
  const { t } = useLanguage();
  const { address, caHash } = useCurrentWalletInfo();

  const pin = usePin();
  const currentNetwork = useCurrentNetwork();

  const otherNetworkLogged = useOtherNetworkLogged();
  const logged = useMemo(() => !!address && caHash, [address, caHash]);
  const lastLogged = useLatestRef(logged);
  const lastOtherNetworkLogged = useLatestRef(otherNetworkLogged);
  const [remoteData, setRemoteData] = useState<any>();

  const changeNetwork = useChangeNetwork({ key: 'tab', name: 'tab' });

  const handleBackGroundMessage = useCallback(
    (data: FCMMessageData) => {
      const messageNetworkType = getFcmMessageNetwork(data);

      console.log('messageNetworkType', messageNetworkType, 'currentNetwork', currentNetwork, 'data', data);

      if (currentNetwork === messageNetworkType) {
        // notifyAct(NOTIFY_ACTION.openChat, data);
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
                await changeNetwork({ networkType: 'MAINNET' }, false);
              },
            },
          ],
        });
      }
    },
    [changeNetwork, currentNetwork, t],
  );

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (!lastLogged.current && !lastOtherNetworkLogged.current) {
        return;
      }

      console.log('--remoteMessage onNotificationOpenedApp', remoteMessage);
      setRemoteData(remoteMessage.data);
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!lastLogged.current && !lastOtherNetworkLogged.current) {
          return;
        }
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
