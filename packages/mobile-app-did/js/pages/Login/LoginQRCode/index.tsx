import React from 'react';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import SwitchNetwork from '../components/SwitchNetwork';
import { makeStyles } from '@rneui/themed';
import QRCode from '../components/QRCode';

export default function LoginQRCode() {
  const styles = getStyles();

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyles}
      style={styles.mainContainer}
      leftCallback={() => navigationService.goBack()}
      rightDom={<SwitchNetwork />}>
      <QRCode />
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    height: screenHeight,
    backgroundColor: theme.colors.bgBase1,
    alignItems: 'center',
    paddingTop: 0,
  },
  mainContainer: {
    backgroundColor: theme.colors.bgBase1,
  },
}));
