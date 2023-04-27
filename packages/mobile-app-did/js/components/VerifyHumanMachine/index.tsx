import React from 'react';
import RecaptchaModal from 'components/RecaptchaModal';
import OverlayModal from '../OverlayModal';
import { screenWidth, screenHeight } from '@portkey-wallet/utils/mobile/device';
import Config from 'react-native-config';
import { request } from '@portkey-wallet/api/api-did';

async function checkNeedVerify() {
  const req = await request.verify.checkGoogleRecaptcha({});
  return req as boolean;
}
async function verifyHumanMachine(language: any, needVerifyFunc: () => Promise<boolean> = checkNeedVerify) {
  let needVerify = false;
  if (needVerifyFunc) {
    needVerify = await needVerifyFunc();
  }
  if (!needVerify) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    OverlayModal.show(
      <RecaptchaModal
        lang={language}
        headerComponent={null}
        siteKey={Config.RECAPTCHA_SITE_KEY}
        baseUrl={Config.RECAPTCHA_BASE_URL}
        onVerify={token => {
          resolve(token as string);
          OverlayModal.hide();
        }}
        onExpire={() => {
          reject('expire');
        }}
        onClose={() => {
          OverlayModal.hide();
        }}
        onError={error => {
          reject(error);
          // OverlayModal.hide();
        }}
      />,
      {
        modal: true,
        type: 'zoomOut',
        position: 'center',
        containerStyle: {
          width: screenWidth,
          height: screenHeight,
        },
      },
    );
  });
}

export { verifyHumanMachine };
