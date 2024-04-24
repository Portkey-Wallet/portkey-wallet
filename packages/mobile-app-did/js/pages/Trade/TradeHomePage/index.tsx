import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useFocusEffect } from '@react-navigation/native';
import myEvents from 'utils/deviceEvent';

export default function TradeHomePage() {
  useFocusEffect(
    useCallback(() => {
      myEvents.rotateTabTrade.emit();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <PageContainer
      titleDom="Send Crypto Box"
      hideTouchable
      safeAreaColor={['white', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyles}>
      <TextM>TEST</TextM>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    position: 'relative',
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0, 0),
  },
  scrollStyle: {
    minHeight: '100%',
    ...GStyles.paddingArg(16, 20),
  },
  tips: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font3,
    marginBottom: isIOS ? 0 : pTd(16),
  },
});
