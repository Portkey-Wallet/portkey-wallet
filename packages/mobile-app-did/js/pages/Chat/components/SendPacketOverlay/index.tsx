import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import { TextM, TextS } from 'components/CommonText';

type SelectListProps = {
  onPressCallBack: (item: IBookmarkItem) => void;
};

const SendPacketOverlay = (props: SelectListProps) => {
  console.log('props', props);
  return (
    <ModalBody
      title=""
      modalBodyType="bottom"
      bottomButtonGroup={[
        {
          disabled: true,
          title: 'Confirm',
          onPress: () => {
            console.log('ModalBody');
          },
        },
      ]}>
      <TextM style={styles.title}>Portkey Red Packet</TextM>
      <View>
        <Text>Portkey Red Packet</Text>
        <TextM>ELF</TextM>
      </View>
      <TextM>{`≈$ ${12.34}`}</TextM>
      <TextS>Method</TextS>
    </ModalBody>
  );
};

const showSendPacketOverlay = (params: SelectListProps) => {
  console.log(params);
  Keyboard.dismiss();
  OverlayModal.show(<SendPacketOverlay {...params} />, {
    position: 'bottom',
  });
};

export default {
  showSendPacketOverlay,
};

const styles = StyleSheet.create({
  title: {
    width: '100%',
  },
});
