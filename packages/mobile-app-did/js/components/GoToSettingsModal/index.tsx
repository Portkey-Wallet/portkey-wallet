import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, ImageBackground } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { TextM, TextXL } from 'components/CommonText';
import portkey_notifications from 'assets/image/pngs/portkey_notifications.png';
import permissions from 'react-native-permissions';

const GoToSettingsModal = () => {
  return (
    <ModalBody
      modalBodyType="bottom"
      title=""
      bottomButtonGroup={[
        {
          title: 'Stay updated on the latest',
          type: 'primary',
          onPress: () => {
            permissions.openSettings();
          },
        },
      ]}>
      <ImageBackground source={{ uri: portkey_notifications }} />
      <TextXL>Stay updated on the latest</TextXL>
      <TextM>
        Turn on notifications for timely message updates. You can disable it later in the Settings if needed.
      </TextM>
    </ModalBody>
  );
};

export const showGoToSettingsModal = () => {
  OverlayModal.show(<GoToSettingsModal />, {
    position: 'bottom',
  });
};

export default {
  showGoToSettingsModal,
};

export const styles = StyleSheet.create({});
