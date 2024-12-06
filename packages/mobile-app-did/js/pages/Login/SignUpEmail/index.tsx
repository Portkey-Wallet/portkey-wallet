import React from 'react';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';

import Email from '../components/Email';
import { PageType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';
import { makeStyles } from '@rneui/themed';

export default function SignUpEmail() {
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
      <Email type={PageType.signup} />
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
