import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import NoData from 'components/NoData';
import useDebounce from 'hooks/useDebounce';
import RecommendSection from '../components/RecommendSection';
import { BGStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';

const mock_data = [{ id: 1 }];

const FindMorePeople = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceWord = useDebounce(keyword, 500);
  const [list, setList] = useState<any[]>(mock_data);

  useEffect(() => {
    setLoading(true);
    setList([{ id: 1 }]);
    setLoading(false);
  }, [debounceWord]);

  const renderItem = useCallback((item: any) => {
    console.log(item);
    return (
      <Touchable style={[GStyles.flexRow, BGStyles.bg12]} onPress={() => navigationService.navigate('Profile')}>
        <Image source={{ uri: '' }} />
        <TextM>Sally</TextM>
        <TextM>stranger</TextM>
        <Touchable onPress={() => navigationService.navigate('ChatDetails')}>
          <Svg icon="check-true" />
        </Touchable>
      </Touchable>
    );
  }, []);

  return (
    <PageContainer
      titleDom={'find more people'}
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <CommonInput value={keyword} onChangeText={v => setKeyword(v)} />
      {!keyword && <TextM>My Portkey Id: xxxxxxx</TextM>}
      {list.length ? (
        <FlatList data={list} ListEmptyComponent={<NoData />} renderItem={renderItem} />
      ) : (
        <RecommendSection />
      )}
    </PageContainer>
  );
};

export default FindMorePeople;

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.bg4,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  svgWrap: {
    padding: pTd(16),
  },
  buttonGroupWrap: {},
});
