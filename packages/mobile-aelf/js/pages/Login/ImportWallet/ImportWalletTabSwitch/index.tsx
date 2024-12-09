import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

export default function ImportWalletTabSwitch({ onSelected }: { onSelected: (isExchangeSelected: boolean) => void }) {
  const styles = getStyles();

  const [isPrivateKeySelected, setPrivateKeySelected] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !isPrivateKeySelected && styles.buttonSelected]}
        onPress={() => {
          if (isPrivateKeySelected) {
            onSelected(false);
            setPrivateKeySelected(false);
          }
        }}>
        <Text style={[styles.buttonText, isPrivateKeySelected && styles.buttonTextSelected]}>Recovery Phrase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isPrivateKeySelected && styles.buttonSelected]}
        onPress={() => {
          if (!isPrivateKeySelected) {
            onSelected(true);
            setPrivateKeySelected(true);
          }
        }}>
        <Text style={[styles.buttonText, !isPrivateKeySelected && styles.buttonTextSelected]}>Private Key</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    height: pTd(38),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(4),
  },
  button: {
    height: pTd(28),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
  },
  buttonText: {
    fontSize: pTd(16),
    color: theme.colors.textNeutral3,
  },
  buttonTextSelected: {
    color: theme.colors.textNeutral1,
  },
}));
