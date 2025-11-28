import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

export default function ImportWalletTabSwitch({
  onSelected,
  privateKeySelected = false,
}: {
  onSelected: (isExchangeSelected: boolean) => void;
  privateKeySelected?: boolean;
}) {
  const styles = getStyles();

  const [isPrivateKeySelected, setPrivateKeySelected] = useState(privateKeySelected);
  useEffect(() => {
    setPrivateKeySelected(privateKeySelected);
  }, [privateKeySelected]);

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
        <Text style={[styles.buttonText, !isPrivateKeySelected && styles.buttonTextSelected]}>Seed Phrase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isPrivateKeySelected && styles.buttonSelected]}
        onPress={() => {
          if (!isPrivateKeySelected) {
            onSelected(true);
            setPrivateKeySelected(true);
          }
        }}>
        <Text style={[styles.buttonText, isPrivateKeySelected && styles.buttonTextSelected]}>Private Key</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    height: pTd(38),
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(4),
  },
  button: {
    height: pTd(30),
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
