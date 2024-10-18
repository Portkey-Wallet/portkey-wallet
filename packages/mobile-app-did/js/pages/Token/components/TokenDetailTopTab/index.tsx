import React, { memo, ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { defaultColors, darkColors } from 'assets/theme';
import { useThrottleCallback } from '@portkey-wallet/hooks';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
}

export type TokenDetailTopTabProps = {
  initialRouteName?: string;
  tabItemStyleProps?: any;
  tabList: TabItemTypes[];
};

const Tab = createMaterialTopTabNavigator();

const TokenDetailTopTab: React.FC<TokenDetailTopTabProps> = props => {
  const { tabList, initialRouteName } = props;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      tabBar={prop => <TopTabBar {...prop} />}
      screenOptions={{
        swipeEnabled: false,
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

const TopTabBar = ({
  state,
  descriptors,
  navigation,
}: {
  state: { routes: any[]; index: number };
  descriptors: any;
  navigation: any;
}) => {
  const onPress = useThrottleCallback(
    (name, params) => {
      navigation.navigate(name, params);
    },
    [navigation],
    600,
  );

  return (
    <View style={[toolBarStyle.container]}>
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
              toolBarStyle.button,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                marginRight: index !== state.routes.length - 1 ? pTd(8) : 0,
                backgroundColor: isFocused ? darkColors.bgBase2 : darkColors.bgBase1,
              },
            ]}>
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

export default memo(TokenDetailTopTab);

const toolBarStyle = StyleSheet.create({
  container: {
    backgroundColor: darkColors.bgBase1,
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    alignItems: 'center',
  },
  button: {
    height: pTd(32),
    paddingHorizontal: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(8),
  },
  labelText: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
});
