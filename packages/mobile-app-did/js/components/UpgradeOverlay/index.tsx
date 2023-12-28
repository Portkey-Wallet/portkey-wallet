import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { TextTitle, TextM } from 'components/CommonText';
import { View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import upGradeApp from 'assets/image/pngs/upGradeApp.png';
import CommonButton from 'components/CommonButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

export type ShowUpgradeOverlayPropsType = {
  type?: 'dashBoard' | 'chat';
  onDownLoad: () => void;
  onNotNow: () => void;
};

function UpgradeOverlay(props: ShowUpgradeOverlayPropsType) {
  const { type = 'dashBoard', onDownLoad, onNotNow } = props;

  const content = useMemo(() => {
    if (type === 'dashBoard') {
      return (
        <>
          <TextM style={styles.textStyle}>
            {`• Portkey unveiled a fully upgraded version with exciting features like keeping user addresses identical on MainChain and SideChains. We warmly invite you to download it for an enhanced experience.`}
          </TextM>
          <View style={styles.blank} />
          <TextM style={styles.textStyle}>
            {`• If you choose to stick with the current Portkey, rest assured that your accounts and assets will stay safe, yet the services won't receive any further upgrades.`}
          </TextM>
        </>
      );
    }

    return (
      <TextM style={styles.textStyle}>
        {`Portkey unveiled a fully upgraded version with exciting features. The current Portkey will no longer support the chat function, if you want to continue to use this function, please download the upgraded version.`}
      </TextM>
    );
  }, [type]);

  return (
    <View style={styles.alertBox}>
      <Image source={upGradeApp} style={styles.imageWrap} />
      <View style={styles.contentWrap}>
        <TextTitle style={styles.titleStyle}>Portkey Upgraded</TextTitle>
        {content}
        <View style={styles.btnWrap}>
          <CommonButton title="Download" type="primary" onPress={onDownLoad} />
          <CommonButton
            title="Not Now"
            containerStyle={styles.notNowContainerStyle}
            buttonStyle={styles.notNowButtonStyle}
            titleStyle={styles.notNowTitleStyle}
            onPress={onNotNow}
          />
        </View>
      </View>
    </View>
  );
}

export const showUpgradeOverlay = (props: ShowUpgradeOverlayPropsType) => {
  OverlayModal.show(<UpgradeOverlay {...props} />, {
    position: 'center',
  });
};

export default {
  showUpgradeOverlay,
};

export const styles = StyleSheet.create({
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
  },
  imageWrap: {
    width: pTd(328),
    height: pTd(128),
  },
  contentWrap: {
    paddingHorizontal: pTd(24),
    paddingBottom: pTd(16),
    alignItems: 'center',
    width: '100%',
  },
  titleStyle: {
    lineHeight: pTd(22),
    fontSize: pTd(18),
    marginBottom: pTd(16),
  },
  blank: {
    height: pTd(12),
  },
  textStyle: {
    textAlign: 'left',
    lineHeight: pTd(20),
    fontSize: pTd(14),
    color: defaultColors.font3,
  },
  btnWrap: {
    width: '100%',
    marginTop: pTd(24),
  },
  notNowContainerStyle: {
    marginTop: pTd(8),
    backgroundColor: 'white',
  },
  notNowButtonStyle: {
    backgroundColor: 'transparent',
  },
  notNowTitleStyle: {
    color: defaultColors.font4,
  },
});
