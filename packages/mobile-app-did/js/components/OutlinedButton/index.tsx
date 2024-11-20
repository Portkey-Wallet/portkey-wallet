import React from 'react';
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
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={[styles.buttonWrap, buttonWrapStyle]} onPress={onPress}>
        <View style={styles.buttonInnerWrap}>
          <Svg icon={iconName} size={iconName === 'buy' ? pTd(28) : pTd(24)} color={darkColors.bgBase1} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const getStyles = makeStyles(_ => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonWrap: {
    backgroundColor: '#B8E1FF',
    width: pTd(81),
    height: pTd(58),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(1.5),
    borderColor: '#68C3FF',
  },
  buttonInnerWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(4),
    borderColor: '#062A4B',
  },
  title: {
    marginTop: pTd(6),
    fontSize: pTd(14),
    color: darkColors.textBase1,
  },
}));

export default OutlinedButton;
