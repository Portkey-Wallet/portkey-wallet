import React, { useMemo, useState } from 'react';
import { View, Keyboard, Image } from 'react-native';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import OverlayModal from 'components/OverlayModal';
import CommonToast from 'components/CommonToast';
import { formatImageSize } from '@portkey-wallet/utils/img';

type ShowSendPicProps = {
  uri: string;
  buttons?: ButtonRowProps['buttons'];
  autoClose?: boolean;
  width: number;
  height: number;
};

const maxWidth = pTd(280);

function SendPicBody({ uri, buttons, width, height }: ShowSendPicProps) {
  const [loading, setLoading] = useState(false);

  const pageButtons = useMemo(
    () =>
      buttons?.map(i => ({
        ...i,
        loading: i.type === 'primary' && loading,
        disabled: i.type === 'outline' && loading,
        onPress: async () => {
          try {
            setLoading(true);
            await i.onPress?.();
            OverlayModal.hide();
          } catch (error) {
            CommonToast.fail('Failed to send message');
          } finally {
            setLoading(false);
          }
        },
      })),
    [buttons, loading],
  );
  const imgSize = useMemo(() => formatImageSize({ width, height, maxWidth, maxHeight: maxWidth }), [height, width]);
  return (
    <View style={styles.alertBox}>
      <View style={styles.imgBox}>
        <Image resizeMode="cover" source={{ uri }} style={imgSize} />
      </View>
      <ButtonRow buttons={pageButtons} />
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
  imgBox: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
