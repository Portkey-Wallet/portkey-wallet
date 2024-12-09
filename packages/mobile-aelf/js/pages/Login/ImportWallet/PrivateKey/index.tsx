import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles, useTheme } from '@rneui/themed';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

export default function RecoveryPhrase() {
  const styles = getStyles();
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const onChangeText = useCallback((text: string) => {
    setText(text);
  }, [setText]);


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
      <TextInput value={text} multiline={true} style={styles.input} placeholder="Enter private key" onChangeText={onChangeText} />
      {text.length <= 0 ? pasteButton : clearButton}
    </View>
  );
}

const getStyles = makeStyles(theme => ({
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
}));
