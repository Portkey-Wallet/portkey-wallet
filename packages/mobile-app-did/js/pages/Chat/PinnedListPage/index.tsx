import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';

export const PinnedListPage = () => {
  const fetchMore = useCallback(() => {
    console.log('fetchMore!');
  }, []);

  const renderItem = useCallback(() => {
    return <TextS>pin message</TextS>;
  }, []);

  return (
    <PageContainer
      titleDom={'Find People'}
      safeAreaColor={['blue', 'white']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <TextS>PinnedListPage</TextS>
      <FlatList
        data={[]}
        renderItem={renderItem}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.3}
        keyExtractor={(item, index) => index.toString()}
        style={[GStyles.marginTop(pTd(16)), GStyles.marginBottom(pTd(16))]}
      />
    </PageContainer>
  );
};

export default PinnedListPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
});
