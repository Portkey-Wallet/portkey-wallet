import React, { useMemo, useState } from 'react';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import { TextM, TextXXXL } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { ImageBackground, View } from 'react-native';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import background from '../img/background.png';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { BGStyles, FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import styles from '../styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType, PageType } from '../types';
import SwitchNetwork from '../components/SwitchNetwork';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import fonts from '@portkey-wallet/rn-base/assets/theme/fonts';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { SafeAreaColorMapKeyUnit } from '@portkey-wallet/rn-components/components/CustomHeader';
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const scrollViewProps = { extraHeight: 120 };

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
};
export default function SignupPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();

  const signupMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} type={PageType.signup} />,
      [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
      [PageLoginType.phone]: <Phone setLoginType={setLoginType} type={PageType.signup} />,
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} type={PageType.signup} />,
    }),
    [],
  );
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={background}>
      <PageContainer
        titleDom
        type="leftBack"
        themeType="blue"
        pageSafeBottomPadding={!isIOS}
        style={BGStyles.transparent}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        containerStyles={styles.containerStyles}
        leftCallback={
          BackType[loginType]
            ? () => setLoginType(PageLoginType.referral)
            : () => {
                myEvents.clearLoginInput.emit();
                navigationService.goBack();
              }
        }>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} color={defaultColors.bg1} />
        <View style={GStyles.center}>
          {!isMainnet && (
            <View style={styles.labelBox}>
              <TextM style={[FontStyles.font11, fonts.mediumFont]}>TEST</TextM>
            </View>
          )}
          <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Sign up Portkey ')}</TextXXXL>
        </View>

        {signupMap[loginType]}
        <SwitchNetwork />
      </PageContainer>
    </ImageBackground>
  );
}
