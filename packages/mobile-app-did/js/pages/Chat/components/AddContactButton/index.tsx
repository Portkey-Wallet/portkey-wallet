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
  onPressButton?: () => void;
};

export default function AddContactButton(props: AddContactButtonPropsType) {
  const { onPressButton } = props;
  const [isShow, setIsShow] = useState(true);

  if (!isShow) return null;

  return (
    <Touchable
      style={[GStyles.flexRow, GStyles.flexCenter, GStyles.itemCenter, styles.wrap]}
      onPress={() => onPressButton?.()}>
      <Svg size={pTd(20)} icon="chat-find-more" color={defaultColors.font4} />
      <TextM style={[FontStyles.font4, GStyles.marginLeft(pTd(16))]}>Add Contact</TextM>
      <Touchable style={[GStyles.flexRow, GStyles.center, styles.closeIconWrap]} onPress={() => setIsShow(false)}>
        <Svg size={pTd(10)} icon="close" color={defaultColors.icon1} />
      </Touchable>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
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
    right: pTd(19),
    top: pTd(19),
  },
});
