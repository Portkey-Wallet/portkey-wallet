/* eslint-disable react-native/no-inline-styles */
import React, { memo, ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, StyleProp, ViewStyle } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors, darkColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
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
  } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      tabBar={prop => (
        <CustomizedTopTabBar
          {...prop}
          hasTabBarBorderRadius={hasTabBarBorderRadius}
          hasBottomBorder={hasBottomBorder}
          containerStyle={tabContainerStyle}
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
  containerStyle = {},
}: {
  state: { routes: any[]; index: number };
  descriptors: any;
  navigation: any;
  hasTabBarBorderRadius?: boolean;
  hasBottomBorder?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  const onPress = useThrottleCallback(
    (name, params) => {
      navigation.navigate(name, params);
    },
    [navigation],
    600,
  );

  return (
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
            style={[toolBarStyle.label, { paddingRight: index !== state.routes.length - 1 ? pTd(32) : 0 }]}>
            <Text
              style={[
                toolBarStyle.labelText,
                {
                  color: isFocused ? defaultColors.white : darkColors.textBase2,
                },
              ]}>
              {label}
            </Text>
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
  container: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    height: pTd(54),
    alignItems: 'center',
  },
  label: {},
  labelText: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
});
