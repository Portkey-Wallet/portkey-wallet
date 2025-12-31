import React from 'react';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import Email from '../components/Email';
import { makeStyles } from '@rneui/themed';
import SwitchNetwork from '../components/SwitchNetwork';

export default function LoginEmail() {
  const signupStyles = styles();

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      scrollViewProps={{ disabled: true }}
      containerStyles={signupStyles.containerStyles}
      style={signupStyles.mainContainer}
      leftCallback={() => navigationService.goBack()}
      rightDom={<SwitchNetwork />}>
      <Email />
    </PageContainer>
  );
}

const styles = makeStyles(theme => ({
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
