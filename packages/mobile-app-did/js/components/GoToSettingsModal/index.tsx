import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { TextM, TextXL } from 'components/CommonText';
import portkey_notifications from 'assets/image/pngs/portkey_notifications.png';
import CommonButton from 'components/CommonButton';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';

type GoToSettingsModalType = {
  onClose: () => void;
  onGoToSetting: () => void;
};

const GoToSettingsModal = (props: GoToSettingsModalType) => {
  const { onClose, onGoToSetting } = props;

  return (
    <View style={styles.wrap}>
      <ImageBackground source={portkey_notifications} style={styles.headerImage}>
        <Touchable style={styles.closeWrap} onPress={onClose}>
          <Svg icon="close" size={pTd(12)} color={defaultColors.font7} />
        </Touchable>
      </ImageBackground>
      <TextXL style={styles.headerTitle}>Stay updated on the latest</TextXL>
      <TextM style={styles.content}>
        {'Turn on notifications for timely message updates. You can disable it later in the Settings if needed.'}
      </TextM>
      <CommonButton
        title="Turn on Notifications"
        type="primary"
        containerStyle={styles.buttonWrap}
        onPress={onGoToSetting}
      />
    </View>
  );
};

export const showGoToSettingsModal = (props: GoToSettingsModalType) => {
  OverlayModal.show(<GoToSettingsModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onClose,
  });
};

export default {
  showGoToSettingsModal,
};

export const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  headerImage: {
    width: pTd(375),
    height: pTd(172),
  },
  headerTitle: {
    marginHorizontal: pTd(20),
    marginTop: pTd(24),
    textAlign: 'center',
    ...fonts.mediumFont,
  },
  content: {
    marginHorizontal: pTd(20),
    marginTop: pTd(16),
    textAlign: 'center',
  },
  closeWrap: {
    position: 'absolute',
    right: pTd(12),
    top: pTd(12),
    padding: pTd(4),
  },
  buttonWrap: {
    marginHorizontal: pTd(20),
    marginTop: pTd(34),
    marginBottom: pTd(12),
  },
});
