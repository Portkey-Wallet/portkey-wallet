import { defaultColors } from 'assets/theme';
import PortkeySkeleton from 'components/PortkeySkeleton';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
export default function MarketItemSkeleton(props: { key: React.Key | null | undefined }) {
  return (
    <View style={styles.mainContainer} key={props.key}>
      <PortkeySkeleton width={pTd(167)} height={pTd(28)} />
      <PortkeySkeleton width={pTd(92)} height={pTd(28)} />
      <PortkeySkeleton width={pTd(64)} height={pTd(28)} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: pTd(64),
    backgroundColor: defaultColors.neutralDefaultBG,
  },
});
