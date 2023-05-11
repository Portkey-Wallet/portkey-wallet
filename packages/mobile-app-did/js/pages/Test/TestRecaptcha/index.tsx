import CommonButton from 'components/CommonButton';
import PageContainer from 'components/PageContainer';
import Recaptcha, { RecaptchaInterface } from 'components/Recaptcha';
import { useLanguage } from 'i18n/hooks';
import React, { useRef } from 'react';

const TestRecaptcha: React.FC = () => {
  const recaptcha = useRef<RecaptchaInterface>();
  const { language } = useLanguage();

  return (
    <PageContainer>
      <Recaptcha
        lang={language}
        ref={recaptcha}
        // test siteKey
        siteKey="6LdKF0EjAAAAAF8erMCHaMMoJWXLxEOC0OMtuibq"
        baseUrl="http://my.domain.com"
        onVerify={token => console.log('success!', token)}
        onExpire={() => {
          console.log('expire');
        }}
        onError={error => {
          console.log(error, '=====error');
        }}
      />
      <CommonButton
        type="primary"
        title="open"
        onPress={() => {
          console.log('open');

          recaptcha.current?.open();
        }}
      />
    </PageContainer>
  );
};
export default TestRecaptcha;
