import React from 'react';
import { Button } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

export default function GoogleTest() {
  console.log('Config.GOOGLE_WEB_CLIENT_ID:', Config.GOOGLE_WEB_CLIENT_ID);
  return (
    <>
      <Button
        title="Login Android"
        onPress={async () => {
          try {
            console.log('GoogleSignin.hasPlayServices');
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log('GoogleSignin.hasPlayServices, google services are available');
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo, '====userInfo');
          } catch (error: any) {
            console.log('error.code', error, error.code, error.stack);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      />
    </>
  );
}
