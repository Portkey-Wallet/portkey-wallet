import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, Text, View } from 'react-native';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
// @ts-expect-error: Importing makeStyles from @rneui/themed
import { makeStyles } from '@rneui/themed';
import ExchangeIcons from 'components/ExchangeIcons';
import fonts from 'assets/theme/fonts';

type ReceiveFromExchangeModalProps = {
  onPress: (isExchange: boolean) => void;
};

const ReceiveFromExchangeModal = ({ onPress }: ReceiveFromExchangeModalProps) => {
  const styles = getStyles();

  return (
    <ModalBody title={'Receive from an exchange?'} modalBodyType="bottom">
      <View style={styles.wrap}>
        <ExchangeIcons style={styles.icons} />
        <Text style={styles.reminderText}>
          Exchanges have a unique address for sending and receiving using the aelf network.
        </Text>
        <Touchable
          style={styles.positiveButton}
          onPress={() => {
            onPress(true);
            OverlayModal.hide();
          }}>
          <Text style={styles.positiveText}>Yes, receive from an exchange</Text>
        </Touchable>
        <Touchable
          style={styles.negativeButton}
          onPress={() => {
            onPress(false);
            OverlayModal.hide();
          }}>
          <Text style={styles.negativeText}>No, from a non-exchange address</Text>
        </Touchable>
      </View>
    </ModalBody>
  );
};

const showReminder = (params: ReceiveFromExchangeModalProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<ReceiveFromExchangeModal {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList: showReminder,
};

const getStyles = makeStyles((theme: any) => ({
  wrap: {
    marginLeft: pTd(16),
    marginRight: pTd(16),
  },
  icons: {
    marginTop: pTd(12),
  },
  reminderText: {
    marginTop: pTd(12),
    fontSize: pTd(16),
    color: theme.colors.textBase2,
  },
  positiveButton: {
    marginTop: pTd(24),
    height: pTd(48),
    backgroundColor: theme.colors.bgBrand1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(24),
  },
  positiveText: {
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    color: theme.colors.textBrand4,
  },
  negativeButton: {
    marginTop: pTd(16),
    marginBottom: pTd(14),
    height: pTd(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(24),
    borderWidth: pTd(1.5),
    borderColor: theme.colors.borderNeutral2,
  },
  negativeText: {
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
}));
