import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';
import { makeStyles } from '@rneui/themed';

const BackType: any = {
  [PageLoginType.phone]: true,
};

export default function LoginPortkey() {
  const styles = getStyles();
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const loginMap = useMemo(
    () => ({
      [PageLoginType.phone]: <Phone setLoginType={setLoginType} />,
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} />,
    }),
    [],
  );

  return (
    <PageContainer
      rightDom={<SwitchNetwork />}
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}
      leftCallback={BackType[loginType] ? () => setLoginType(PageLoginType.referral) : undefined}>
      {loginMap[loginType]}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
  },
}));
