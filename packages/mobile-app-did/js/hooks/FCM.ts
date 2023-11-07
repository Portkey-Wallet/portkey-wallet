import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import navigationService from 'utils/navigationService';

export function useCheckMessageUpdate() {
  useEffect(() => {
    // From app background status
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      alert('from background state:' + String(remoteMessage.notification));

      // navigationService.navigate('AboutUs');
    });

    // From app quit status
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          alert('from quit state:' + String(remoteMessage.notification));
        }
      });
  }, []);
}
