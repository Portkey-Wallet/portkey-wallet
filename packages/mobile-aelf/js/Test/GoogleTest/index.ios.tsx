import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { customFetch } from '@portkey-wallet/utils/fetch';
import Config from 'react-native-config';
import CommonButton from 'components/CommonButton';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleTestIOS() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });
  console.log(response, '=====response');
  const getUserInfo = useCallback(async () => {
    if (response?.type === 'success') {
      const userInfo = await customFetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${response?.authentication?.accessToken}` },
      });
      console.log(userInfo, '=======userInfo');
    }
  }, [response]);
  useEffect(() => {
    if (response) getUserInfo();
  }, [getUserInfo, response]);
  return (
    <>
      <CommonButton
        type="primary"
        disabled={!request}
        title="Login Google iOS"
        onPress={() => {
          promptAsync();
        }}
      />
    </>
  );
}
