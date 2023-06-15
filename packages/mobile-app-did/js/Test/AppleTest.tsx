import React from 'react';
// import * as AppleAuthentication from 'expo-apple-authentication';
import CommonButton from 'components/CommonButton';

export default function AppleTest() {
  return (
    <>
      <CommonButton
        type="primary"
        title="login apple"
        onPress={async () => {
          // try {
          //   const credential = await AppleAuthentication.signInAsync({
          //     requestedScopes: [
          //       AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          //       AppleAuthentication.AppleAuthenticationScope.EMAIL,
          //     ],
          //   });
          //   console.log(credential, '======credential');
          //   // signed in
          // } catch (e: any) {
          //   if (e.code === 'ERR_REQUEST_CANCELED') {
          //     // handle that the user canceled the sign-in flow
          //   } else {
          //     // handle other errors
          //   }
          // }
        }}
      />
      <CommonButton
        type="primary"
        title="signOut apple"
        onPress={async () => {
          // try {
          //   const signOutCredential = await AppleAuthentication.signOutAsync({
          //     user: '000303.cd817b6983074d8c8fb792496f277ebc.0257',
          //   });
          //   console.log(signOutCredential, '======credential');
          //   // signed in
          // } catch (e: any) {
          //   if (e.code === 'ERR_REQUEST_CANCELED') {
          //     // handle that the user canceled the sign-in flow
          //   } else {
          //     // handle other errors
          //   }
          // }
        }}
      />
    </>
  );
}
