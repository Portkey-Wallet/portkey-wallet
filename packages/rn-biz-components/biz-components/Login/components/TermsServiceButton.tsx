import React, { useCallback } from 'react';
import { View } from 'react-native';
import GStyles from '@portkey-wallet/rn-components/theme/GStyles';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from '@portkey-wallet/rn-components/theme/styles';
import { TextS } from '@portkey-wallet/rn-components/components/CommonText';
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
      <TextS style={[FontStyles.font7, styles.textWrap]}>By proceeding, you agree to the</TextS>
      <TextS style={[FontStyles.font7, styles.textWrap]}>
        <TextS onPress={() => onJump('Terms of Service')} style={FontStyles.font4} suppressHighlighting>
          Terms of Service
        </TextS>
        {` and `}
        <TextS style={FontStyles.font4} suppressHighlighting onPress={() => onJump('Privacy Policy')}>
          Privacy Policy
        </TextS>
      </TextS>
    </View>
  );
}
