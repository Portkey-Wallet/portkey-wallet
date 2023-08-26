import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';

import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';

type ProfileHandleSectionPropsType = {
  isAdded?: boolean;
  onPressAdded: () => void;
  onPressChat: () => void;
};

const ProfileHandleSection: React.FC<ProfileHandleSectionPropsType> = props => {
  const { isAdded, onPressAdded, onPressChat } = props;

  const handleList = useMemo((): {
    disabled?: boolean;
    label: string;
    color: string;
    colorStyle: { color: string };
    icon: IconName;
    onPress: () => void;
  }[] => {
    return [
      {
        disabled: isAdded,
        label: isAdded ? 'Added' : 'Add Contact',
        color: isAdded ? defaultColors.font7 : defaultColors.font4,
        colorStyle: isAdded ? FontStyles.font7 : FontStyles.font4,
        icon: isAdded ? 'chat-added' : 'chat-add-contact',
        onPress: () => {
          if (isAdded) return;
          onPressAdded();
        },
      },
      {
        disabled: false,
        label: 'Chat',
        color: defaultColors.font4,
        colorStyle: FontStyles.font4,
        icon: 'chat-chat',
        onPress: onPressChat,
      },
    ];
  }, [isAdded, onPressAdded, onPressChat]);

  return (
    <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.wrap]}>
      {handleList.map((ele, index) => (
        <Touchable disabled={ele.disabled} key={index} style={[GStyles.center, styles.itemWrap]} onPress={ele.onPress}>
          <Svg icon={ele.icon} size={pTd(24)} color={ele.color} />
          <TextM style={[GStyles.marginTop(4), ele.colorStyle]}>{ele.label}</TextM>
        </Touchable>
      ))}
    </View>
  );
};

export default memo(ProfileHandleSection);

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: pTd(24),
  },
  itemWrap: {
    width: pTd(163.5),
    padding: pTd(8),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  content: {
    marginBottom: pTd(8),
  },
  address: {
    width: pTd(270),
    color: defaultColors.font5,
  },
});
