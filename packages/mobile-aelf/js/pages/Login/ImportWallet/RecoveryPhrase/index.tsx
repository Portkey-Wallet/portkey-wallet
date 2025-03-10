import React, { useCallback, useMemo, useState, useRef } from 'react';
import { TextInput, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import CommonButton from 'components/CommonButton';
import CommonToast from 'components/CommonToast';
import * as bip39 from 'bip39';
import * as Clipboard from 'expo-clipboard';
import { useImportWallet } from '../../hooks/useImportWallet';

const MnemonicsWordCount = 12;

function validateMnemonicFormat(input: string, expectedLength = 12) {
  const words = input.trim().split(/\s+/);
  if (words.length !== expectedLength) {
    return false;
  }
  return words.every(word => /^[a-zA-Z]+$/.test(word));
}

export default function RecoveryPhrase({ checkedSecurityLock }: { checkedSecurityLock?: boolean }) {
  const styles = getStyles();
  const { theme } = useTheme();
  const [mnemonics, setMnemonics] = useState(Array(MnemonicsWordCount).fill(''));
  const [isMnemonicsValid, setIsMnemonicsValid] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRefs = Array.from({ length: 12 }, () => useRef<TextInput>(null));

  const isMnemonicsEmpty = useMemo(() => {
    const isNotEmpty = validateMnemonicFormat(mnemonics.join(' '));
    setIsMnemonicsValid(isNotEmpty);
    return !isNotEmpty;
  }, [mnemonics]);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const newMnemonics = [...mnemonics];
      newMnemonics[index] = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
      setMnemonics(newMnemonics);
    },
    [mnemonics, setMnemonics],
  );

  // only check format, one work, one space.
  const onPaste = useCallback(async () => {
    const clipboardText = (await Clipboard.getStringAsync()).trim();
    // if (bip39.validateMnemonic(clipboardText)) {
    if (validateMnemonicFormat(clipboardText)) {
      const clipboardMnemonics = clipboardText.split(' ');
      if (clipboardMnemonics.length === MnemonicsWordCount) {
        setMnemonics(clipboardMnemonics);
        setIsMnemonicsValid(true);
      } else {
        CommonToast.fail('Invalid seed phrase');
      }
    } else {
      CommonToast.fail('Invalid seed phrase');
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

  const { importWalletByMnemonic } = useImportWallet();

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
              ref={inputRefs[index]}
              key={index}
              style={styles.input}
              value={mnemonic}
              onChangeText={text => handleChangeText(text, index)}
              onSubmitEditing={() => {
                if (index < inputRefs.length - 1) {
                  inputRefs[index + 1].current?.focus();
                }
              }}
              blurOnSubmit={index === inputRefs.length - 1}
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
        onPress={() => {
          if (!bip39.validateMnemonic(mnemonics.join(' '))) {
            CommonToast.fail('Invalid seed phrase');
            return;
          }
          importWalletByMnemonic(mnemonics, checkedSecurityLock);
        }}>
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
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: pTd(1),
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
    color: theme.colors.textBase1,
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
