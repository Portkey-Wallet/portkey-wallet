import React from 'react';
import { View, Image } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';

const EXCHANGE_ICON_LIST = [
  require('assets/image/pngs/exchange-binance.png'),
  require('assets/image/pngs/exchange-okx.png'),
  require('assets/image/pngs/exchange-upbit.png'),
  require('assets/image/pngs/exchange-bithumb.png'),
  require('assets/image/pngs/exchange-gate_io.png'),
  require('assets/image/pngs/exchange-mexc.png'),
  require('assets/image/pngs/exchange-hotcoin.png'),
];

const ExchangeIcons = ({ style }: { style?: ViewStyleType }) => {
  const styles = getStyles();
  return (
    <View style={[styles.iconsWrap, style]}>
      {EXCHANGE_ICON_LIST.map((icon, index) => (
        <Image key={index} style={[styles.icon, index === 0 ? {} : styles.iconML]} source={icon} />
      ))}
    </View>
  );
};

export default ExchangeIcons;

const getStyles = makeStyles(() => ({
  iconsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: pTd(32),
    height: pTd(32),
  },
  iconML: {
    marginLeft: pTd(2),
  },
}));
