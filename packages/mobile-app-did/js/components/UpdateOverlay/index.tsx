import React, { useEffect, useState } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Keyboard, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { sleep } from '@portkey-wallet/utils';
import * as Progress from 'react-native-progress';
import { codePushOperator } from 'utils/update';

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
      <Progress.Circle
        thickness={4}
        endAngle={0.5}
        showsText
        progress={progress}
        size={pTd(100)}
        borderWidth={0}
        unfilledColor="#F0F1F4"
      />
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
  itemText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    fontSize: pTd(16),
  },
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(16),
    ...fonts.mediumFont,
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
  img: {
    width: pTd(180),
    height: pTd(108),
    marginBottom: pTd(16),
  },
});
