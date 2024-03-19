import React, { useMemo, useState } from 'react';
import PageContainer, { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { TextM, TextXXXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ImageBackground, View } from 'react-native';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import CommonSvg from 'components/Svg';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Email from '../components/Email';
import QRCode from '../components/QRCode';
import Referral from '../components/Referral';
import { PageLoginType, PageType } from '../types';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import useEffectOnce from 'hooks/useEffectOnce';
import { checkForCountryCodeCached } from 'model/global';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import NetworkContext from '../context/NetworkContext';
import { NetworkItem } from 'packages/types/types-ca/network';
import { PortkeyConfig, setEndPointUrl } from 'global/constants';
import { NetworkList } from '@portkey-wallet/constants/constants-ca/network-mainnet';

const scrollViewProps = { extraHeight: 120 };
const safeAreaColor: SafeAreaColorMapKeyUnit[] = ['transparent', 'transparent'];

export default function SignupPortkey() {
  const [loginType, setLoginType] = useState<PageLoginType>(PageLoginType.referral);
  const [currentNetwork, setCurrentNetwork] = useState<NetworkItem | undefined>(undefined);
  const { t } = useLanguage();
  const isMainnet = useMemo(() => {
    return currentNetwork?.networkType === 'MAINNET';
  }, [currentNetwork?.networkType]);
  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.SIGN_UP_ENTRY,
  });
  const loginMap = useMemo(
    () => ({
      [PageLoginType.email]: <Email setLoginType={setLoginType} type={PageType.signup} />,
      [PageLoginType.qrCode]: <QRCode setLoginType={setLoginType} />,
      [PageLoginType.referral]: <Referral setLoginType={setLoginType} type={PageType.signup} />,
    }),
    [],
  );
  useEffectOnce(() => {
    checkForCountryCodeCached();
    loadCurrentNetwork();
  });
  const loadCurrentNetwork = () => {
    PortkeyConfig.endPointUrl().then(url => {
      const network = NetworkList.find(item => item.apiUrl === url) || NetworkList[0];
      setCurrentNetwork(network);
    });
  };

  const onBack = () => {
    if (loginType !== PageLoginType.referral) {
      setLoginType(PageLoginType.referral);
    } else {
      onFinish({
        status: 'cancel',
        data: {},
      });
    }
  };

  const backgroundImage = useMemo(() => {
    if (isIOS) {
      return { uri: 'background' };
    } else {
      return require('../img/background.png');
    }
  }, []);

  const networkContext = {
    currentNetwork: currentNetwork,
    changeCurrentNetwork: (network: NetworkItem) => {
      if (network.apiUrl) {
        setCurrentNetwork(network);
        setEndPointUrl(network.apiUrl);
      }
    },
  };

  return (
    <NetworkContext.Provider value={networkContext}>
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
          <CommonSvg icon="logo-icon" size={pTd(60)} iconStyle={styles.logoIconStyle} color={defaultColors.bg1} />
          <View style={GStyles.center}>
            {!isMainnet && (
              <View style={styles.labelBox}>
                <TextM style={[FontStyles.font11, fonts.mediumFont]}>TEST</TextM>
              </View>
            )}
            <TextXXXL style={[styles.titleStyle, FontStyles.font11]}>{t('Sign up Portkey')}</TextXXXL>
          </View>
          {loginMap[loginType]}
          {/* <SwitchNetwork /> */}
        </PageContainer>
      </ImageBackground>
    </NetworkContext.Provider>
  );
}
