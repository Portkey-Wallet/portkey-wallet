import React, { useEffect, useState } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Keyboard, StyleSheet } from 'react-native';
// import { defaultColors } from 'assets/theme';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from '../../utils/unit';
import { sleep } from '@portkey-wallet/utils';
import * as Progress from 'react-native-progress';
import { codePushOperator } from '@portkey-wallet/rn-base/utils/update';
import { TextM, TextXL } from '../CommonText';
import Svg from '../Svg';
// import GStyles from 'assets/theme/GStyles';
// import fonts from 'assets/theme/fonts';
import { defaultCss } from '../../theme/default';
import GStyles from '../../theme/GStyles';
import fonts from '../../theme/fonts';

function UpdateBody() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const listener = codePushOperator.addProgressListener(p => {
      setProgress(p.receivedBytes / p.totalBytes);
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={styles.alertBox}>
      <View onTouchEnd={() => OverlayModal.hide()} style={styles.closeWrap}>
        <Svg icon={'close'} size={pTd(12.5)} color={defaultCss.font7} />
      </View>
      <Progress.Circle
        showsText
        size={pTd(60)}
        strokeCap="round"
        thickness={pTd(6)}
        endAngle={0.5}
        progress={progress}
        borderWidth={0}
        unfilledColor={defaultCss.bg18}
        color={defaultCss.bg5}
        textStyle={styles.textStyle}
      />
      <TextXL style={[fonts.mediumFont, GStyles.marginTop(pTd(8))]}>Downloading...</TextXL>
      <TextM style={styles.tips}>You can close the pop-up window and the new version will continue to download.</TextM>
    </View>
  );
}

const show = async () => {
  OverlayModal.hide();
  Keyboard.dismiss();
  OverlayModal.show(<UpdateBody />, {
    // modal: true,
    type: 'zoomOut',
    position: 'center',
  });
  await sleep(300);
};
export default {
  show,
};

export const styles = StyleSheet.create({
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  textStyle: {
    fontSize: pTd(14),
  },
  tips: {
    textAlign: 'center',
    color: defaultCss.font3,
    marginTop: pTd(16),
  },
  closeWrap: {
    width: pTd(20),
    height: pTd(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: pTd(12),
    top: pTd(12),
  },
});
