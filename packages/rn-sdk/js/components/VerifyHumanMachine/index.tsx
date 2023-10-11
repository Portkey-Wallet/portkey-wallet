import React from 'react';
import Recaptcha from 'components/Recaptcha';
import OverlayModal from '../OverlayModal';
import { screenWidth, screenHeight } from '@portkey-wallet/utils/mobile/device';

import { clearBackgroundTimeout, setBackgroundTimeout } from 'utils/backgroundTimer';

const TIME_OUT = 20000; // recaptcha timeout 20 seconds

async function verifyHumanMachine(language: any) {
  let timer: undefined | NodeJS.Timer;
  return new Promise((resolve, reject) => {
    const key = OverlayModal.show(
      <Recaptcha
        lang={language}
        headerComponent={null}
        siteKey={'6LfR_bElAAAAAJSOBuxle4dCFaciuu9zfxRQfQC0'}
        baseUrl={'https://portkey.finance'}
        onVerify={token => {
          OverlayModal.hideKey(key);
          resolve(token as string);
        }}
        onExpire={() => {
          reject('expire');
        }}
        onClose={type => {
          OverlayModal.hideKey(key);
          if (type !== 'verified') reject('You closed the prompt without any action.');
        }}
        webViewProps={{
          onLoadEnd: () => {
            timer && clearBackgroundTimeout(timer);
          },
          onLoadStart: () => {
            timer = setBackgroundTimeout(() => {
              OverlayModal.hideKey(key);
              reject('Request timed out');
            }, TIME_OUT);
          },
        }}
        onError={error => {
          reject(error);
        }}
      />,
      {
        modal: true,
        type: 'zoomOut',
        position: 'center',
        containerStyle: {
          width: screenWidth,
          height: screenHeight * 0.9,
        },
      },
    );
  });
}

export { verifyHumanMachine };
