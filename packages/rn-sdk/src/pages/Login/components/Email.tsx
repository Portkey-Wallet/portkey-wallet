import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles } from 'assets/theme/styles';
import { useLanguage } from 'i18n/hooks';
import styles from '../styles';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import Button from './Button';
import { AccountOriginalType } from 'model/verify/core';
import { PortkeyEntries } from 'config/entries';
import TermsServiceButton from './TermsServiceButton';
import { useVerifyEntry } from 'model/verify/entry';
import { doubleClick } from 'utils/commonUtil';
import { useInputFocus } from 'hooks/useInputFocus';

const TitleMap = {
  [PageType.login]: {
    button: 'Log In',
  },
  [PageType.signup]: {
    button: 'Sign up',
  },
};

export default function Email({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type: PageType;
}) {
  const { t } = useLanguage();
  const iptRef = useRef<any>();
  useInputFocus(iptRef);
  const [loading] = useState<boolean>();
  const [email, setEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { verifyEntry } = useVerifyEntry({
    type,
    accountOriginalType: AccountOriginalType.Email,
    entryName: type === PageType.login ? PortkeyEntries.SIGN_IN_ENTRY : PortkeyEntries.SIGN_UP_ENTRY,
    setErrorMessage,
    verifyAccountIdentifier: checkEmail,
  });

  const handleEmailChange = (msg: string) => {
    setEmail(msg);
    setErrorMessage(undefined);
  };

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRowWrap, GStyles.marginBottom(20)]}>
          <Button isActive title="Email" onPress={() => setLoginType(PageLoginType.email)} />
        </View>
        <CommonInput
          ref={iptRef}
          value={email}
          type="general"
          autoCorrect={false}
          onChangeText={handleEmailChange}
          errorMessage={errorMessage}
          keyboardType="email-address"
          placeholder={t('Enter Email')}
          containerStyle={styles.inputContainerStyle}
        />
        <CommonButton
          containerStyle={GStyles.marginTop(16)}
          disabled={!email}
          type="primary"
          loading={loading}
          onPress={() => {
            doubleClick(verifyEntry, email ?? '');
          }}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      <TermsServiceButton />
    </View>
  );
}
