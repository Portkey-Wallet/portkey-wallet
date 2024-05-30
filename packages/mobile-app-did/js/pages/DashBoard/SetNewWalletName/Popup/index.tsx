import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import CommonToast from 'components/CommonToast';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';

interface SetNewWalletNamePopupProps {
  onCancel: () => void;
  onSetNewWalletName: () => void;
}

const SetNewWalletNamePopupComponent: React.FC<SetNewWalletNamePopupProps> = ({ onCancel, onSetNewWalletName }) => {
  const onPressCancel = useCallback(() => {
    OverlayModal.hide(false);
    onCancel && onCancel();
  }, [onCancel]);

  const onPressSet = useCallback(() => {
    onSetNewWalletName && onSetNewWalletName();
    OverlayModal.hide(false);
  }, [onSetNewWalletName]);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.titleText}>Set a Name for Your Wallet</Text>
        <Text style={styles.descText}>
          You can set your login account as your wallet name to make your wallet customised and recongnisable.
        </Text>
        <TouchableOpacity style={styles.setButton} onPress={onPressSet}>
          <Text style={styles.setText}>Use Login Account as Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onPressCancel}>
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

const showSetNewWalletNamePopup = (props: SetNewWalletNamePopupProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SetNewWalletNamePopupComponent {...props} />, {
    position: 'center',
    animated: false,
    containerStyle: { width: '100%' },
    onCloseRequest: props.onCancel,
  });
};

export const SetNewWalletNamePopup: React.FC = () => {
  const { shouldShowSetNewWalletNameModal, handleSetNewWalletName, handleCancelSetNewWalletNameModal } =
    useSetNewWalletName();
  const onSetNewWalletName = useCallback(async () => {
    try {
      await handleSetNewWalletName();
      CommonToast.success('Set Success');
    } catch (error) {
      CommonToast.failError(error);
    }
  }, [handleSetNewWalletName]);

  useEffect(() => {
    if (shouldShowSetNewWalletNameModal) {
      showSetNewWalletNamePopup({
        onCancel: handleCancelSetNewWalletNameModal,
        onSetNewWalletName: onSetNewWalletName,
      });
    }
  }, [handleCancelSetNewWalletNameModal, handleSetNewWalletName, onSetNewWalletName, shouldShowSetNewWalletNameModal]);
  return <View />;
};
