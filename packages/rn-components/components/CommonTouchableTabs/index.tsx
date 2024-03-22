import React, { useMemo } from 'react';

import { View } from 'react-native';
import { pTd } from '../../utils/unit';
import Touchable from '../Touchable';
import { TextM } from '../CommonText';
import { TextStyleType, Theme, ViewStyleType } from '../../theme/type';
import { makeStyles } from '../../theme';

export type TabItemType<T> = {
  name: string;
  type: T;
  component: JSX.Element;
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
  const styles = useStyles();
  return (
    <View style={[styles.tabHeader, tabHeaderStyle]}>
      {tabList.map(tabItem => {
        const selectedTab = selectTab === tabItem.type;
        const tabTitleStyles: TextStyleType = [styles.font7];
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

const useStyles = makeStyles((theme: Theme) => {
  return {
    font7: {
      color: theme.font7,
    },
    tabHeader: {
      width: pTd(190),
      backgroundColor: theme.bg18,
      borderRadius: pTd(6),
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...theme.paddingArg!(3),
      marginBottom: pTd(32),
    },
    tabWrap: {
      width: pTd(88),
      height: pTd(30),
      borderRadius: pTd(6),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    selectTabStyle: {
      shadowColor: theme.shadow1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.09,
      shadowRadius: 4,
      elevation: 2,
      backgroundColor: theme.bg1,
    },
    selectTabTextStyle: {
      color: theme.font5,
      ...theme.mediumFont,
    },
  };
});
