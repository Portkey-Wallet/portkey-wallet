import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { pTd } from 'utils/unit';

interface ISimulatedInputBoxProps {
  placeholder?: string;
  onClickInput?: () => void;
}

export default function SimulatedInputBox({
  placeholder = 'Search Dapp or enter URL',
  onClickInput,
}: ISimulatedInputBoxProps) {
  return (
    <View style={[styles.wrap, BGStyles.bg5]}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <Svg icon="search" size={pTd(16)} />
          <TextM style={[FontStyles.font7, styles.content]}>{placeholder}</TextM>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    ...GStyles.paddingArg(8, 20),
  },
  innerInput: {
    height: pTd(36),
    ...GStyles.paddingArg(7, 17),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg4,
  },
  content: {
    marginLeft: pTd(8),
  },
});
