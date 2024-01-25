import React, { memo, useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextM, TextXXXL } from 'components/CommonText';
import * as Application from 'expo-application';
import MenuItem from '../../components/MenuItem';
import Divider from 'components/Divider';
import navigationService from 'utils/navigationService';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-ca/network';
import { useSocialMediaList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { codePushOperator, parseLabel } from 'utils/update';
import { parseVersion } from 'utils';

const AboutUs = () => {
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

  // todo: change style
  const bottomList = useMemo(
    (): { iconName: IconName; title: string; onPress: () => void }[] => [
      {
        iconName: 'terms',
        title: 'Check for Updates',
        onPress: () => {
          console.log('onPress');
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
      <TextM style={styles.version}>
        {parseVersion([
          `V${Application.nativeApplicationVersion}`,
          Application.nativeBuildVersion,
          parseLabel(codePushOperator.localPackage?.label),
        ])}
      </TextM>
      <View style={styles.btnContainer}>
        {socialMediaList.map((item, index) => (
          <View key={index}>
            <MenuItem
              svgUrl={s3Url && item.svgUrl?.filename_disk ? `${s3Url}/${item.svgUrl.filename_disk}` : ''}
              title={item.title}
              onPress={() => {
                Linking.openURL(item.link);
              }}
            />
            {index !== socialMediaList.length - 1 && <Divider style={styles.dividerStyle} />}
          </View>
        ))}
      </View>

      <View style={styles.btnContainer}>
        {officialList.map((item, index) => (
          <View key={index}>
            <MenuItem icon={item.iconName} title={item.title} onPress={item.onPress} />
            {index !== officialList.length - 1 && <Divider style={styles.dividerStyle} />}
          </View>
        ))}
      </View>

      <View style={styles.btnContainer}>
        {bottomList.map((item, index) => (
          <View key={index}>
            <MenuItem icon={item.iconName} title={item.title} onPress={item.onPress} />
            {index !== bottomList.length - 1 && <Divider style={styles.dividerStyle} />}
          </View>
        ))}
      </View>
    </PageContainer>
  );
};

export default memo(AboutUs);

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
    marginTop: pTd(52),
    marginBottom: pTd(16),
    backgroundColor: defaultColors.bg1,
  },
  version: {
    marginTop: pTd(4),
    fontSize: pTd(14),
    lineHeight: pTd(20),
    color: defaultColors.font3,
    marginBottom: pTd(40),
  },
  btnContainer: {
    backgroundColor: defaultColors.bg1,
    width: '100%',
    borderRadius: pTd(6),
    marginBottom: pTd(16),
  },
  innerBtnWrap: {
    marginBottom: 0,
  },
  dividerStyle: {
    marginVertical: pTd(4),
    marginHorizontal: pTd(16),
  },
});
