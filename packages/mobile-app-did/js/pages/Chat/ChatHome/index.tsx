import React from 'react';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';

import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';

import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';

export default function DiscoverHome() {
  const { t } = useLanguage();

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.bg5}>
      <TextM onPress={() => navigationService.navigate('ChatDetails')}>ChatHome</TextM>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    paddingTop: pTd(24),
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
