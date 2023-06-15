import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextL, TextS } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import RecordItem from '../RecordItem';
import {
  addRecordsItem,
  changeDrawerOpenStatus,
  clearRecordsList,
  createNewTab,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

export default function RecordSection() {
  const { t } = useLanguage();

  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const clearRecord = useCallback(() => {
    dispatch(clearRecordsList({ networkType }));
  }, [dispatch, networkType]);

  const showRecordList = useMemo(() => {
    const recordsList = (discoverMap?.[networkType]?.recordsList as ITabItem[]) || [];
    return recordsList.map(ele => ele).reverse();
  }, [discoverMap, networkType]);

  if (showRecordList?.length === 0) return null;

  return (
    <ScrollView style={styles.sectionWrap}>
      <View style={[styles.headerWrap, GStyles.flexRow, GStyles.spaceBetween]}>
        <TextL style={styles.header}>{'Records'}</TextL>
        <TextS style={[FontStyles.font4, GStyles.alignCenter]} onPress={clearRecord}>
          {t('Clear')}
        </TextS>
      </View>
      {(showRecordList ?? []).map((item, index) => (
        <RecordItem
          key={index}
          item={item}
          onPress={() => {
            const id = Date.now();
            dispatch(addRecordsItem({ ...item, networkType }));
            dispatch(createNewTab({ id, url: item.url, name: '', networkType }));
            dispatch(changeDrawerOpenStatus(true));
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
});
