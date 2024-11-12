import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import BookmarksSection from './components/BookmarksSection';
import RecordsSection from './components/RecordsSection';
import { RouteProp, useRoute } from '@react-navigation/native';
import CommonTouchableTabs, { TabItemType } from 'components/CommonTouchableTabs';
import { clearRecordsList } from '@portkey-wallet/store/store-ca/discover/slice';
import Touchable from 'components/Touchable';
import Svg, { IconName } from 'components/Svg';
import { ListItemType } from 'components/FloatOverlay/Popover';
import { useOnTouchAndPopUp } from 'components/FloatOverlay/touch';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useRecordsList } from 'hooks/discover';

function TouchableIcon({
  icon,
  onPress,
  size = 20,
}: {
  icon: IconName;
  onPress: (event: GestureResponderEvent) => Promise<any> | void;
  size?: number;
}) {
  return (
    <Touchable style={styles.svgWrap} onPress={onPress}>
      <Svg icon={icon} size={pTd(size)} color={darkColors.iconBase1} />
    </Touchable>
  );
}

export default function Bookmark() {
  const {
    params: { type = ArchivedTabEnum.Bookmarks },
  } = useRoute<RouteProp<{ params: { type: ArchivedTabEnum } }>>();
  const [selectTab, setSelectTab] = useState<ArchivedTabEnum>(type);
  const [bookmarksAmount, setBookmarksAmount] = useState(0);
  const storeDispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const bookmarksRef = useRef<any>(null);
  const recordList = useRecordsList(true);

  const onBookMarksChange = (num: number) => {
    setBookmarksAmount(num);
  };

  const tabList: TabItemType<ArchivedTabEnum>[] = [
    {
      name: 'Bookmarks',
      type: ArchivedTabEnum.Bookmarks,
      component: <BookmarksSection ref={ref => (bookmarksRef.current = ref)} onChange={onBookMarksChange} />,
    },
    {
      name: 'Records',
      type: ArchivedTabEnum.History,
      component: <RecordsSection />,
    },
  ];

  const deleteAll = useCallback(() => {
    if (selectTab === ArchivedTabEnum.Bookmarks) {
      // TODO: delete all bookmarks
      bookmarksRef.current?.onDeleteAll?.();
    } else {
      storeDispatch(clearRecordsList({ networkType }));
    }
  }, [networkType, selectTab, storeDispatch]);

  const popUpList = useMemo<ListItemType[]>(() => {
    return [
      {
        title: 'Delete all',
        iconName: 'delete',
        iconColor:
          (selectTab === ArchivedTabEnum.Bookmarks && bookmarksAmount > 0) ||
          (selectTab === ArchivedTabEnum.History && recordList.length > 0)
            ? darkColors.iconBase1
            : darkColors.textDisabled1,
        onPress:
          (selectTab === ArchivedTabEnum.Bookmarks && bookmarksAmount > 0) ||
          (selectTab === ArchivedTabEnum.History && recordList.length > 0)
            ? deleteAll
            : undefined,
      },
    ];
  }, [bookmarksAmount, deleteAll, recordList.length, selectTab]);

  const onTouch = useOnTouchAndPopUp({
    list: popUpList,
    formatType: 'fixedWidth',
    contentStyle: {
      color:
        (selectTab === ArchivedTabEnum.Bookmarks && bookmarksAmount > 0) ||
        (selectTab === ArchivedTabEnum.History && recordList.length > 0)
          ? darkColors.textBase1
          : darkColors.textDisabled1,
    },
    containerStyle: { backgroundColor: darkColors.bgBase1, borderColor: darkColors.borderBase1, borderWidth: 1 },
  });

  const onTabPress = useCallback((tabType: ArchivedTabEnum) => {
    setSelectTab(tabType);
  }, []);

  return (
    <PageContainer
      safeAreaColor={['black']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      rightDom={<TouchableIcon icon="more-vertical" onPress={onTouch} size={22} />}
      titleDom={
        <CommonTouchableTabs
          tabList={tabList}
          onTabPress={onTabPress}
          selectTab={selectTab}
          tabWrapStyle={styles.tabWrap}
          tabHeaderStyle={styles.tabHeader}
        />
      }>
      <View style={GStyles.flex1}>{tabList.find(item => item.type === selectTab)?.component}</View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: { ...GStyles.paddingArg(0), flex: 1, backgroundColor: darkColors.bgBase1 },

  tabHeader: {
    backgroundColor: darkColors.bgBase1,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
  },
  tabWrap: {
    height: pTd(30),
    borderRadius: pTd(6),
  },
  svgWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pTd(12),
  },
});
