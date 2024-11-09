import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import Collapsible from 'components/Collapsible';
import { valueToString, showValueToStr } from '@portkey-wallet/utils/byteConversion';
import { makeStyles } from '@rneui/themed';

type TransactionDataSectionType = {
  methodName?: string;
  dataInfo: { [key: string]: any } | string;
  style?: ViewStyle;
};

export const TransactionDataSectionWrapper = (props: TransactionDataSectionType) => {
  const { methodName, dataInfo, style = {} } = props;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const styles = getStyles();
  const TopMethodSection = useCallback(
    (name: string, value?: string) => (
      <Touchable
        style={[styles.topSection, GStyles.flexCol, GStyles.itemStart]}
        onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[fonts.mediumFont]}>{name}</TextM>
        <TextS style={[fonts.regularFont, GStyles.marginTop(4), GStyles.alignStart]}>{value || 'unknown'}</TextS>
      </Touchable>
    ),
    [styles.topSection],
  );
  const TopMessageSection = useMemo(
    (topTitle?: string) => (
      <Touchable style={styles.topSection} onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[fonts.mediumFont]}>{topTitle ?? 'Message'}</TextM>
        <Svg
          iconStyle={[{ transform: [{ rotate: collapsed ? '0deg' : '-90deg' }] }]}
          size={pTd(20)}
          icon={'down-arrow'}
        />
      </Touchable>
    ),
    [collapsed, styles],
  );
  const DataSection = useMemo(() => {
    if (typeof dataInfo === 'string') {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[styles.dataValue]}>{dataInfo}</TextS>
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
            <TextS style={[styles.dataValue]}>{key === 'expirationTime' ? formattedDate : valueToString(value)}</TextS>
          </View>
        );
      });
    } else {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[styles.dataValue]}>{showValueToStr(dataInfo)}</TextS>
        </View>
      );
    }
  }, [dataInfo, styles]);

  return (
    <View>
      {TopMethodSection('Method', methodName)}
      <View style={[styles.card, style]}>
        {TopMessageSection}
        <Collapsible collapsed={collapsed}>{DataSection}</Collapsible>
      </View>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...GStyles.paddingArg(16),
  },
  dataInfoGroup: {
    flex: 1,
    marginBottom: pTd(16),
    ...GStyles.paddingArg(0, 16),
  },
  dataValue: {
    marginTop: pTd(4),
  },
}));
