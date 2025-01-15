import React from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import ExchangeIcons from 'components/ExchangeIcons';
import fonts from 'assets/theme/fonts';

const SupportedExchangesCard = () => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <Svg icon="info-white" size={pTd(24)} />
      <Text style={styles.title}>Supported Exchanges</Text>
      <ExchangeIcons style={styles.icons} />
    </View>
  );
};

export default SupportedExchangesCard;

const getStyles = makeStyles(theme => ({
  container: {
    padding: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(16),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  title: {
    marginTop: pTd(12),
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  icons: {
    marginTop: pTd(12),
  },
}));
