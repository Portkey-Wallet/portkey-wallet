import React, { useCallback } from 'react';
import { View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';

export default function TermsServiceButton() {
  const buttonStyles = styles();
  const onJump = useCallback((type: 'Privacy Policy' | 'Terms of Service') => {
    const url = type === 'Privacy Policy' ? `${OfficialWebsite}/privacy-policy` : `${OfficialWebsite}/terms-of-service`;
    navigationService.navigate('ViewOnWebView', {
      title: type,
      url,
    });
  }, []);

  return (
    <View style={[GStyles.flexRowWrap, GStyles.itemCenter, buttonStyles.termsServiceTip]}>
      <TextM style={[FontStyles.font7, buttonStyles.textWrap]}>By continuing, you agree to the</TextM>
      <TextM style={[FontStyles.font7, buttonStyles.textWrap]}>
        <TextM onPress={() => onJump('Terms of Service')} style={buttonStyles.link} suppressHighlighting>
          Terms of Service
        </TextM>
        {` and `}
        <TextM style={buttonStyles.link} suppressHighlighting onPress={() => onJump('Privacy Policy')}>
          Privacy Policy
        </TextM>
        {`.`}
      </TextM>
    </View>
  );
}
