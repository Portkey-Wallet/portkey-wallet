import React from 'react';
import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { TextL } from 'components/CommonText';
import { TextStyleType, ViewStyleType } from 'types/styles';
import { makeStyles } from '@rneui/themed';

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
  const styles = getStyles();

  return (
    <View style={[GStyles.flexRow, tabHeaderStyle]}>
      {tabList.map((tabItem, idx) => {
        const selectedTab = selectTab === tabItem.type;
        const tabTitleStyles: TextStyleType = [styles.baseTabTextStyle];
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
            style={[
              styles.tabWrap,
              idx === 0 && styles.firstTabWrap,
              selectedTab && styles.selectTabStyle,
              tabWrapStyle,
            ]}>
            <TextL style={tabTitleStyles}>{tabItem.name}</TextL>
          </Touchable>
        );
      })}
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  tabHeader: {
    backgroundColor: darkColors.bgBase1,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
  },
  tabWrap: {
    height: pTd(30),
    borderRadius: pTd(8),
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: pTd(12),
    marginLeft: pTd(8),
  },
  firstTabWrap: {
    marginLeft: 0,
  },
  selectTabStyle: {
    backgroundColor: theme.colors.bgBase2,
  },
  selectTabTextStyle: {
    color: theme.colors.textNeutral1,
    shadowColor: defaultColors.shadow1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: darkColors.bgBase2,
  },
  // selectTabTextStyle: {
  //   color: darkColors.textNeutral1, // todo_leon zhang
  //   ...fonts.mediumFont,
  // },
  baseTabTextStyle: {
    color: theme.colors.textNeutral3,
  },
}));
