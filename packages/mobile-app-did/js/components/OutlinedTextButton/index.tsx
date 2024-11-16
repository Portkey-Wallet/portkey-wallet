import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { TextStyleType, ViewStyleType } from 'types/styles';

export type OutlinedButtonProps = {
  onPress: () => void;
  iconName?: IconName;
  title: string;
  style?: ViewStyleType;
  textStyle?: TextStyleType;
};

const OutlinedTextButton: React.FC<OutlinedButtonProps> = ({
  iconName,
  title,
  style,
  textStyle,
  onPress,
}: OutlinedButtonProps) => {
  const styles = getStyles();
  return (
    <TouchableOpacity style={[styles.buttonWrap, style]} onPress={onPress}>
      <View style={styles.buttonInnerWrap}>
        {iconName && <Svg icon={iconName} size={pTd(16)} color={styles.iconColor.color} iconStyle={styles.iconStyle} />}
        <Text style={[styles.title, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = makeStyles(theme => ({
  buttonWrap: {
    backgroundColor: theme.colors.bgBrand1,
    // width: '100%',
    height: pTd(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(1.5),
    borderColor: theme.colors.borderBrand2,
  },
  buttonInnerWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(29),
    borderWidth: pTd(5),
    borderColor: '#062A4B',
    flexDirection: 'row',
  },
  title: {
    fontSize: pTd(14),
    color: theme.colors.textNeutral4,
  },
  iconColor: {
    color: theme.colors.iconNeutral4,
  },
  iconStyle: {
    marginRight: pTd(8),
  },
}));

export default OutlinedTextButton;
