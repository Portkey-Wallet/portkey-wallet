import { GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { Button } from 'antd';
import React from 'react';

export default function GoogleLoginCom() {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse, 'GoogleLogin=='),
    onError: err => console.log(err, 'err==='),
  });

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse, 'GoogleLogin===useGoogleOneTapLogin');
    },
    onError: () => {
      console.log('Login Failed');
    },
  });
  return (
    <>
      <GoogleLogin
        onError={(...err) => {
          console.log(err, 'GoogleLogin===error');
        }}
        onSuccess={tokenResponse => console.log(tokenResponse, 'GoogleLogin==')}
        auto_select={false}
      />
      <Button onClick={() => login()}>Google</Button>
    </>
  );
}
