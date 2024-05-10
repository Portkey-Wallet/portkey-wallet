import React from 'react';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FlatList, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from './components/TokenAllowanceItem';
import NoData from 'components/NoData';
import Touchable from 'components/Touchable';

const list = new Array(100).fill('');

const TokenAllowanceHome: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageContainer
      leftCallback={() => navigationService.navigate('Tab')}
      titleDom={t('Token Allowance')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <FlatList
        nestedScrollEnabled
        contentContainerStyle={styles.contentContainerStyle}
        data={list || []}
        ListEmptyComponent={() => (
          <Touchable>
            <NoData
              icon={'no-data-nft'}
              message={t('No NFTs yet ')}
              topDistance={pTd(40)}
              oblongSize={[pTd(64), pTd(64)]}
            />
          </Touchable>
        )}
        renderItem={({ item }) => (
          <TokenAllowanceItem
            item={item}
            onPress={() => {
              navigationService.navigate('TokenAllowanceDetail');
            }}
          />
        )}
        keyExtractor={item => item?.key}
      />
    </PageContainer>
  );
};

export default TokenAllowanceHome;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  contactListStyle: {
    backgroundColor: defaultColors.bg1,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  contentContainerStyle: {},
});
