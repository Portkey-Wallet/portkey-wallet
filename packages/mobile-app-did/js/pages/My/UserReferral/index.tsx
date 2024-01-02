import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { TextXXXL } from 'components/CommonText';
import inviteFriendButton from 'assets/image/pngs/inviteFriendButton.png';
import { showReferralLinkOverlay } from '../components/ReferralLinkOverlay';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import GStyles from 'assets/theme/GStyles';

const UserReferral = () => {
  const { t } = useLanguage();

  Touchable;

  return (
    <PageContainer
      hideHeader
      titleDom={t('About Us')}
      safeAreaColor={['transparent', 'transparent']}
      containerStyles={styles.pageContainer}
      scrollViewProps={{ disabled: false }}>
      <View style={styles.logoWrap}>
        <Touchable onPress={navigationService.goBack}>
          <Svg icon="app-blue-logo" oblongSize={[pTd(48.89), pTd(48.89)]} />
        </Touchable>
        <TextXXXL style={GStyles.flex1}>Portkey Referral</TextXXXL>
        <View />
      </View>
      <Touchable onPress={() => showReferralLinkOverlay('linkUrl')}>
        <ImageBackground source={inviteFriendButton} style={styles.btn} />
      </Touchable>
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
  btn: {
    width: pTd(335),
    height: pTd(48),
  },
});
