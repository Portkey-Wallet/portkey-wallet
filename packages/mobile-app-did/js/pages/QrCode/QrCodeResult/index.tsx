import PageContainer from 'components/PageContainer';
import React from 'react';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { RouteProp, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';

const QrCodeResult = () => {
  const {
    params: { qrCodeStr },
  } = useRoute<RouteProp<{ params: { qrCodeStr: string } }>>();

  const pageStyles = getStyles();

  return (
    <PageContainer
      titleDom={'QR Code Info'}
      safeAreaColor={['black', 'black']}
      containerStyles={[pageStyles.pageWrap]}
      scrollViewProps={{ disabled: true }}>
      <TextM selectable>{qrCodeStr}</TextM>
    </PageContainer>
  );
};
export default QrCodeResult;

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(16, 20),
  },
}));
