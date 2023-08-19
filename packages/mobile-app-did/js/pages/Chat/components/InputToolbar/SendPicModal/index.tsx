import React from 'react';
import { View, Keyboard, Image } from 'react-native';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal from 'components/OverlayModal';

type ShowSendPicProps = {
  uri: string;
  buttons?: ButtonRowProps['buttons'];
  autoClose?: boolean;
};

function SendPicBody({ uri, buttons, autoClose = true }: ShowSendPicProps) {
  return (
    <View style={styles.alertBox}>
      <Image resizeMode="contain" source={{ uri }} style={styles.imagePreview} />
      <ButtonRow
        buttons={buttons?.map(i => ({
          ...i,
          onPress: () => {
            if (autoClose) OverlayModal.hide();
            i.onPress?.();
          },
        }))}
      />
    </View>
  );
}

const showSendPic = (props: ShowSendPicProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SendPicBody {...props} />, {
    modal: true,
    type: 'zoomOut',
    position: 'center',
  });
};
export default {
  showSendPic,
};

export const styles = StyleSheet.create({
  sheetBox: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  itemText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  itemBox: {
    width: '100%',
    paddingVertical: 15,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: defaultColors.border1,
  },
  cancelText: {
    fontSize: 16,
  },
  cancelBox: {
    width: '100%',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  imagePreview: {
    width: pTd(280),
    height: pTd(280),
  },
});
