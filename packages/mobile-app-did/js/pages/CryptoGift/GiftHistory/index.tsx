import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import HistoryCard from '../components/HistoryCard';
const data = Array.from({ length: 11 });
export default function GiftHistory() {
  const { t } = useLanguage();
  const [isSkeleton, setIsSkeleton] = useState<boolean>(true);
  const renderItem = useCallback(() => {
    return <HistoryCard containerStyle={styles.itemDivider} />;
  }, []);
  return (
    <PageContainer
      titleDom={t('History')}
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <FlatList
        // ref={flatListRef}
        contentContainerStyle={{ paddingBottom: pTd(10) }}
        style={{ minHeight: pTd(512) }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        data={data}
        renderItem={renderItem}
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
