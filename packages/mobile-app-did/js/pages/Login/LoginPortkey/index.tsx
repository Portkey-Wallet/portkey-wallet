import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';

import styles from './styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
  [PageLoginType.qrCode]: true,
};

export default function LoginPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const loginMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} />,
      [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
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
