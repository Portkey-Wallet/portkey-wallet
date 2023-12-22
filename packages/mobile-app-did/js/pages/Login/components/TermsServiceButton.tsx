import React from 'react';
import { Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from 'assets/theme/styles';
export default function TermsServiceButton() {
  return (
    <Touchable
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.termsServiceTip]}
      onPress={() =>
        navigationService.navigate('ViewOnWebView', {
          title: 'Terms of Service',
          url: `${OfficialWebsite}/terms-of-service`,
        })
      }>
      <TextS style={FontStyles.font7}>
        By proceeding, you agree to the <Text style={FontStyles.font4}>Terms of Service.</Text>
      </TextS>
    </Touchable>
  );
}
