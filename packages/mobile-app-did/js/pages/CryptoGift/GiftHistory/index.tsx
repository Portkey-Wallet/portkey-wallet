import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { pTd } from 'utils/unit';
import HistoryCard from '../components/HistoryCard';
import { useGetCryptoGiftHistories } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { CryptoGiftItem } from '@portkey-wallet/types/types-ca/cryptogift';
import NoData from 'components/NoData';
import { makeStyles } from '@rneui/themed';
const emptyData: CryptoGiftItem[] = Array.from({ length: 9 });
export default function GiftHistory() {
  const { t } = useLanguage();
  const styles = getStyles();
  const { cryptoGiftHistories, loading, error } = useGetCryptoGiftHistories();
  const renderItem = useCallback(
    ({ item }: { item: CryptoGiftItem }) => {
      return <HistoryCard containerStyle={styles.itemDivider} isSkeleton={loading} redPacketDetail={item} />;
    },
    [loading, styles.itemDivider],
  );
  return (
    <PageContainer
      titleDom={t('Sent Gifts History')}
      safeAreaColor={['white', 'black']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{
        disabled: false,
      }}>
      <FlatList
        contentContainerStyle={styles.flatListStyle}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        data={!loading ? cryptoGiftHistories : emptyData}
        renderItem={renderItem}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <NoData style={styles.noData} topDistance={pTd(80)} message={error || 'No gifts sent yet'} noPic />
        )}
        keyExtractor={(item: any, index: number) => '' + (item?.id || index)}
      />
    </PageContainer>
  );
}
const getStyles = makeStyles(theme => ({
  pageStyles: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
  },
  itemDivider: {
    marginTop: pTd(12),
  },
  noData: {
    backgroundColor: theme.colors.bgBase1,
  },
  flatListStyle: {
    paddingBottom: pTd(10),
    paddingTop: pTd(12),
    backgroundColor: theme.colors.bgBase1,
  },
}));
// const styles = StyleSheet.create({
//   pageStyles: {
//     backgroundColor: defaultColors.neutralDefaultBG,
//     flex: 1,
//   },
//   itemDivider: {
//     marginTop: pTd(16),
//   },
// });
