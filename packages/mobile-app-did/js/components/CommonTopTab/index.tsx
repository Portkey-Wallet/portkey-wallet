import React, { memo, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
}

export type CommonTopTabProps = {
  hasTabBarBorderRadius?: boolean;
  initialRouteName?: string;
  tabItemStyleProps?: any;
  swipeEnabled?: boolean;
  tabList: TabItemTypes[];
};

const Tab = createMaterialTopTabNavigator();

const CommonTopTab: React.FC<CommonTopTabProps> = props => {
  const { tabList, initialRouteName, hasTabBarBorderRadius, swipeEnabled = false } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      screenOptions={{
        swipeEnabled,
        tabBarScrollEnabled: false,
        tabBarStyle: [hasTabBarBorderRadius ? styles.radiusTarBarStyle : {}, styles.tabBarStyle], // tabWrap
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarInactiveTintColor: defaultColors.font3, // active
        tabBarActiveTintColor: defaultColors.font4, // inactive
        tabBarIndicatorStyle: { borderWidth: StyleSheet.hairlineWidth, borderColor: defaultColors.bg5 }, // active border
        tabBarPressColor: defaultColors.bg1,
      }}>
      {tabList.map(ele => (
        <Tab.Screen key={ele.name} name={ele.name}>
          {() => ele.tabItemDom}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
export default memo(CommonTopTab);

const styles = StyleSheet.create({
  tabBarStyle: {
    elevation: 1,
    shadowColor: defaultColors.border1,
    shadowOffset: { width: 0, height: pTd(3) },
  },
  radiusTarBarStyle: {
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
  },
  tabBarLabelStyle: {
    textTransform: 'none',
    fontSize: pTd(14),
  },
});
