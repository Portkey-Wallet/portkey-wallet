import React from 'react';
import RecaptchaModal from 'components/RecaptchaModal';
import OverlayModal from '../OverlayModal';
import { screenWidth, screenHeight } from '@portkey-wallet/utils/mobile/device';
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
        siteKey={'6LfR_bElAAAAAJSOBuxle4dCFaciuu9zfxRQfQC0'}
        baseUrl={'https://portkey-website-dev.vercel.app'}
        onVerify={token => {
          console.log('success!', token);
          resolve(token as string);
          OverlayModal.hide();
        }}
        onExpire={() => {
          console.log('expire');
          reject('expire');
        }}
        onClose={() => {
          OverlayModal.hide();
          console.log('klq onclose');
        }}
        onError={error => {
          console.log(error, '=====error');
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
