import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { pTd } from 'utils/unit';
import HistoryCard from '../components/HistoryCard';
import { ImageBackground, StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import HeaderCard from '../components/HeaderCard';
import { View } from 'react-native';
import Packet_Detail_Header_Bg from '../img/Packet_Detail_Header_Bg.png';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import ReceiverItem from '../components/ReceiverItem';
const data = Array.from({ length: 11 });
export default function GiftDetail() {
  const { t } = useLanguage();
  const [isSkeleton, setIsSkeleton] = useState<boolean>(true);
  const renderItem = useCallback(() => {
    return (
      <ReceiverItem
        item={{
          userId: '',
          username: 'zhangsan',
          avatar: '',
          grabTime: 123832948235730,
          isLuckyKing: true,
          amount: '1231000000000000000',
        }}
        symbol={'ELF'}
        isLuckyKing={false}
        decimals={16}
      />
    );
  }, []);
  const renderDivider = useCallback(() => {
    return <View style={styles.divider} />;
  }, []);
  return (
    <PageContainer
      noCenterDom
      scrollViewProps={{ disabled: true }}
      rightDom={
        <Touchable
          onPress={() => {
            navigationService.navigate('GiftResult');
          }}>
          <Svg size={pTd(22)} icon="share-gift" iconStyle={styles.iconMargin} />
        </Touchable>
      }
      containerStyles={styles.pageStyles}
      safeAreaColor={['white']}>
      <FlatList
        // ref={flatListRef}
        ListHeaderComponent={() => (
          <>
            <HeaderCard />
            {renderDivider()}
            <TextM style={[FontStyles.neutralTertiaryText, GStyles.marginTop(pTd(16)), GStyles.paddingArg(0, pTd(16))]}>
              3/3 crypto gifts opened, with 10.00000003/20 ELF has been claimed.
            </TextM>
            <View
              style={[
                GStyles.paddingArg(0, pTd(16)),
                BGStyles.neutralDivider,
                GStyles.height(pTd(0.5)),
                GStyles.marginTop(pTd(8)),
              ]}
            />
          </>
        )}
        contentContainerStyle={{ paddingBottom: pTd(10) }}
        // style={{ minHeight: pTd(512) }}
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
    paddingHorizontal: 0,
  },
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg1,
    flex: 1,
    ...GStyles.paddingArg(0),
  },
  headerWrap: {
    width: screenWidth,
    height: pTd(76),
  },
  backIconWrap: {
    paddingLeft: pTd(16),
    paddingVertical: pTd(16),
    width: pTd(60),
  },
  iconMargin: { marginRight: pTd(16) },
  itemDivider: {
    marginTop: pTd(16),
    ...GStyles.paddingArg(0, pTd(16)),
  },
  divider: {
    height: pTd(8),
    backgroundColor: defaultColors.neutralContainerBG,
    marginTop: pTd(32),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
