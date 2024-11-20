import React from 'react';
import ActionSheet from 'components/ActionSheet';
import { TextM } from 'components/CommonText';
import { openOutLink } from 'utils/link';
import { darkColors } from 'assets/theme';
import { StyleSheet } from 'react-native';

const EBRIDGE_DOC_URL =
  'https://doc.portkey.finance/docs/What-is-eBridge-and-how-does-it-facilitate-cross-chain-transfers-in-Portkey';

export const eBridgeWaringShow = (props: { cancel: () => void; confirm: () => void }) => {
  const { confirm, cancel } = props;

  ActionSheet.alert({
    autoClose: false,
    showInfoIcon: true,
    title: 'Confirm transfer with eBridge',
    message: (
      <TextM>
        To protect your assets, this transfer will be processed via eBridge, a 3rd-party decentralized platform.{' '}
        <TextM
          onPress={async () => {
            await openOutLink(EBRIDGE_DOC_URL);
          }}
          style={styles.text}>
          Learn more
        </TextM>
      </TextM>
    ),
    buttons: [
      {
        title: 'Agree and continue',
        onPress: confirm,
      },
    ],
    closeAction: cancel,
  });
};

export const styles = StyleSheet.create({
  text: {
    color: darkColors.textBrand1,
  },
});
