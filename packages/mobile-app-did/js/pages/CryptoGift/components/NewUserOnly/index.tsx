import { defaultColors } from 'assets/theme';
import CommonSwitch from 'components/CommonSwitch';
import { TextM } from 'components/CommonText';
import Switch from 'components/Switch';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
export interface INewUserOnlyProps {
  onSwitchChanged?: (selected: boolean) => void;
}
export default function NewUserOnly(props: INewUserOnlyProps) {
  const { onSwitchChanged } = props;
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      onSwitchChanged?.(!previousState);
      return !previousState;
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <TextM style={styles.title}>New Users Only</TextM>
        <Text style={styles.description}>
          Once enabled, only newly registered Portkey users can claim your crypto gift.
        </Text>
      </View>
      {/* <View style={styles.switchContainer}>
        <View style={styles.switchBackground}>
          <View style={styles.switchKnob} />
        </View>
      </View> */}
      <CommonSwitch
        style={{ transform: [{ scaleX: 32 / 51 }, { scaleY: 20 / 31 }] }}
        value={isEnabled}
        onValueChange={toggleSwitch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: pTd(74),
    padding: pTd(12),
    backgroundColor: defaultColors.neutralHoverBG,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: defaultColors.neutralSecondaryTextColor,
    lineHeight: pTd(22),
  },
  description: {
    color: defaultColors.neutralTertiaryText,
    fontSize: pTd(12),
    fontWeight: '400',
    lineHeight: pTd(16),
  },
  switchContainer: {
    paddingTop: 1,
    paddingBottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBackground: {
    width: pTd(32),
    height: pTd(20),
    backgroundColor: '#5D42FF',
    borderRadius: pTd(10),
  },
  switchKnob: {
    width: pTd(16),
    height: pTd(16),
    position: 'absolute',
    right: pTd(2),
    top: pTd(2),
    backgroundColor: defaultColors.neutralDefaultBG,
    borderRadius: 9999,
  },
});
