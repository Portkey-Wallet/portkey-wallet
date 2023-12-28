import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from 'assets/theme/styles';
export default function TermsServiceButton() {
  const onJump = useCallback((type: 'Privacy Policy' | 'Terms of Service') => {
    const url = type === 'Privacy Policy' ? `${OfficialWebsite}/privacy-policy` : `${OfficialWebsite}/terms-of-service`;
    navigationService.navigate('ViewOnWebView', {
      title: type,
      url,
    });
  }, []);

  return (
    <View style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.termsServiceTip]}>
      <Text style={[FontStyles.font7, styles.textWrap]}>By proceeding, you agree to the</Text>
      <Text style={[FontStyles.font7, styles.textWrap]}>
        <Text onPress={() => onJump('Terms of Service')} style={FontStyles.font4} suppressHighlighting>
          Terms of Service
        </Text>
        {` and `}
        <Text style={FontStyles.font4} suppressHighlighting onPress={() => onJump('Privacy Policy')}>
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
}
