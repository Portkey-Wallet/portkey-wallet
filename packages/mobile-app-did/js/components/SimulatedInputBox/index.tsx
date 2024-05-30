import { defaultColors } from 'assets/theme';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { pTd } from 'utils/unit';

interface ISimulatedInputBoxProps {
  placeholder?: string;
  onClickInput?: () => void;
  rightDom?: React.ReactNode;
}

export default function SimulatedInputBox({ placeholder = 'Search', onClickInput, rightDom }: ISimulatedInputBoxProps) {
  return (
    <View style={[styles.wrap, BGStyles.white]}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <Svg icon="search" size={pTd(20)} />
          <TextM style={[FontStyles.font7, styles.content]}>{placeholder}</TextM>
          {rightDom}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  innerInput: {
    height: pTd(36),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(8),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: pTd(24),
    backgroundColor: defaultColors.bg4,
  },
  content: {
    flex: 1,
    marginHorizontal: pTd(8),
  },
});
