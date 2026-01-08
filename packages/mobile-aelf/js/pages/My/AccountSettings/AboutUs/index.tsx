import React, { memo, useMemo } from 'react';
import { Linking, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { TextM, TextTitle } from 'components/CommonText';
import * as Application from 'expo-application';
import MenuItem, { IMenuItemProps } from '../../components/MenuItem';
import Divider from 'components/Divider';
import navigationService from 'utils/navigationService';
import { OfficialWebsite } from '@portkey-wallet/constants/constants-eoa/network';
import { makeStyles } from '@rneui/themed';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import { useSocialMediaList } from '@portkey-wallet/hooks/hooks-eoa/cms';
import { darkColors } from 'assets/theme';

const AboutUs = () => {
  const { t } = useLanguage();
  const socialMediaList = useSocialMediaList();
  const styles = getStyles();

  const officialList = useMemo(
    (): IMenuItemProps[] => [
      {
        icon: 'terms',
        title: 'Terms of Service',
        onPress: () => {
          navigationService.navigate('ViewOnWebView', {
            title: 'Terms of Service',
            url: `${OfficialWebsite}/terms-of-service`,
          });
        },
      },
      {
        icon: 'privacy-policy',
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
      titleDom={t('About FairyVault')}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageContainer}
      scrollViewProps={{ disabled: false }}>
      <View style={styles.logoWrap}>
        <Svg icon="app-logo-new" size={pTd(80)} />
      </View>
      <TextTitle style={[fonts.BGMediumFont]}>{t('FairyVault Wallet')}</TextTitle>
      <TextM style={[styles.version, FontStyles.font7]}>{`v${Application.nativeApplicationVersion}`}</TextM>
      <View style={styles.btnContainer}>
        {socialMediaList.map((item, index) => (
          <View key={index}>
            <MenuItem
              style={styles.menuItem}
              arrowSize={12}
              arrowColor={darkColors.iconNeutral3}
              // svgUrl={s3Url && item.svgUrl?.filename_disk ? `${s3Url}/${item.svgUrl.filename_disk}` : ''}
              title={item.title}
              onPress={() => {
                Linking.openURL(item.link);
              }}
            />
          </View>
        ))}
        <Divider style={styles.dividerStyle} />
      </View>

      <View style={styles.btnContainer}>
        {officialList.map((item, index) => (
          <View key={index}>
            <MenuItem
              title={item.title}
              arrowColor={darkColors.iconNeutral3}
              arrowSize={12}
              onPress={item.onPress}
              style={styles.menuItem}
            />
          </View>
        ))}
      </View>
    </PageContainer>
  );
};

export default memo(AboutUs);

const getStyles = makeStyles(theme => ({
  pageContainer: {
    backgroundColor: theme.colors.bg6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: pTd(16),
  },
  logoWrap: {
    width: pTd(80),
    height: pTd(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(16),
    marginTop: pTd(32),
    marginBottom: pTd(16),
    overflow: 'hidden',
  },
  version: {
    marginTop: pTd(4),
    marginBottom: pTd(32),
  },
  btnContainer: {
    backgroundColor: theme.colors.bg6,
    width: '100%',
    marginBottom: pTd(16),
  },
  menuItem: {
    paddingVertical: pTd(16),
    paddingHorizontal: pTd(0),
    backgroundColor: theme.colors.bg6,
  },
  innerBtnWrap: {
    marginBottom: 0,
  },
  dividerStyle: {
    // marginVertical: pTd(12),
    marginTop: pTd(12),
    // marginHorizontal: pTd(16),
  },
}));
