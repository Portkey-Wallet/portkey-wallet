import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';
import { makeStyles } from '@rneui/themed';

export type TOutlinedStyleProps = {
  containerStyle?: StyleProp<ViewStyle>;
  buttonWrapStyle?: StyleProp<ViewStyle>;
};

export type OutlinedButtonProps = {
  onPress: () => void;
  iconName: IconName;
  title: string;
} & TOutlinedStyleProps;

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  iconName,
  title,
  onPress,
  containerStyle,
  buttonWrapStyle,
}: OutlinedButtonProps) => {
  const styles = getStyles();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.buttonWrap, isPressed && styles.buttonPressWrap, buttonWrapStyle]}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}>
        <View style={styles.buttonInnerWrap}>
          <Svg icon={iconName} size={iconName === 'buy' ? pTd(28) : pTd(24)} color={darkColors.bgBase1} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonWrap: {
    backgroundColor: theme.colors.bgBrandDefault,
    width: pTd(81),
    height: pTd(58),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(1.5),
    borderColor: theme.colors.bgBrandSecondary,
  },
  buttonPressWrap: {
    backgroundColor: theme.colors.bgBrandHover,
    borderColor: theme.colors.bgBrandSecondaryHover,
  },
  buttonInnerWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(4),
    borderColor: '#292040',
  },
  title: {
    marginTop: pTd(6),
    fontSize: pTd(14),
    color: darkColors.textBase1,
  },
}));

export default OutlinedButton;
