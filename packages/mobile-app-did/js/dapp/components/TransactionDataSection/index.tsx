import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';

interface TransactionDataSectionType {
  dataInfo: { [key: string]: any };
  style?: ViewStyle;
}

export const TransactionDataSection = (props: TransactionDataSectionType) => {
  const { dataInfo, style = {} } = props;

  const [collapsed, setCollapsed] = useState<boolean>(true);

  const topSection = useMemo(
    () => (
      <Touchable style={styles.topSection} onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[FontStyles.font5, fonts.mediumFont]}>Data</TextM>
        <Svg size={pTd(20)} icon={collapsed ? 'down-arrow' : 'up-arrow'} />
      </Touchable>
    ),
    [collapsed],
  );

  return (
    <View style={[styles.card, style]}>
      {topSection}
      {!collapsed &&
        Object.entries(dataInfo).map(([key, value], index) => (
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
    borderRadius: pTd(6),
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...GStyles.paddingArg(16),
  },
  dataInfoGroup: {
    marginBottom: pTd(16),
    ...GStyles.paddingArg(0, 16),
  },
  dataValue: {
    marginTop: pTd(4),
  },
});
