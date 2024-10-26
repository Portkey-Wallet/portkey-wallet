import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

export default function ExchangeTabSwitch({
  isExchangeSelected,
  onSelected,
}: {
  isExchangeSelected: boolean;
  onSelected: (isExchangeSelected: boolean) => void;
}) {
  const styles = getStyles();
  const [exchangeSelected, setExchangeSelected] = useState(isExchangeSelected);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, exchangeSelected && styles.buttonSelected]}
        onPress={() => {
          if (!exchangeSelected) {
            setExchangeSelected(true);
            onSelected(true);
          }
        }}>
        <Text style={[styles.buttonText, exchangeSelected && styles.buttonTextSelected]}>Exchange</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, !exchangeSelected && styles.buttonSelected]}
        onPress={() => {
          if (exchangeSelected) {
            setExchangeSelected(false);
            onSelected(false);
          }
        }}>
        <Text style={[styles.buttonText, !exchangeSelected && styles.buttonTextSelected]}>Non-exchange</Text>
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
