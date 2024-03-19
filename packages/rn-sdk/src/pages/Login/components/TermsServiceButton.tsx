import React, { useState } from 'react';
import { Text } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import styles from '../styles';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { FontStyles } from 'assets/theme/styles';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { GlobalStorage } from 'service/storage';
import useEffectOnce from 'hooks/useEffectOnce';

export default function TermsServiceButton() {
  const { navigateForResult } = useBaseContainer({});
  const [prefix, setPrefix] = useState<string>('By proceeding, you agree to the');
  const [title, setTitle] = useState<string>('Terms of Service.');
  useEffectOnce(() => {
    (async () => {
      const storagePrefix = await GlobalStorage.getString('PortkeySDKTermsOfServicePrefix');
      const storageTitle = await GlobalStorage.getString('PortkeySDKTermsOfServiceTitle');
      if (storagePrefix) setPrefix(storagePrefix);
      if (storageTitle) setTitle(storageTitle);
    })();
  });
  return (
    <Touchable
      style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.termsServiceTip]}
      onPress={() => {
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
      }}>
      <TextS style={FontStyles.font7}>
        {prefix} <Text style={FontStyles.font4}>{title}</Text>
      </TextS>
    </Touchable>
  );
}
