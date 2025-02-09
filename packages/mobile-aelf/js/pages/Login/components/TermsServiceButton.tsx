import React, { useCallback } from 'react';
import { View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-eoa/network';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

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
      <TextM style={[FontStyles.font7, buttonStyles.textWrap]}>
        {'By continuing, you agree to the '}
        <TextM onPress={() => onJump('Terms of Service')} style={buttonStyles.link} suppressHighlighting>
          Terms of Service
        </TextM>
        {' and '}
        <TextM style={buttonStyles.link} suppressHighlighting onPress={() => onJump('Privacy Policy')}>
          Privacy Policy
        </TextM>
        {'.'}
      </TextM>
    </View>
  );
}

const styles = makeStyles(theme => ({
  termsServiceTip: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
  },
  textWrap: {
    width: '100%',
    textAlign: 'center',
    lineHeight: pTd(20),
  },
  link: {
    color: theme.colors.textBrand1,
    lineHeight: pTd(20),
  },
}));
