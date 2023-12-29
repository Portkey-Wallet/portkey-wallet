import React, { memo, useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextM, TextXXXL } from 'components/CommonText';
import * as Application from 'expo-application';
import Divider from 'components/Divider';
import navigationService from 'utils/navigationService';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { useSocialMediaList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';

const UserReferral = () => {
  const { t } = useLanguage();
  const socialMediaList = useSocialMediaList();
  const { s3Url } = useCurrentNetworkInfo();

  const officialList = useMemo(
    (): { iconName: IconName; title: string; onPress: () => void }[] => [
      {
        iconName: 'terms',
        title: 'Terms of Service',
        onPress: () => {
          navigationService.navigate('ViewOnWebView', {
            title: 'Terms of Service',
            url: `${OfficialWebsite}/terms-of-service`,
          });
        },
      },
      {
        iconName: 'privacy-policy',
        title: 'Privacy Policy',
        onPress: () => {
          navigationService.navigate('ViewOnWebView', {
            title: 'Privacy Policy',
            url: `${OfficialWebsite}/privacy-policy`,
          });
        },
      },
    ],
    [],
  );

  return (
    <PageContainer
      titleDom={t('About Us')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageContainer}
      scrollViewProps={{ disabled: false }}>
      <View style={styles.logoWrap}>
        <Svg icon="app-blue-logo" oblongSize={[pTd(48.89), pTd(48.89)]} />
      </View>
      <TextXXXL>Portkey</TextXXXL>
      <TextM style={styles.version}>{`V${Application.nativeApplicationVersion}`}</TextM>
    </PageContainer>
  );
};

export default memo(UserReferral);

export const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: defaultColors.bg4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: pTd(20),
  },
  logoWrap: {
    width: pTd(80),
    height: pTd(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(16),
    borderWidth: 1,
    borderColor: defaultColors.border6,
    marginTop: pTd(48),
    marginBottom: pTd(16),
    backgroundColor: defaultColors.bg1,
  },
  version: {
    marginTop: pTd(8),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    color: defaultColors.font3,
    marginBottom: pTd(48),
  },
  btnContainer: {
    backgroundColor: defaultColors.bg1,
    width: '100%',
    borderRadius: pTd(6),
    marginBottom: pTd(24),
  },
  innerBtnWrap: {
    marginBottom: 0,
  },
  dividerStyle: {
    marginVertical: pTd(4),
    marginHorizontal: pTd(16),
  },
});
