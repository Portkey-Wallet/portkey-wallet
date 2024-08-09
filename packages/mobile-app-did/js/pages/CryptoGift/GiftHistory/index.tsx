import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import HistoryCard from '../components/HistoryCard';
import { useGetCryptoGiftHistories } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { CryptoGiftItem } from '@portkey-wallet/types/types-ca/cryptogift';
import NoData from 'components/NoData';
import { BGStyles } from 'assets/theme/styles';
const emptyData: CryptoGiftItem[] = Array.from({ length: 7 });
export default function GiftHistory() {
  const { t } = useLanguage();
  const { cryptoGiftHistories, loading, error } = useGetCryptoGiftHistories();
  const renderItem = useCallback(
    ({ item }: { item: CryptoGiftItem }) => {
      return <HistoryCard containerStyle={styles.itemDivider} isSkeleton={loading} redPacketDetail={item} />;
    },
    [loading],
  );
  return (
    <PageContainer
      titleDom={t('History')}
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: pTd(10) }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        data={!loading ? cryptoGiftHistories : emptyData}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <NoData style={BGStyles.neutralDefaultBG} topDistance={pTd(95)} message={error || 'No history'} />
        )}
        keyExtractor={(item: any, index: number) => '' + (item?.id || index)}
      />
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.neutralDefaultBG,
    flex: 1,
  },
  itemDivider: {
    marginTop: pTd(16),
  },
});
