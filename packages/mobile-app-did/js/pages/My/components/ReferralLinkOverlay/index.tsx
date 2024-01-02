import { StyleSheet, Keyboard, View, ImageBackground } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import React from 'react';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { copyText } from 'utils';
import Svg from 'components/Svg';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import shareButton from 'assets/image/pngs/shareButton.png';

function ReferralLinkOverlay({ linkUrl }: { linkUrl: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <TextL style={[fonts.mediumFont, GStyles.marginRight(pTd(24)), styles.title]}>Referral Link</TextL>
        <TextM numberOfLines={1} style={styles.link}>
          {linkUrl}
        </TextM>
        <Touchable onPress={() => copyText(linkUrl)}>
          <Svg icon="copy3" size={pTd(16)} color={defaultColors.font5} />
        </Touchable>
      </View>
      <ImageBackground source={shareButton} style={styles.btn} />
    </View>
  );
}

export const showReferralLinkOverlay = (linkUrl: string) => {
  Keyboard.dismiss();
  OverlayModal.show(<ReferralLinkOverlay linkUrl={linkUrl} />, {
    position: 'bottom',
  });
};

export default {
  showReferralLinkOverlay,
};

const styles = StyleSheet.create({
  wrap: {
    paddingTop: pTd(24),
    paddingHorizontal: pTd(20),
    width: screenWidth,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: defaultColors.font5,
  },
  link: {
    flex: 1,
    paddingRight: pTd(8),
    color: defaultColors.font3,
  },
  btn: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    width: pTd(335),
    height: pTd(48),
  },
});
