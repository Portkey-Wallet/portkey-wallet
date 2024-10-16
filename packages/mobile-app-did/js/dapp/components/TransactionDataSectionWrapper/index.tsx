import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import Collapsible from 'components/Collapsible';
import { showValueToStr } from '@portkey-wallet/utils/byteConversion';
type TransactionDataSectionType = {
  methodName?: string;
  dataInfo: { [key: string]: any } | string;
  style?: ViewStyle;
};

export const TransactionDataSectionWrapper = (props: TransactionDataSectionType) => {
  const { methodName, dataInfo, style = {} } = props;

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const TopMethodSection = useCallback(
    (name: string, value?: string) => (
      <Touchable style={[styles.topSection, GStyles.flexCol]} onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[FontStyles.font5, fonts.mediumFont]}>{name}</TextM>
        <TextS style={[FontStyles.font3, fonts.regularFont, GStyles.marginTop(4), GStyles.alignStart]}>
          {value || 'unknown'}
        </TextS>
      </Touchable>
    ),
    [],
  );
  const TopMessageSection = useCallback(
    (topTitle?: string) => (
      <Touchable style={styles.topSection} onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[FontStyles.font5, fonts.mediumFont]}>{topTitle ?? 'Message'}</TextM>
        <Svg size={pTd(20)} icon={collapsed ? 'down-arrow' : 'up-arrow'} />
      </Touchable>
    ),
    [collapsed],
  );
  const DataSection = useMemo(() => {
    console.log('dataInfodataInfodataInfo', dataInfo);
    if (typeof dataInfo === 'string') {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{dataInfo}</TextS>
        </View>
      );
    } else if (typeof dataInfo === 'object') {
      return Object.entries(dataInfo).map(([key, value], index) => {
        if (!value) {
          return null;
        }
        return (
          <View key={index} style={styles.dataInfoGroup}>
            <TextM style={FontStyles.font5}>{key}</TextM>
            <TextS style={[FontStyles.font3, styles.dataValue]}>{showValueToStr(value)}</TextS>
          </View>
        );
      });
    } else {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{showValueToStr(dataInfo)}</TextS>
        </View>
      );
    }
  }, [dataInfo]);

  return (
    <View>
      {TopMethodSection('Method', methodName)}
      <View style={[styles.card, style]}>
        {TopMessageSection()}
        <Collapsible collapsed={collapsed}>{DataSection}</Collapsible>
      </View>
    </View>
  );
};

export default TransactionDataSectionWrapper;

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
    flex: 1,
    marginBottom: pTd(16),
    ...GStyles.paddingArg(0, 16),
  },
  dataValue: {
    marginTop: pTd(4),
  },
});
