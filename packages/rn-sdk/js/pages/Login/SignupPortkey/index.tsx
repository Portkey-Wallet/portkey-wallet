import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground, View } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import Email from '../components/Email';
// import QRCode from '../components/QRCode';
import Phone from '../components/Phone';
import Referral from '../components/Referral';
import { PageLoginType, PageType } from '../types';
// import SwitchNetwork from '../components/SwitchNetwork';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import { CountryCodeItem } from 'types/wallet';
import useInitSkeleton from 'model/hooks/UseInitSkeleton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const skeletonPath = require('assets/image/pngs/skeleton-email.png');

const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

const scrollViewProps = { extraHeight: 120 };

const BackType: any = {
  [PageLoginType.email]: true,
  [PageLoginType.phone]: true,
};
export default function SignupPortkey({
  selectedCountryCode,
  updateCountryCode,
}: {
  selectedCountryCode: CountryCodeItem | null;
  updateCountryCode: (item: CountryCodeItem) => void;
}) {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.phone);
  const { t } = useLanguage();
  const isMainnet = true;
  const { initSkeleton, showSkeleton } = useInitSkeleton(skeletonPath);

  const signupMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} type={PageType.signup} />,
      // [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
      [PageLoginType.qrCode]: <View />,
      [PageLoginType.phone]: (
        <Phone
          setLoginType={setLoginType}
          type={PageType.signup}
          selectedCountryCode={selectedCountryCode}
          updateCountryCode={updateCountryCode}
        />
      ),
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} />,
    }),
    [selectedCountryCode, updateCountryCode],
  );

  const backgroundImage = useMemo(() => {
    if (isIOS) {
      return { uri: 'background' };
    } else {
      return require('../img/background.png');
    }
  }, []);

  return initSkeleton ? (
    showSkeleton()
  ) : (
    <ImageBackground style={styles.backgroundContainer} resizeMode="cover" source={backgroundImage}>
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
          <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Sign up Portkey')}</TextXXXL>
        </View>

        {signupMap[loginType]}
        {/* <SwitchNetwork /> */}
      </PageContainer>
    </ImageBackground>
  );
}
