import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextS } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { StyleSheet, View, ScrollView, ScrollViewProps } from 'react-native';
import { pTd } from 'utils/unit';

export type CommonSectionPropsType = {
  headerTitle: string;
  dataList: any[];
  sectionWrapStyles?: any;
  renderItem: (item: any) => React.ReactNode;
  clearCallback?: () => void;
} & ScrollViewProps;

export function CommonSection(props: CommonSectionPropsType) {
  const { headerTitle, dataList, clearCallback, renderItem, sectionWrapStyles = {} } = props;

  const { t } = useLanguage();

  return (
    <ScrollView style={[styles.sectionWrap, sectionWrapStyles]}>
      <View style={[styles.headerWrap, GStyles.flexRow, GStyles.spaceBetween]}>
        <TextL style={styles.header}>{headerTitle}</TextL>
        <TextS style={[FontStyles.font4, GStyles.alignCenter]} onPress={clearCallback}>
          {!!clearCallback && t('Clear')}
        </TextS>
      </View>
      <View>{[{}]?.map(item => renderItem(item))}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
    backgroundColor: 'red',
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
});
