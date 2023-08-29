import React, { useState } from 'react';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

type AddContactButtonPropsType = {
  isStranger?: boolean;
  onPressButton?: () => void;
};

export default function AddContactButton(props: AddContactButtonPropsType) {
  const { isStranger, onPressButton } = props;
  const [clickClose, setClickClose] = useState(false);

  if (!isStranger || (isStranger && clickClose)) return null;

  return (
    <Touchable
      activeOpacity={0.9}
      style={[GStyles.flexRow, GStyles.flexCenter, GStyles.itemCenter, styles.wrap]}
      onPress={onPressButton}>
      <Svg size={pTd(20)} icon="chat-add-contact" color={defaultColors.font4} />
      <TextM style={[FontStyles.font4, GStyles.marginLeft(pTd(14))]}>Add Contact</TextM>
      <Touchable style={[GStyles.center, styles.closeIconWrap]} onPress={() => setClickClose(true)}>
        <Svg size={pTd(10)} icon="close" color={defaultColors.icon1} />
      </Touchable>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 100,
    width: screenWidth,
    backgroundColor: defaultColors.bg1,
    height: pTd(48),
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: defaultColors.shadow1,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  closeIconWrap: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: pTd(60),
    height: pTd(48),
  },
});
