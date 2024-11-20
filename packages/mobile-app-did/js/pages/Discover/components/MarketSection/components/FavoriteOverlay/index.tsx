import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';

type FavoriteModalType = {
  title: string;
  favorite: boolean;
  onPress: () => void;
};

const FavoriteModal = ({ title, favorite, onPress }: FavoriteModalType) => {
  const handlePress = () => {
    onPress();
    OverlayModal.hide();
  };
  return (
    <ModalBody modalBodyType="bottom" title={title}>
      <Touchable onPress={handlePress} style={styles.rowWrapper}>
        <Svg icon={favorite ? 'collected' : 'collect'} size={20} />
        <TextM style={styles.text}>{favorite ? 'Remove from favorite' : 'Add to favorite'}</TextM>
      </Touchable>
    </ModalBody>
  );
};

export const showFavoriteModal = (props: FavoriteModalType) => {
  OverlayModal.show(<FavoriteModal {...props} />, {
    position: 'bottom',
  });
};

export default {
  showFavoriteModal,
};

const styles = StyleSheet.create({
  container: {},
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    height: pTd(48),
  },
  text: {
    marginLeft: pTd(12),
    color: darkColors.textBase1,
  },
});
