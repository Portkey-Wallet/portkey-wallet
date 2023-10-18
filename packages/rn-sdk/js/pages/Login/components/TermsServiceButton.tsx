import React from 'react';
import { Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from 'assets/theme/styles';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';

export default function TermsServiceButton() {
  const { navigateForResult } = useBaseContainer({});
  return (
    <Touchable
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.termsServiceTip]}
      onPress={() =>
        // navigationService.navigate('ViewOnWebView', {
        //   title: 'Terms of Service',
        //   url: `${OfficialWebsite}/terms-of-service`,
        // })
        {
          navigateForResult(
            PortkeyEntries.VIEW_ON_WEBVIEW,
            {
              params: {
                title: 'Terms of Service',
                url: `${OfficialWebsite}/terms-of-service`,
              },
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            () => {},
          );
        }
      }>
      <TextS style={FontStyles.font7}>
        By proceeding, you agree to the <Text style={FontStyles.font4}>Terms of Service.</Text>
      </TextS>
    </Touchable>
  );
}
