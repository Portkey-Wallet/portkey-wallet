import React, { useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import { ArchivedTabEnum } from 'pages/Discover/types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import BookmarksSection from './components/BookmarksSection';
import RecordsSection from './components/RecordsSection';
import { RouteProp, useRoute } from '@react-navigation/native';

type TabItemType = {
  name: string;
  type: ArchivedTabEnum;
  component: JSX.Element;
};

const tabList: TabItemType[] = [
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
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyles}
      titleDom="Bookmarks">
      <View style={[GStyles.flexRow, GStyles.alignCenter]}>
        <View style={styles.tabHeader}>
          {tabList.map(tabItem => (
            <TouchableOpacity
              key={tabItem.name}
              onPress={() => {
                onTabPress(tabItem.type);
              }}>
              <View style={[styles.tabWrap, selectTab === tabItem.type && styles.selectTabStyle]}>
                <TextM style={[FontStyles.font7, selectTab === tabItem.type && styles.selectTabTextStyle]}>
                  {tabItem.name}
                </TextM>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={GStyles.flex1}>{tabList.find(item => item.type === selectTab)?.component}</View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: { ...GStyles.paddingArg(0), flex: 1, backgroundColor: defaultColors.bg6 },

  tabHeader: {
    width: pTd(214),
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
    marginVertical: pTd(16),
  },
  tabWrap: {
    width: pTd(100),
    height: pTd(30),
    borderRadius: pTd(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectTabStyle: {
    shadowColor: defaultColors.shadow1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: defaultColors.bg1,
  },
  selectTabTextStyle: {
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
});
