import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import CommonToast from 'components/CommonToast';
import * as bip39 from 'bip39';
import * as Clipboard from 'expo-clipboard';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import navigationService from 'utils/navigationService';
import { SetBiometricsTypeEnum } from 'pages/Pin/SetBiometrics';

const MnemonicsWordCount = 12;
let invalidMnemonicsToastTimer: NodeJS.Timeout;

export default function RecoveryPhrase() {
  const styles = getStyles();
  const { theme } = useTheme();
  const [mnemonics, setMnemonics] = useState(Array(MnemonicsWordCount).fill(''));

  const isMnemonicsEmpty = useMemo(() => {
    return mnemonics.every(mnemonic => mnemonic === '');
  }, [mnemonics]);

  const isMnemonicsValid = useMemo(() => {
    const isValid = bip39.validateMnemonic(mnemonics.join(' '));
    if (mnemonics.filter(mnemonic => mnemonic === '').length === 0 && !isValid) {
      clearTimeout(invalidMnemonicsToastTimer);
      invalidMnemonicsToastTimer = setTimeout(() => {
        CommonToast.fail('Invalid seed phrase');
      }, 500); // gpt4o advice 300-500ms
    }
    return isValid;
  }, [mnemonics]);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const newMnemonics = [...mnemonics];
      newMnemonics[index] = text;
      setMnemonics(newMnemonics);
    },
    [mnemonics, setMnemonics],
  );

  const onPaste = useCallback(async () => {
    const clipboardText = (await Clipboard.getStringAsync()).trim();
    if (bip39.validateMnemonic(clipboardText)) {
      const clipboardMnemonics = clipboardText.split(' ');
      if (clipboardMnemonics.length === MnemonicsWordCount) {
        setMnemonics(clipboardMnemonics);
      } else {
        CommonToast.fail('Invalid recovery phrase');
      }
    } else {
      CommonToast.fail('Invalid recovery phrase');
    }
  }, [setMnemonics]);

  const onClear = useCallback(() => {
    setMnemonics(Array(MnemonicsWordCount).fill(''));
  }, [setMnemonics]);

  const inputWidth = useMemo(() => {
    return (screenWidth - pTd(16) * 3) / 2;
  }, []);

  const pasteButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onPaste}>
        <Svg icon="paste" size={pTd(20)} />
        <Text style={styles.buttonText}>Paste from clipboard</Text>
      </Touchable>
    );
  }, [styles]);
  const clearButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onClear}>
        <Svg icon="clear2" size={pTd(16)} color={theme.colors.iconBase2} />
        <Text style={styles.buttonText}>Clear</Text>
      </Touchable>
    );
  }, [onClear, styles.button, styles.buttonText, theme.colors.iconBase2]);

  const importWalletByMnemonic = useCallback(async () => {
    const isReady = await authenticationReady();
    if (isReady) {
      navigationService.push('SetBiometrics', {
        type: SetBiometricsTypeEnum.create,
        mnemonics: mnemonics.join(' '),
      });
      return;
    }

    navigationService.navigate('SetPin', {
      mnemonics: mnemonics.join(' '),
    });
  }, [mnemonics]);

  return (
    <View style={styles.flex}>
      <View style={styles.mnemonicsWrap}>
        {mnemonics.map((mnemonic, index) => (
          <View
            key={index}
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
      <CommonButton
        type="primary"
        style={styles.importButton}
        disabledStyle={styles.importButtonDisable}
        disabled={!isMnemonicsValid}
        onPress={importWalletByMnemonic}>
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
