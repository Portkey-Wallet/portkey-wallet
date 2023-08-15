import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { TextL, TextM, TextS } from 'components/CommonText';
import navigationService from 'utils/navigationService';
import NoData from 'components/NoData';
import Svg from 'components/Svg';
import CommonInput from 'components/CommonInput';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

const mock_data = new Array(100).map(() => ({ id: 1 }));

const NewChatHome = () => {
  const [keyword, setKeyword] = useState('');
  const [filterList, setFilterList] = useState(mock_data);

  const renderItem = useCallback((item: any) => {
    return (
      <Touchable style={[GStyles.flexRow, styles.itemWrap]} onPress={() => navigationService.navigate('ChatDetails')}>
        <CommonAvatar title="sally" hasBorder avatarSize={pTd(36)} style={styles.avatarStyle} />
        <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter, styles.rightSection]}>
          <TextL numberOfLines={1}>Sally</TextL>
          <Touchable style={styles.chatButton} onPress={() => navigationService.navigate('ChatDetails')}>
            <TextS style={FontStyles.font2}>Chat</TextS>
          </Touchable>
        </View>
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
      <View style={[BGStyles.bg5, GStyles.paddingArg(8, 20, 8)]}>
        <CommonInput
          value={keyword}
          placeholder={''}
          onChangeText={v => {
            setKeyword(v);
          }}
        />
      </View>
      <FlatList
        data={filterList}
        ListEmptyComponent={<NoData noPic message="No search result" />}
        renderItem={renderItem}
      />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: pTd(20),
  },
  chatButton: {
    backgroundColor: defaultColors.bg5,
    borderRadius: pTd(6),
    overflow: 'hidden',
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(4),
  },
});
