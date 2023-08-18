import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import Touchable from 'components/Touchable';
import NoData from 'components/NoData';
import useDebounce from 'hooks/useDebounce';
import RecommendSection from '../components/RecommendSection';
import { BGStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import ContactItem from 'components/ContactItem';

const mock_data = [{ id: 1, index: 1, name: '测试' }];

const FindMorePeople = () => {
  const [keyword, setKeyword] = useState('');
  const [, setLoading] = useState(false);
  const debounceWord = useDebounce(keyword, 500);
  const [list, setList] = useState<any[]>(mock_data);

  useEffect(() => {
    setLoading(true);
    setList(mock_data);
    setLoading(false);
  }, [debounceWord]);

  const renderItem = useCallback(({ item }: any) => {
    return <ContactItem isShowChat contact={item} />;
  }, []);

  return (
    <PageContainer
      titleDom={'Find More'}
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
        <CommonInput
          value={keyword}
          onChangeText={v => setKeyword(v)}
          rightIcon={
            keyword ? (
              <Touchable onPress={() => setKeyword('')}>
                <Svg icon="clear3" size={pTd(16)} />
              </Touchable>
            ) : undefined
          }
          rightIconContainerStyle={styles.rightIconContainerStyle}
        />
      </View>
      {!keyword && (
        <View style={[GStyles.center, styles.portkeyId]}>
          <TextM>{`My Portkey ID : xxxxxxx`}</TextM>
        </View>
      )}
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
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  svgWrap: {
    padding: pTd(16),
  },
  buttonGroupWrap: {},
  portkeyId: {
    textAlign: 'center',
    height: pTd(46),
    lineHeight: pTd(46),
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
