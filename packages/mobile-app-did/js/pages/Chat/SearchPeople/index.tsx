import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import InputWithCancel from 'components/InputWithCancel';
import CommonButton from 'components/CommonButton';
import { useFocusEffect } from '@react-navigation/native';
import NoData from 'components/NoData';
import { Image } from '@rneui/base';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
const mock_data = [0, 1, 2];

export default function SearchPeople() {
  const iptRef = useRef<any>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [keyword, setKeyword] = useState('');
  const [filterList, setFilterList] = useState(mock_data);

  useFocusEffect(
    useCallback(() => {
      if (iptRef?.current) {
        timerRef.current = setTimeout(() => {
          iptRef.current.focus();
        }, 300);
      }
    }, []),
  );

  useEffect(() => {
    setFilterList(mock_data);
  }, [keyword]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const renderItem = useCallback((item: any) => {
    console.log(item);
    return (
      <Touchable onPress={() => navigationService.navigate('ChatDetails')}>
        <Image source={{ uri: '' }} />
        <TextM>Sally</TextM>
        <TextM>2</TextM>
      </Touchable>
    );
  }, []);

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Search">
      <InputWithCancel
        ref={iptRef}
        onChangeText={v => setKeyword(v)}
        value={keyword}
        clearText={() => setKeyword('')}
        onCancel={() => navigationService.goBack()}
      />
      <CommonButton onPress={() => navigationService.navigate('FindMorePeople')}>FindMorePeople</CommonButton>
      <FlatList data={filterList} ListEmptyComponent={<NoData />} renderItem={renderItem} />
    </PageContainer>
  );
}

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
