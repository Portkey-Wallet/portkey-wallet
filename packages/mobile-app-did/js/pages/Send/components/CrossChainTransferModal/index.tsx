import React, { ReactNode } from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { TextM, TextS, TextTitle } from 'components/CommonText';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';

export type CrossChainTransferModalProps = {
  title?: string;
  address?: string;
  chainType?: string;
  chainId?: string;
  buttons?: ButtonRowProps['buttons'];
};

function CrossChainTransferModal({
  title = 'tips',
  chainType = 'mainchain',
  chainId = 'tDVV',
  address = 'ELF_xxx_AELF',
  buttons = [
    {
      title: 'Confirm',
      type: 'solid',
    },
  ],
}: CrossChainTransferModalProps) {
  const tipsContent1 = `This is the ${chainType} ${chainId} address. After confirming the transfer, the cross-chain transfer will be performed. After the transfer is successful, you need to switch the network to ${chainType} ${chainId} to check the account`;

  const tipsContent2 =
    'You can quickly determine the network to which an address belongs by using the suffix of the address';

  return (
    <View style={styles.alertBox}>
      <TextTitle style={styles.alertTitle}>{title}</TextTitle>
      <TextS style={styles.alertMessage1}>{tipsContent1}</TextS>
      <TextM style={styles.addressBox}>{address}</TextM>
      <Text style={styles.divider} />
      <TextS style={styles.alertMessage2}>{tipsContent2}</TextS>
      <ButtonRow
        style={styles.buttonWrap}
        buttons={buttons?.map(i => ({
          ...i,
          onPress: () => {
            OverlayModal.hide();
            i.onPress?.();
          },
        }))}
      />
    </View>
  );
}

const alert = (props: CrossChainTransferModalProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<CrossChainTransferModal {...props} />, {
    modal: true,
    type: 'zoomOut',
    position: 'center',
  });
};
export default {
  alert,
};

export const styles = StyleSheet.create({
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    paddingBottom: pTd(24),
    paddingTop: pTd(24),
  },
  alertTitle: {
    marginBottom: pTd(16),
  },
  alertMessage1: {
    color: defaultColors.font3,
    lineHeight: pTd(16),
    ...GStyles.marginArg(0, 24, 12),
    textAlign: 'center',
  },
  addressBox: {
    width: pTd(279),
    color: defaultColors.font3,
    fontSize: pTd(14),
    lineHeight: pTd(20),
    borderRadius: pTd(6),
    ...GStyles.marginArg(20, 24, 0),
    ...GStyles.paddingArg(16),
    backgroundColor: defaultColors.bg4,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg7,
    ...GStyles.marginArg(16, 0),
  },
  alertMessage2: {
    width: pTd(279),
    color: defaultColors.font6,
    backgroundColor: defaultColors.bg2,
    borderRadius: pTd(6),
    lineHeight: pTd(16),
    marginLeft: pTd(24),
    marginRight: pTd(24),
    ...GStyles.paddingArg(16),
  },
  buttonWrap: {
    marginLeft: pTd(24),
    marginRight: pTd(24),
  },
});
