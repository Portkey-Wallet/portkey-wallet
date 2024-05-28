import React from 'react';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { TextStyleType, ViewStyleType } from 'types/styles';

export type TabItemType<T> = {
  name: string;
  type: T;
  component?: JSX.Element;
};

export type CommonTouchableTabsProps<T> = {
  tabList: TabItemType<T>[];
  onTabPress: (type: T) => void;
  selectTab: T;
  tabHeaderStyle?: ViewStyleType;
  tabWrapStyle?: ViewStyleType;
  tabTextStyle?: TextStyleType;
  selectTabTextStyle?: TextStyleType;
};

export default function CommonTouchableTabs<T>({
  tabList,
  onTabPress,
  selectTab,
  tabHeaderStyle,
  tabWrapStyle,
  tabTextStyle,
  selectTabTextStyle,
}: CommonTouchableTabsProps<T>) {
  return (
    <View style={[styles.tabHeader, tabHeaderStyle]}>
      {tabList.map(tabItem => {
        const selectedTab = selectTab === tabItem.type;
        const tabTitleStyles: TextStyleType = [FontStyles.font11];
        if (tabTextStyle) tabTitleStyles.push(tabTextStyle);
        if (selectedTab) {
          tabTitleStyles.push(styles.selectTabTextStyle);
          if (selectTabTextStyle) tabTitleStyles.push(selectTabTextStyle);
        }
        return (
          <Touchable
            key={tabItem.name}
            activeOpacity={0.8}
            onPress={() => onTabPress(tabItem.type)}
            style={[styles.tabWrap, selectedTab && styles.selectTabStyle, tabWrapStyle]}>
            <TextM style={tabTitleStyles}>{tabItem.name}</TextM>
          </Touchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
  },
  tabWrap: {
    flex: 1,
    width: pTd(88),
    height: pTd(30),
    borderRadius: pTd(6),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
