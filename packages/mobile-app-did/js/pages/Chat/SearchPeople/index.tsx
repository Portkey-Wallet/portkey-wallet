import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
import { TextM, TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import FindMoreButton from '../components/FindMoreButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import CommonAvatar from 'components/CommonAvatar';
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
      <Touchable
        style={[GStyles.flexRow, GStyles.itemCenter, styles.itemWrap]}
        onPress={() => navigationService.navigate('ChatDetails')}>
        <CommonAvatar title="sally" hasBorder avatarSize={pTd(36)} style={styles.avatarStyle} />
        <View style={styles.rightSection}>
          <TextL numberOfLines={1}>Sally</TextL>
        </View>
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
      <FindMoreButton />
      <FlatList
        data={filterList}
        ListHeaderComponent={<TextL style={styles.listHeader}>Chats</TextL>}
        ListEmptyComponent={<NoData noPic message="No search result" />}
        renderItem={renderItem}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg4,
    paddingHorizontal: 0,
    flex: 1,
  },
  listHeader: {
    ...GStyles.paddingArg(16, 20, 8),
    color: defaultColors.font9,
  },
  itemWrap: {
    width: screenWidth,
    height: pTd(72),
  },
  avatarStyle: {
    marginHorizontal: pTd(20),
    marginVertical: pTd(18),
  },
  rightSection: {
    height: pTd(72),
    flex: 1,
    borderBottomColor: defaultColors.border1,
    borderBottomWidth: 1,
    paddingRight: pTd(20),
    justifyContent: 'center',
  },
});
