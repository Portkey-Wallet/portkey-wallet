import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { FontStyles } from 'assets/theme/styles';

interface TransactionDataSectionType {
  dataInfo: { [key: string]: any };
  collapsed: boolean;
  style?: ViewStyle;
}

export const TransactionDataSection = (props: TransactionDataSectionType) => {
  const { dataInfo, collapsed, style = {} } = props;

  const topSection = useMemo(
    () => (
      <View style={styles.topSection}>
        <TextM style={[FontStyles.font5, fonts.mediumFont]}>Data</TextM>
        <Svg size={pTd(20)} icon={collapsed ? 'down-arrow' : 'up-arrow'} />
      </View>
    ),
    [collapsed],
  );

  return (
    <View style={[styles.card, style]}>
      {topSection}
      {Object.entries(dataInfo).map(([key, value], index) => (
        <View key={index} style={styles.dataInfoGroup}>
          <TextM style={FontStyles.font5}>{key}</TextM>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{value}</TextS>
        </View>
      ))}
    </View>
  );
};

export default TransactionDataSection;

const styles = StyleSheet.create({
  card: {
    width: pTd(335),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    paddingLeft: pTd(12),
    paddingRight: pTd(12),
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataInfoGroup: {
    marginTop: pTd(16),
  },
  dataValue: {
    marginTop: pTd(4),
  },
});
