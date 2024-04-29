/* eslint-disable react-native/no-inline-styles */
import React, { memo, ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
}

export type CommonTopTabProps = {
  swipeEnabled?: boolean;
  hasTabBarBorderRadius?: boolean;
  initialRouteName?: string;
  tabItemStyleProps?: any;
  tabList: TabItemTypes[];
};

const Tab = createMaterialTopTabNavigator();

const CommonTopTab: React.FC<CommonTopTabProps> = props => {
  const { tabList, initialRouteName, hasTabBarBorderRadius, swipeEnabled = false } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      tabBar={prop => <CustomizedTopTabBar {...prop} hasTabBarBorderRadius={hasTabBarBorderRadius} />}
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
}: {
  state: { routes: any[]; index: number };
  descriptors: any;
  navigation: any;
  hasTabBarBorderRadius?: boolean;
}) => {
  return (
    <View style={[toolBarStyle.container, hasTabBarBorderRadius ? styles.radiusTarBarStyle : {}]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name, route.params);
        };

        return (
          <TouchableOpacity
            testID={options.tabBarTestID}
            onPress={onPress}
            disabled={isFocused}
            key={label}
            style={[toolBarStyle.label, { paddingRight: index !== state.routes.length - 1 ? pTd(32) : 0 }]}>
            <View
              style={isFocused ? { borderBottomColor: defaultColors.primaryColor, borderBottomWidth: pTd(2.5) } : {}}>
              <Text
                style={[
                  toolBarStyle.labelText,
                  {
                    color: isFocused ? defaultColors.font16 : defaultColors.font11,
                  },
                ]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
  container: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {},
  labelText: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
    paddingVertical: pTd(8),
    ...fonts.mediumFont,
  },
});
