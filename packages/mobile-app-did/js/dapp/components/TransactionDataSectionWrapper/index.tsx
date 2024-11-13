import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { valueToString, showValueToStr } from '@portkey-wallet/utils/byteConversion';
import { makeStyles } from '@rneui/themed';

type TransactionDataSectionType = {
  methodName?: string;
  dataInfo: { [key: string]: any } | string;
  style?: ViewStyle;
};

export const TransactionDataSectionWrapper = (props: TransactionDataSectionType) => {
  const { methodName, dataInfo } = props;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const styles = getStyles();
  const TopMethodSection = useCallback(
    (name: string, value?: string) => (
      <Touchable
        style={[styles.topSection, GStyles.flexCol, GStyles.itemStart]}
        onPress={() => setCollapsed(pre => !pre)}>
        <TextL style={[fonts.mediumFont]}>{name}</TextL>
        <TextM style={[fonts.regularFont, GStyles.marginTop(4), GStyles.alignStart]}>{value || 'unknown'}</TextM>
      </Touchable>
    ),
    [styles.topSection],
  );
  const TopMessageSection = useMemo(
    (topTitle?: string) => (
      <Touchable style={[GStyles.flexRow, GStyles.itemCenter]} onPress={() => setCollapsed(pre => !pre)}>
        <TextL style={[fonts.SGMediumFont]}>{topTitle ?? 'Message'}</TextL>
        <Svg
          iconStyle={[{ marginLeft: pTd(4), transform: [{ rotate: collapsed ? '0deg' : '-90deg' }] }]}
          size={pTd(16)}
          icon={'down-arrow'}
        />
      </Touchable>
    ),
    [collapsed],
  );
  const DataSection = useMemo(() => {
    if (typeof dataInfo === 'string') {
      return (
        <View style={styles.dataInfoGroup}>
          <TextM style={[styles.dataValue]}>{dataInfo}</TextM>
        </View>
      );
    } else if (typeof dataInfo === 'object') {
      return Object.entries(dataInfo).map(([key, value], index) => {
        if (!value) {
          return null;
        }
        let formattedDate = value;
        if (key === 'expirationTime') {
          const date = new Date(value * 1000);
          formattedDate = date.toLocaleString();
        }
        return (
          <View key={index} style={styles.dataInfoGroup}>
            <TextM>{key}</TextM>
            <TextM style={[styles.dataValue]}>{key === 'expirationTime' ? formattedDate : valueToString(value)}</TextM>
          </View>
        );
      });
    } else {
      return (
        <View style={styles.dataInfoGroup}>
          <TextM style={[styles.dataValue]}>{showValueToStr(dataInfo)}</TextM>
        </View>
      );
    }
  }, [dataInfo, styles]);

  return (
    <View>
      {TopMethodSection('Method', methodName)}
      {TopMessageSection}
      {collapsed && <View style={styles.dataSection}>{DataSection}</View>}
    </View>
  );
};

export default TransactionDataSectionWrapper;

const getStyles = makeStyles(theme => ({
  card: {
    width: pTd(335),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    borderRadius: pTd(6),
  },
  topSection: {
    ...GStyles.paddingArg(16, 0),
  },
  dataSection: {
    marginTop: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
    ...GStyles.paddingArg(16),
  },
  dataInfoGroup: {
    marginBottom: pTd(16),
  },
  dataValue: {
    marginTop: pTd(4),
    color: theme.colors.textBase2,
  },
}));
