import { darkColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { pTd } from 'utils/unit';
import CommonInput from 'components/CommonInput';

interface ISimulatedInputBoxProps {
  placeholder?: string;
  onClickInput?: () => void;
  rightDom?: React.ReactNode;
}

{
  /* <CommonInput
autoFocus
grayBorder
theme="black-bg"
ref={iptRef}
value={value}
onChangeText={v => setValue(v)}
onSubmitEditing={onSearch}
returnKeyType="search"
placeholder={t('Search Dapp or enter URL')}
containerStyle={styles.inputStyle}
rightIcon={
  value ? (
    <Touchable onPress={clearText}>
      <Svg icon="clear3" size={pTd(16)} />
    </Touchable>
  ) : undefined
}
rightIconContainerStyle={styles.rightIconContainerStyle}
style={styles.rnInputStyle}
/> */
}

export default function SimulatedInputBox({
  placeholder = 'dApps, Sites, URL',
  onClickInput,
}: ISimulatedInputBoxProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: 'transparent' }]}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <TextM style={[FontStyles.font7, styles.content]}>{placeholder}</TextM>
          {/* {rightDom} */}
          <Svg icon="search" size={pTd(20)} color="#FFF" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export function SimulatedInput({ placeholder = 'dApps, Sites, URL', onClickInput }: ISimulatedInputBoxProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: 'transparent' }]}>
      <TouchableWithoutFeedback onPress={() => onClickInput?.()}>
        <View style={styles.innerInput}>
          <CommonInput
            autoFocus
            grayBorder
            theme="black-bg"
            // ref={iptRef}
            // value={value}
            // onChangeText={v => setValue(v)}
            // onSubmitEditing={onSearch}
            returnKeyType="search"
            placeholder={placeholder}
            containerStyle={{
              backgroundColor: darkColors.bgBase1,
              height: pTd(20),
            }}
            // rightIcon={
            //   value ? (
            //     <Touchable onPress={clearText}>
            //       <Svg icon="clear3" size={pTd(16)} />
            //     </Touchable>
            //   ) : undefined
            // }
            rightIconContainerStyle={{}}
            style={{
              // backgroundColor: defaultColors.white,
              height: pTd(20),
            }}
          />
          {/* <TextM style={[FontStyles.font7, styles.content]}>{placeholder}</TextM> */}
          {/* {rightDom} */}
          <Svg icon="search" size={pTd(20)} color="#FFF" />
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
    backgroundColor: darkColors.bgBase1,
    borderWidth: pTd(1),
    borderColor: darkColors.borderBase1,
  },
  content: {
    flex: 1,
    marginHorizontal: pTd(8),
  },
});
