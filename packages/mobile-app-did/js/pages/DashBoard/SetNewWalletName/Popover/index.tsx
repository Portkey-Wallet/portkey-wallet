import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';

const SetNewWalletNamePopover: React.FC = () => {
  const onDismiss = useCallback(() => {
    OverlayModal.hide();
  }, []);

  const onSetNewWalletName = useCallback(() => {
    console.log('set new wallet name');
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDismiss}>
        <Svg
          icon="close2"
          size={pTd(14)}
          iconStyle={styles.closeImage}
          color={defaultColors.neutralSecondaryTextColor}
        />
      </TouchableOpacity>
      <Text style={styles.text} numberOfLines={0}>
        Set your login account as your wallet name to make your wallet customised and recongnisable.
      </Text>
      <TouchableOpacity onPress={onSetNewWalletName}>
        <Text style={styles.buttonText}>Set Wallet Name</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    marginLeft: 50,
    width: pTd(224),
    backgroundColor: defaultColors.white,
    borderRadius: pTd(6),
    shadowColor: defaultColors.shadow1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 2,
  },
  closeImage: {
    position: 'absolute',
    right: pTd(8),
    top: pTd(12),
  },
  text: {
    marginLeft: pTd(16),
    marginRight: pTd(30),
    marginTop: pTd(12),
    fontSize: pTd(12),
    color: defaultColors.neutralSecondaryTextColor,
  },
  buttonText: {
    lineHeight: pTd(22),
    marginLeft: pTd(16),
    marginTop: pTd(8),
    marginBottom: pTd(12),
    fontSize: pTd(14),
    color: defaultColors.primaryColor,
  },
});

export const showSetNewWalletNamePopover = () => {
  OverlayModal.show(<SetNewWalletNamePopover />, {
    customBounds: {
      height: 0,
      width: 0,
      x: 272,
      y: 204,
    },
    overlayOpacity: 0,
    containerStyle: {},
    style: { backgroundColor: 'transparent' },
    animated: false,
  });
};
