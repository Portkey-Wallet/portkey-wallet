import React, { useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import BookmarksSection from './components/BookmarksSection';
import RecordsSection from './components/RecordsSection';
import { RouteProp, useRoute } from '@react-navigation/native';
import CommonTouchableTabs, { TabItemType } from 'components/CommonTouchableTabs';

const tabList: TabItemType<ArchivedTabEnum>[] = [
  {
    name: 'Bookmarks',
    type: ArchivedTabEnum.Bookmarks,
    component: <BookmarksSection />,
  },
  {
    name: 'Records',
    type: ArchivedTabEnum.History,
    component: <RecordsSection />,
  },
];

export default function Bookmark() {
  const {
    params: { type = ArchivedTabEnum.Bookmarks },
  } = useRoute<RouteProp<{ params: { type: ArchivedTabEnum } }>>();

  const [selectTab, setSelectTab] = useState<ArchivedTabEnum>(type);

  const onTabPress = useCallback((tabType: ArchivedTabEnum) => {
    setSelectTab(tabType);
  }, []);

  return (
    <PageContainer
      safeAreaColor={['white', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Bookmarks">
      <View style={[GStyles.flexRow, GStyles.alignCenter]}>
        <CommonTouchableTabs
          tabList={tabList}
          onTabPress={onTabPress}
          selectTab={selectTab}
          tabWrapStyle={styles.tabWrap}
          tabHeaderStyle={styles.tabHeader}
        />
      </View>
      <View style={GStyles.flex1}>{tabList.find(item => item.type === selectTab)?.component}</View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: { ...GStyles.paddingArg(0), flex: 1, backgroundColor: defaultColors.bg6 },

  tabHeader: {
    width: pTd(214),
    backgroundColor: defaultColors.bg18,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(3),
    marginVertical: pTd(16),
  },
  tabWrap: {
    width: pTd(100),
    height: pTd(30),
    borderRadius: pTd(6),
  },
});
