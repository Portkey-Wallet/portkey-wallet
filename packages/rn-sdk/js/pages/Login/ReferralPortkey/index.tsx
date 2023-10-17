import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground, View } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Email from '../components/Email';
import Phone from '../components/Phone';
import QRCode from '../components/QRCode';
import Referral from '../components/Referral';
import { PageLoginType } from '../types';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import useEffectOnce from 'hooks/useEffectOnce';
import { checkForCountryCodeCached } from 'model/global';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';

const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

export default function ReferralKey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const { t } = useLanguage();
  const isMainnet = true;
  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.REFERRAL_ENTRY,
  });
  const loginMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} />,
      [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
      [PageLoginType.phone]: <Phone setLoginType={setLoginType} />,
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} />,
    }),
    [],
  );
  useEffectOnce(() => {
    checkForCountryCodeCached();
  });
  const backgroundImage = useMemo(() => {
    if (isIOS) {
      return { uri: 'background' };
    } else {
      return require('../img/background.png');
    }
  }, []);
  return (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={backgroundImage}>
      <PageContainer
        titleDom
        type="leftBack"
        themeType="blue"
        style={BGStyles.transparent}
        pageSafeBottomPadding={!isIOS}
        containerStyles={styles.containerStyles}
        safeAreaColor={safeAreaColor}
        scrollViewProps={scrollViewProps}
        leftCallback={() => {
          onFinish({
            status: 'cancel',
            data: {},
          });
        }}>
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
      </PageContainer>
    </ImageBackground>
  );
}
