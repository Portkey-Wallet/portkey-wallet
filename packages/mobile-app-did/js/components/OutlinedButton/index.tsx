import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';

export type OutlinedButtonProps = {
  onPress: () => void;
  iconName: IconName;
  title: string;
};

const OutlinedButton: React.FC<OutlinedButtonProps> = ({ iconName, title, onPress }: OutlinedButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonWrap} onPress={onPress}>
        <View style={styles.buttonInnerWrap}>
          <Svg icon={iconName} size={pTd(24)} iconStyle={styles.icon} />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonWrap: {
    backgroundColor: '#B8E1FF',
    width: pTd(84),
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
    borderWidth: pTd(5),
    borderColor: '#062A4B',
  },
  icon: {
    width: pTd(24),
    height: pTd(24),
  },
  title: {
    marginTop: pTd(6),
    fontSize: pTd(14),
    color: darkColors.textBase1,
  },
});

export default OutlinedButton;
