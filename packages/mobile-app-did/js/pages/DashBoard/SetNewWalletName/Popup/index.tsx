import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';

const SetNewWalletNamePopupComponent: React.FC = () => {
  const onCancel = useCallback(() => {
    OverlayModal.hide(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.titleText}>Set a Name for Your Wallet</Text>
        <Text style={styles.descText}>
          You can set your login account as your wallet name to make your wallet customised and recongnisable.
        </Text>
        <TouchableOpacity style={styles.setButton}>
          <Text style={styles.setText}>Set Wallet Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
  },
  wrap: {
    marginHorizontal: pTd(24),
    backgroundColor: defaultColors.white,
    alignItems: 'center',
    borderRadius: pTd(8),
    paddingHorizontal: pTd(24),
  },
  titleText: {
    marginTop: pTd(24),
    fontSize: pTd(18),
    color: defaultColors.neutralPrimaryTextColor,
    ...fonts.mediumFont,
  },
  descText: {
    marginTop: pTd(16),
    fontSize: pTd(14),
    color: defaultColors.neutralSecondaryTextColor,
    textAlign: 'center',
  },
  setButton: {
    marginTop: pTd(24),
    width: '100%',
    height: pTd(40),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setText: {
    fontSize: pTd(14),
    color: defaultColors.white,
    ...fonts.mediumFont,
  },
  cancelButton: {
    marginTop: pTd(8),
    marginBottom: pTd(8),
    width: '100%',
    height: pTd(40),
    borderRadius: pTd(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: pTd(14),
    color: defaultColors.neutralPrimaryTextColor,
    ...fonts.mediumFont,
  },
});

const showSetNewWalletNamePopup = () => {
  Keyboard.dismiss();
  OverlayModal.show(<SetNewWalletNamePopupComponent />, {
    position: 'center',
    animated: false,
    containerStyle: { width: '100%' },
  });
};

export const SetNewWalletNamePopup: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (show) return;
    showSetNewWalletNamePopup();
    setShow(true);
  }, [show]);
  return <View />;
};
