import React from 'react';
import RecaptchaModal from 'components/RecaptchaModal';
import OverlayModal from '../OverlayModal';
import { screenWidth, screenHeight } from '@portkey-wallet/utils/mobile/device';
import { View } from 'react-native';

const HeaderComp = () => {
  return <View />;
};
function verifyHumanMachine(language: any) {
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
