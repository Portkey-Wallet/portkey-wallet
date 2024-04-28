import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { defaultColors } from '../../../assets/theme';
import fonts from '../../../assets/theme/fonts';
import { pTd } from '../../../utils/unit';
import { TextM, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { FontStyles } from '../../../assets/theme/styles';
import GStyles from '../../../assets/theme/GStyles';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import Collapsible from '@portkey-wallet/rn-components/components/Collapsible';
import { showValueToStr } from '@portkey-wallet/utils/byteConversion';
type TransactionDataSectionType = {
  dataInfo: { [key: string]: any } | string;
  style?: ViewStyle;
};

export const TransactionDataSection = (props: TransactionDataSectionType) => {
  const { dataInfo, style = {} } = props;

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const TopSection = useMemo(
    () => (
      <Touchable style={styles.topSection} onPress={() => setCollapsed(pre => !pre)}>
        <TextM style={[FontStyles.font5, fonts.mediumFont]}>Message</TextM>
        <Svg size={pTd(20)} icon={collapsed ? 'down-arrow' : 'up-arrow'} />
      </Touchable>
    ),
    [collapsed],
  );

  const DataSection = useMemo(() => {
    if (typeof dataInfo === 'string') {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{dataInfo}</TextS>
        </View>
      );
    } else if (typeof dataInfo === 'object') {
      return Object.entries(dataInfo).map(([key, value], index) => (
        <View key={index} style={styles.dataInfoGroup}>
          <TextM style={FontStyles.font5}>{key}</TextM>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{showValueToStr(value)}</TextS>
        </View>
      ));
    } else {
      return (
        <View style={styles.dataInfoGroup}>
          <TextS style={[FontStyles.font3, styles.dataValue]}>{showValueToStr(dataInfo)}</TextS>
        </View>
      );
    }
  }, [dataInfo]);

  return (
    <View style={[styles.card, style]}>
      {TopSection}
      <Collapsible collapsed={collapsed}>{DataSection}</Collapsible>
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
    flex: 1,
    marginBottom: pTd(16),
    ...GStyles.paddingArg(0, 16),
  },
  dataValue: {
    marginTop: pTd(4),
  },
});
