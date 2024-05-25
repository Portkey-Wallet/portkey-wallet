import PageContainer from 'components/PageContainer';
import React from 'react';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import { RouteProp, useRoute } from '@react-navigation/native';

const QrCodeResult = () => {
  const {
    params: { qrCodeStr },
  } = useRoute<RouteProp<{ params: { qrCodeStr: string } }>>();

  return (
    <PageContainer
      titleDom={'QR Code Info'}
      safeAreaColor={['white', 'gray']}
      containerStyles={[pageStyles.pageWrap]}
      scrollViewProps={{ disabled: true }}>
      <TextM selectable>{qrCodeStr}</TextM>
    </PageContainer>
  );
};
export default QrCodeResult;

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(16, 20),
  },
});
