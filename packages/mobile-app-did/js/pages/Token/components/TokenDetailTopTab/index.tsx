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
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ paddingRight: index !== state.routes.length - 1 ? pTd(32) : 0 }}>
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
    height: pTd(54),
    alignItems: 'center',
  },
  labelText: {
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
});
