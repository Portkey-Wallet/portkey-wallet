import { darkColors } from 'assets/theme';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { pTd } from 'utils/unit';
import CommonInput from 'components/CommonInput';
import { makeStyles } from '@rneui/themed';

interface ISimulatedInputBoxProps {
  placeholder?: string;
  onClickInput?: () => void;
  rightDom?: React.ReactNode;
}

export default function SimulatedInputBox({
  placeholder = 'dApps, Sites, URL',
  onClickInput,
}: ISimulatedInputBoxProps) {
  const styles = getStyles();

  return (
    <View style={styles.wrap}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <TextL style={styles.inputPreview}>{placeholder}</TextL>
          <Svg icon="search" size={pTd(16)} color="#FFF" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export function SimulatedInput({ placeholder = 'dApps, Sites, URL', onClickInput }: ISimulatedInputBoxProps) {
  const styles = getStyles();

  return (
    <View style={styles.wrap}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <CommonInput
            autoFocus
            grayBorder
            theme="black-bg"
            returnKeyType="search"
            placeholder={placeholder}
            containerStyle={{
              backgroundColor: darkColors.bgBase1,
              height: pTd(20),
            }}
            rightIconContainerStyle={{}}
            style={{
              height: pTd(20),
            }}
          />
          <Svg icon="search" size={pTd(16)} color="#FFF" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  wrap: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputPreview: {
    color: theme.colors.textBase3,
    flex: 1,
    lineHeight: pTd(20),
  },
  innerInput: {
    height: pTd(40),
    paddingHorizontal: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: pTd(20),
    backgroundColor: theme.colors.bgBase1,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
}));
