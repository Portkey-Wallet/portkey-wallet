import React, { useMemo, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { showValueToStr } from '@portkey-wallet/utils/byteConversion';
import { makeStyles, useTheme } from '@rneui/themed';

type TransactionDataSectionType = {
  topTitle?: string;
  dataInfo: { [key: string]: any } | string;
  style?: ViewStyle;
  topTitleStyle?: TextStyle[];
};

export const TransactionDataSection = (props: TransactionDataSectionType) => {
  const { topTitle, dataInfo, style = {}, topTitleStyle = [] } = props;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const styles = getStyles();
  const { theme } = useTheme();

  const TopSection = useMemo(
    () => (
      <Touchable
        style={[styles.topSection, GStyles.flexRow, GStyles.itemCenter]}
        onPress={() => setCollapsed(pre => !pre)}>
        <TextL style={[fonts.SGMediumFont, ...topTitleStyle]}>{topTitle ?? 'Message'}</TextL>
        <Svg
          iconStyle={[{ marginLeft: pTd(4), transform: [{ rotate: collapsed ? '0deg' : '-90deg' }] }]}
          size={pTd(16)}
          icon={'down-arrow'}
        />
      </Touchable>
    ),
    [collapsed, topTitle, styles, topTitleStyle],
  );

  const DataSection = useMemo(() => {
    if (typeof dataInfo === 'string') {
      return (
        <View style={styles.dataInfoGroup}>
          <TextM style={[styles.dataValue]}>{dataInfo}</TextM>
        </View>
      );
    } else if (typeof dataInfo === 'object') {
      return Object.entries(dataInfo).map(([key, value], index) => (
        <View key={index} style={styles.dataInfoGroup}>
          <TextM style={{ color: theme.colors.textBase2 }}>{key}</TextM>
          <TextM style={[styles.dataValue]}>{showValueToStr(value)}</TextM>
        </View>
      ));
    } else {
      return (
        <View style={styles.dataInfoGroup}>
          <TextM style={[styles.dataValue]}>{showValueToStr(dataInfo)}</TextM>
        </View>
      );
    }
  }, [dataInfo, styles, theme]);

  return (
    <View style={[style]}>
      {TopSection}
      {collapsed && <View style={styles.dataSection}>{DataSection}</View>}
    </View>
  );
};

export default TransactionDataSection;

const getStyles = makeStyles(theme => ({
  topSection: {
    marginTop: pTd(24),
  },
  dataSection: {
    marginTop: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
    ...GStyles.paddingArg(16),
  },
  dataInfoGroup: {
    flex: 1,
    marginBottom: pTd(16),
  },
  dataValue: {
    marginTop: pTd(4),
    color: theme.colors.textBase3,
  },
}));
