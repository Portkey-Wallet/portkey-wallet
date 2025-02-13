import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import Touchable from 'components/Touchable';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import * as Clipboard from 'expo-clipboard';
import { useImportWallet } from '../../hooks/useImportWallet';

export default function RecoveryPhrase({ checkedSecurityLock }: { checkedSecurityLock?: boolean }) {
  const styles = getStyles();
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const onChangeText = useCallback(
    (text: string) => {
      setInputText(text);
    },
    [setInputText],
  );

  const isPrivateKeyValid = useMemo(() => {
    const privateKey = inputText.trim();
    if (privateKey.length <= 0) {
      return false;
    }
    let privateKeyWithoutPrefix = privateKey;
    if (privateKey.startsWith('0x') || privateKey.startsWith('0X')) {
      privateKeyWithoutPrefix = privateKey.slice(2);
    }
    if (privateKeyWithoutPrefix.length !== 64) {
      return false;
    }
    // Regex to match a valid hexadecimal string
    const hexRegex = /^[0-9a-fA-F]{64}$/;
    return hexRegex.test(privateKeyWithoutPrefix);
  }, [inputText]);

  const onPaste = useCallback(async () => {
    const clipboardText = (await Clipboard.getStringAsync()).trim();
    setInputText(clipboardText);
  }, [setInputText]);

  const onClear = useCallback(() => {
    setInputText('');
  }, [setInputText]);

  const pasteButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onPaste}>
        <Svg icon="paste" size={pTd(20)} />
        <Text style={styles.buttonText}>Paste from clipboard</Text>
      </Touchable>
    );
  }, [onPaste, styles.button, styles.buttonText]);
  const clearButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onClear}>
        <Svg icon="clear2" size={pTd(16)} color={theme.colors.iconBase2} />
        <Text style={styles.buttonText}>Clear</Text>
      </Touchable>
    );
  }, [onClear, styles.button, styles.buttonText, theme.colors.iconBase2]);

  const { importWalletByPrivateKey } = useImportWallet();

  return (
    <View style={styles.flex}>
      <TextInput
        value={inputText}
        multiline={true}
        style={styles.input}
        placeholder="Enter private key"
        placeholderTextColor={theme.colors.textBase3}
        onChangeText={onChangeText}
      />
      {inputText.length <= 0 ? pasteButton : clearButton}
      <View style={styles.flex} />
      <CommonButton
        type="primary"
        style={styles.importButton}
        disabledStyle={styles.importButtonDisable}
        disabled={!isPrivateKeyValid}
        onPress={() => importWalletByPrivateKey(inputText, checkedSecurityLock)}>
        Import
      </CommonButton>
    </View>
  );
}

export const getStyles = makeStyles(theme => ({
  flex: {
    flex: 1,
  },
  input: {
    marginTop: pTd(40),
    width: '100%',
    height: pTd(160),
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(8),
    borderWidth: StyleSheet.hairlineWidth,
    padding: pTd(16),
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
