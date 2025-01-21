import React, { useCallback, useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import * as Clipboard from 'expo-clipboard';
import { makeStyles, useTheme } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

export default function ManualBackup() {
  const styles = getStyles();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const mnemonics = useMemo(
    () => ['seed', 'sock', 'milk', 'update', 'focus', 'rotate', 'barely', 'fade', 'car', 'face', 'mechanic', 'mercy'],
    [],
  );

  const inputWidth = useMemo(() => {
    return (screenWidth - pTd(16) * 3) / 2;
  }, []);

  const onCopy = useCallback(async () => {
    const isCopy = await Clipboard.setStringAsync(mnemonics.join(' '));
    if (isCopy) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [mnemonics, setCopied]);

  const copyButton = useMemo(() => {
    return (
      <Touchable style={styles.button} onPress={onCopy}>
        <Svg icon="copy" size={pTd(20)} />
        <Text style={styles.buttonText}>Copy to clipboard</Text>
      </Touchable>
    );
  }, [onCopy, styles]);

  const copiedView = useMemo(() => {
    return (
      <View style={styles.button}>
        <Svg icon="check-circle" size={pTd(20)} color={theme.colors.iconSuccess2} />
        <Text style={styles.copyText}>Seed phrase copied</Text>
      </View>
    );
  }, [styles, theme]);

  const reminderUI = useMemo(() => {
    return (
      <View style={styles.reminderWrap}>
        <Svg icon="info" size={pTd(22)} color={theme.colors.bgBrand4} />
        <Text style={styles.reminderText}>
          Next, verify your seed phrase by selecting the words in the correct order.
        </Text>
      </View>
    );
  }, [styles, theme]);

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <Text style={styles.title}>Manual backup</Text>
      <Text style={styles.desc}>
        Keep a copy of your seed phrase at a safe place. DO NOT share it with anyone as this could result in wallet and
        asset loss.
      </Text>
      <View style={styles.mnemonicsWrap}>
        {mnemonics.map((mnemonic, index) => (
          <View
            key={index}
            style={[
              styles.wordWrap,
              { width: inputWidth },
              index % 2 === 1 && styles.wordMarginLeft,
              index > 1 && styles.wordMarginTop,
            ]}>
            <Text style={styles.wordLabel}>{index + 1}</Text>
            <Text style={styles.mnemonicsLabel}>{mnemonic}</Text>
          </View>
        ))}
      </View>
      {copied ? copiedView : copyButton}
      {reminderUI}
      <CommonButton
        type="primary"
        style={styles.continueButton}
        onPress={() => {
          navigationService.push('ConfirmBackup');
        }}>
        Continue
      </CommonButton>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
  },
  title: {
    marginTop: pTd(24),
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  desc: {
    color: theme.colors.textBase2,
    marginTop: pTd(16),
    fontSize: pTd(14),
  },
  mnemonicsWrap: {
    marginTop: pTd(24),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordWrap: {
    height: pTd(40),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordLabel: {
    color: theme.colors.textBase2,
    fontSize: pTd(16),
    width: pTd(16),
    marginLeft: pTd(16),
  },
  mnemonicsLabel: {
    marginLeft: pTd(16),
  },
  wordMarginLeft: {
    marginLeft: pTd(16),
  },
  wordMarginTop: {
    marginTop: pTd(12),
  },
  button: {
    marginTop: pTd(12),
    width: '100%',
    height: pTd(48),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: pTd(8),
  },
  copyText: {
    marginLeft: pTd(8),
    color: theme.colors.textSuccess2,
  },
  reminderWrap: {
    marginTop: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderWarning3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  reminderText: {
    marginLeft: pTd(12),
    fontSize: pTd(14),
    color: theme.colors.textBase2,
  },
  continueButton: {
    marginTop: pTd(24),
  },
}));
