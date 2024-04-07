import React, { useEffect, useMemo, useState } from 'react';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import { TextM, TextXXXL } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-components/utils/unit';
import { ImageBackground, View } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import background from '../img/background.png';
import Svg from '@portkey-wallet/rn-components/components/Svg';
// import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';
import GStyles from 'assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import { request } from 'reac';
import { SafeAreaColorMapKeyUnit } from '@portkey-wallet/rn-components/components/CustomHeader';
import { BGStyles, FontStyles } from '@portkey-wallet/rn-components/theme/styles';
// import { request } from '@portkey-wallet/api/api-did';
const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
};

export default function LoginPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
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
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <PageContainer
        titleDom
        type="leftBack"
        themeType="blue"
        style={BGStyles.transparent}
        pageSafeBottomPadding={!isIOS}
        containerStyles={styles.containerStyles}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        leftCallback={BackType[loginType] ? () => setLoginType(PageLoginType.referral) : undefined}>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} color={defaultColors.bg1} />
        <View style={GStyles.center}>
          {!isMainnet && (
            <View style={styles.labelBox}>
              <TextM style={[FontStyles.font11, fonts.mediumFont]}>TEST</TextM>
            </View>
          )}
          <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Log In To Portkey ')}</TextXXXL>
        </View>
        {loginMap[loginType]}
        <SwitchNetwork />
      </PageContainer>
    </ImageBackground>
  );
}
