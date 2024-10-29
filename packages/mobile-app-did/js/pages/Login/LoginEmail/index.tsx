import React, { useState } from 'react';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import Email from '../components/Email';
import { PageLoginType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
};
export default function LoginEmail() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const signupStyles = styles();

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      scrollViewProps={{ disabled: true }}
      containerStyles={signupStyles.containerStyles}
      style={signupStyles.mainContainer}
      leftCallback={
        BackType[loginType]
          ? () => setLoginType(PageLoginType.referral)
          : () => {
              myEvents.clearLoginInput.emit();
              navigationService.goBack();
            }
      }
      rightDom={<SwitchNetwork />}>
      <Email setLoginType={setLoginType} />
    </PageContainer>
  );
}
