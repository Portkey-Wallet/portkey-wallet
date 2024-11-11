/* eslint-disable react-native/no-inline-styles */
import React, { memo, ReactElement, ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors, darkColors } from 'assets/theme';
import { useThrottleCallback } from '@portkey-wallet/hooks';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
}

export type CommonTopTabProps = {
  swipeEnabled?: boolean;
  hasTabBarBorderRadius?: boolean;
  hasBottomBorder?: boolean;
  initialRouteName?: string;
  tabItemStyleProps?: any;
  tabList: TabItemTypes[];
  tabContainerStyle?: StyleProp<ViewStyle>;
  isBlockTab?: boolean;
  expandView?: ReactNode;
  onTabChange?: (name: string) => void;
};

const Tab = createMaterialTopTabNavigator();

const CommonTopTab: React.FC<CommonTopTabProps> = props => {
  const {
    tabList,
    initialRouteName,
    hasTabBarBorderRadius,
    swipeEnabled = false,
    hasBottomBorder = true,
    tabContainerStyle = {},
    isBlockTab,
    expandView,
    onTabChange,
  } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      tabBar={prop => (
        <CustomizedTopTabBar
          {...prop}
          isBlockTab={isBlockTab}
          expandView={expandView}
          hasTabBarBorderRadius={hasTabBarBorderRadius}
          hasBottomBorder={hasBottomBorder}
          containerStyle={tabContainerStyle}
          onTabChange={onTabChange}
        />
      )}
      screenOptions={{
        swipeEnabled,
        tabBarScrollEnabled: false,
      }}>
      {tabList.map(ele => (
        <Tab.Screen key={ele.name} name={ele.name}>
          {() => ele.tabItemDom}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

const CustomizedTopTabBar = ({
  state,
  descriptors,
  navigation,
  hasTabBarBorderRadius = false,
  hasBottomBorder = false,
  isBlockTab = false,
  containerStyle = {},
  expandView,
  onTabChange,
}: {
  state: { routes: any[]; index: number };
  descriptors: any;
  navigation: any;
  hasTabBarBorderRadius?: boolean;
  hasBottomBorder?: boolean;
  isBlockTab?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  expandView?: ReactNode;
  onTabChange?: (name: string) => void;
}) => {
  const onPress = useThrottleCallback(
    (name, params) => {
      onTabChange?.(name);
      navigation.navigate(name, params);
    },
    [navigation],
    600,
  );

  return (
    <View style={toolBarStyle.tabBarStyle}>
      <ScrollView horizontal={true} alwaysBounceHorizontal={false}>
        <View
          style={[
            toolBarStyle.container,
            containerStyle,
            hasBottomBorder ? styles.bottomBorder : {},
            hasTabBarBorderRadius ? styles.radiusTarBarStyle : {},
          ]}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            return (
              <TouchableOpacity
                testID={options.tabBarTestID}
                onPress={() => onPress(route.name, route.params)}
                disabled={isFocused}
                key={label}
                style={[
                  toolBarStyle.label,
                  isBlockTab && toolBarStyle.blockTab,
                  isBlockTab && isFocused && toolBarStyle.selectedBlockTab,
                  isBlockTab
                    ? { marginRight: index !== state.routes.length - 1 ? pTd(10) : 0 }
                    : { paddingRight: index !== state.routes.length - 1 ? pTd(32) : 0 },
                ]}>
                <Text
                  style={[
                    toolBarStyle.labelText,
                    {
                      color: isFocused ? defaultColors.white : darkColors.textBase2,
                    },
                  ]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      {expandView}
    </View>
  );
};

export default memo(CommonTopTab);

const styles = StyleSheet.create({
  tabBarStyle: {
    elevation: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bottomBorder: {
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

const toolBarStyle = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(54),
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    height: pTd(54),
    alignItems: 'center',
    backgroundColor: darkColors.bgBase1,
  },
  label: {},
  blockTab: {
    padding: pTd(8),
    borderRadius: pTd(8),
  },
  selectedBlockTab: {
    backgroundColor: darkColors.bgBase2,
  },
  labelText: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
});
