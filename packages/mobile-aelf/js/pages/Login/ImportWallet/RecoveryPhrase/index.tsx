import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';

export default function RecoveryPhrase() {
  const styles = getStyles();
  const { theme } = useTheme();
  const [mnemonics, setMnemonics] = useState(Array(12).fill(''));

  const isMnemonicsEmpty = useMemo(() => {
    return mnemonics.every(mnemonic => mnemonic === '');
  }, [mnemonics]);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const newMnemonics = [...mnemonics];
      newMnemonics[index] = text;
      setMnemonics(newMnemonics);
    },
    [mnemonics, setMnemonics],
  );

  const inputWidth = useMemo(() => {
    return (screenWidth - pTd(16) * 3) / 2;
  }, []);

  const pasteButton = useMemo(() => {
    return (
      <Touchable style={styles.button}>
        <Svg icon="paste" size={pTd(20)} />
        <Text style={styles.buttonText}>Paste from clipboard</Text>
      </Touchable>
    );
  }, []);
  const clearButton = useMemo(() => {
    return (
      <Touchable style={styles.button}>
        <Svg icon="clear2" size={pTd(16)} color={theme.colors.iconBase2} />
        <Text style={styles.buttonText}>Clear</Text>
      </Touchable>
    );
  }, []);

  return (
    <View style={styles.flex}>
      <View style={styles.mnemonicsWrap}>
        {mnemonics.map((mnemonic, index) => (
          <View
            style={[
              styles.inputWrap,
              { width: inputWidth },
              index % 2 === 1 && styles.inputMarginLeft,
              index > 1 && styles.inputMarginTop,
            ]}>
            <Text style={styles.inputLabel}>{index + 1}</Text>
            <TextInput
              key={index}
              style={styles.input}
              value={mnemonic}
              onChangeText={text => handleChangeText(text, index)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        ))}
      </View>
      {isMnemonicsEmpty ? pasteButton : clearButton}
      <View style={styles.flex} />
      <CommonButton style={styles.importButton} disabledStyle={styles.importButtonDisable} disabled={isMnemonicsEmpty}>
        Import
      </CommonButton>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  flex: {
    flex: 1,
  },
  mnemonicsWrap: {
    marginTop: pTd(40),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputWrap: {
    height: pTd(40),
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(20),
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    width: pTd(16),
    marginLeft: pTd(16),
  },
  input: {
    height: pTd(40),
    color: theme.colors.textBase2,
    flex: 1,
    marginHorizontal: pTd(16),
  },
  inputMarginLeft: {
    marginLeft: pTd(16),
  },
  inputMarginTop: {
    marginTop: pTd(12),
  },
  button: {
    marginTop: pTd(12),
    width: '100%',
    height: pTd(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: pTd(8),
  },
  importButton: {
    marginBottom: pTd(16),
    backgroundColor: theme.colors.bgBase1,
  },
  importButtonDisable: {
    backgroundColor: theme.colors.bgBase2,
  },
}));
