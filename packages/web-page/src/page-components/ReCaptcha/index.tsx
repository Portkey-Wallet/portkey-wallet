import { RE_CAPTCHA_SITE_KEY } from 'constants/misc';
import dynamic from 'next/dynamic';
const GoogleReCaptcha = dynamic(import('@matt-block/react-recaptcha-v2'), { ssr: false });
import React, { useCallback } from 'react';
import styles from './styles.module.less';

export default function ReCaptcha() {
  const handleSuccess = useCallback((response: string) => {
    window.portkey?.request({
      method: 'portkey_setReCaptchaCodeV2',
      params: { response },
    });
  }, []);

  const handleExpire = useCallback(() => {
    window.portkey?.request({
      method: 'portkey_setReCaptchaCodeV2',
      params: { error: 'Verification has expired, re-verify.' },
    });
  }, []);

  const handleError = useCallback(() => {
    window.portkey?.request({
      method: 'portkey_setReCaptchaCodeV2',
      params: { error: 'Something went wrong, check your connection' },
    });
  }, []);

  return (
    <div className={styles.body}>
      <GoogleReCaptcha
        siteKey={RE_CAPTCHA_SITE_KEY}
        theme="light"
        size="normal"
        onSuccess={handleSuccess}
        onExpire={handleExpire}
        onError={handleError}
      />
    </div>
  );
}
