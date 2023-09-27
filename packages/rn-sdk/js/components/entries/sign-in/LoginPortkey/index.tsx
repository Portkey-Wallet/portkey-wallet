import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from '../../../../../../mobile-app-did/js/components/PageContainer';
import { TextM, TextXXXL } from '../../../../../../mobile-app-did/js/components/CommonText';
import { pTd } from '../../../../../../mobile-app-did/js/utils/unit';
import { ImageBackground, View } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useLanguage } from '../../../../../../mobile-app-did/js/i18n/hooks';
import background from '../../../../../../mobile-app-did/js/pages/Login/img/background.png';
import Svg from '../../../../../../mobile-app-did/js/components/Svg';
import { BGStyles, FontStyles } from '../../../../../../mobile-app-did/js/assets/theme/styles';
import styles from '../../../../../../mobile-app-did/js/pages/Login/styles';
import Email from '../../../../../../mobile-app-did/js/pages/Login/components/Email';
import QRCode from '../../../../../../mobile-app-did/js/pages/Login/components/QRCode';
import Phone from '../../../../../../mobile-app-did/js/pages/Login/components/Phone';
import Referral from '../../../../../../mobile-app-did/js/pages/Login/components/Referral';
import { PageLoginType } from '../../../../../../mobile-app-did/js/pages/Login/types';
import SwitchNetwork from '../../../../../../mobile-app-did/js/pages/Login/components/SwitchNetwork';
import GStyles from '../../../../../../mobile-app-did/js/assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import fonts from '../../../../../../mobile-app-did/js/assets/theme/fonts';
import { defaultColors } from '../../../../../../mobile-app-did/js/assets/theme';

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
          <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Log In To Portkey')}</TextXXXL>
        </View>
        {loginMap[loginType]}
        <SwitchNetwork />
      </PageContainer>
    </ImageBackground>
  );
}
