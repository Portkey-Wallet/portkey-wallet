import CommonSwitch from 'components/CommonSwitch';
import { TextM } from 'components/CommonText';
import React, { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

export interface INewUserOnlyProps {
  containerStyle?: StyleProp<ViewStyle>;
  onSwitchChanged?: (selected: boolean) => void;
}
export default function NewUserOnly(props: INewUserOnlyProps) {
  const { onSwitchChanged, containerStyle } = props;
  const [isEnabled, setIsEnabled] = useState(true);
  const styles = getStyles();
  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      onSwitchChanged?.(!previousState);
      return !previousState;
    });
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.textContainer}>
        <TextM style={styles.title}>New Users Only</TextM>
        <CommonSwitch
          style={{ transform: [{ scaleX: 40 / 51 }, { scaleY: 24 / 31 }] }}
          value={isEnabled}
          onValueChange={toggleSwitch}
        />
      </View>
      <Text style={styles.description}>
        Once enabled, only newly registered Portkey users can claim your crypto gift.
      </Text>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.neutralHoverBG,
    borderRadius: pTd(6),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  description: {
    color: theme.colors.textBase2,
    fontSize: pTd(14),
    fontWeight: '400',
  },
}));
