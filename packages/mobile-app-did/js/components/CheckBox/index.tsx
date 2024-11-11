import React from 'react';
import { Text, ViewStyle, TextStyle } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import Touchable from 'components/Touchable';
interface CheckBoxProps {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  checkedColor?: string;
  uncheckedColor?: string;
  labelStyle?: TextStyle | TextStyle[];
  boxStyle?: ViewStyle | ViewStyle[];
}
const CheckBox = ({ label = '', checked, onChange, labelStyle = {}, boxStyle = {} }: CheckBoxProps) => {
  const styles = getStyles();
  const onPress = () => {
    if (onChange) {
      onChange(!checked);
    }
  };
  return (
    <Touchable style={[styles.container, boxStyle]} onPress={onPress}>
      <Svg size={pTd(16)} icon={checked ? 'checkbox-Checked' : 'checkbox'} />
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </Touchable>
  );
};

const getStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.textBase1,
  },
  label: {
    color: theme.colors.textBase1,
  },
}));

export default CheckBox;
