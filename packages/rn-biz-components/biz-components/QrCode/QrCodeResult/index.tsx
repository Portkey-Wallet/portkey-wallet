import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import React from 'react';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { RouteProp, useRoute } from '@portkey-wallet/rn-inject-sdk';

const QrCodeResult = () => {
  const {
    params: { qrCodeStr },
  } = useRoute<RouteProp<{ params: { qrCodeStr: string } }>>();

  return (
    <PageContainer
      titleDom={'QR Code Info'}
      safeAreaColor={['blue', 'gray']}
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
