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
import { PageLoginType } from '../types';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import { CountryCodeItem } from 'types/wallet';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

export default function LoginPortkey({
  selectedCountryCode,
  updateCountryCode,
}: {
  selectedCountryCode: CountryCodeItem | null;
  updateCountryCode: (item: CountryCodeItem) => void;
}) {
  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.SIGN_IN_ENTRY,
  });

  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.phone);
  const { t } = useLanguage();
  // const isMainnet = useIsMainnet();
  const isMainnet = true;
  const loginMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} />,
      [PageLoginType.qrCode]: <View />,
      [PageLoginType.phone]: (
        <Phone
          setLoginType={setLoginType}
          selectedCountryCode={selectedCountryCode}
          updateCountryCode={updateCountryCode}
        />
      ),
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

  const onBack = () => {
    onFinish({
      status: 'cancel',
      data: {},
    });
  };

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
        leftCallback={onBack}>
        <Svg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} color={defaultColors.bg1} />
        <View style={GStyles.center}>
          {!isMainnet && (
            <View style={styles.labelBox}>
              <TextM style={[FontStyles.font11, fonts.mediumFont]}>TEST</TextM>
            </View>
          )}
          <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Log In To Portkey')}</TextXXXL>
        </View>
        {loginMap[loginType as keyof typeof loginMap]}
      </PageContainer>
    </ImageBackground>
  );
}
