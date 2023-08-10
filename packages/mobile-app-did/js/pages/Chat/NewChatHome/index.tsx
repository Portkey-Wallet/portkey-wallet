import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import Svg from 'components/Svg';
import CommonInput from 'components/CommonInput';

const mock_data = [{ id: 1 }];

const NewChatHome = () => {
  const [keyword, setKeyword] = useState('');
  const [filterList, setFilterList] = useState(mock_data);

  const renderItem = useCallback((item: any) => {
    return (
      <Touchable onPress={() => navigationService.navigate('ChatDetails')}>
        <TextM>Sally</TextM>
        <Touchable onPress={() => navigationService.navigate('ChatDetails')}>
          <Svg icon="check-true" />
        </Touchable>
      </Touchable>
    );
  }, []);

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="New Chat">
      <CommonInput onChangeText={v => setKeyword(v)} value={keyword} />
      <FlatList data={filterList} ListEmptyComponent={<NoData />} renderItem={renderItem} />
    </PageContainer>
  );
};

export default NewChatHome;

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    flex: 1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  svgWrap: {
    padding: pTd(16),
  },
});
