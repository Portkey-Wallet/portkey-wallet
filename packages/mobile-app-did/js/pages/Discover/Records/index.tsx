import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import fonts from 'assets/theme/fonts';
import { clearRecordsList } from '@portkey-wallet/store/store-ca/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import CommonButton from 'components/CommonButton';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

export default function RecordsPage() {
  const { t } = useLanguage();

  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppCASelector(state => state.discover);

  const showRecordList = useMemo(() => {
    const recordsList = (discoverMap?.[networkType]?.recordsList as ITabItem[]) || [];
    return recordsList.map(ele => ele).reverse();
  }, [discoverMap, networkType]);

  const clearRecord = useCallback(() => {
    dispatch(clearRecordsList({ networkType }));
  }, [dispatch, networkType]);
  if (showRecordList?.length === 0) return null;

  return (
    <PageContainer
      hideHeader
      titleDom={t('Records')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg5, GStyles.flexRow, styles.inputContainer]}>
        {showRecordList.map((ele, index) => (
          <TextM key={index}>{'111'}</TextM>
        ))}
      </View>

      <CommonButton title={t('Done')} onPress={clearRecord} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  inputStyle: {
    width: pTd(280),
  },
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  rnInputStyle: {
    fontSize: pTd(14),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
