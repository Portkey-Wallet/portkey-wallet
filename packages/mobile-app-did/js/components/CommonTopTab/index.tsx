/* eslint-disable react-native/no-inline-styles */
import React, {
  memo,
  ReactElement,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  ReactNode,
} from 'react';
import { StyleSheet, TouchableOpacity, Text, View, StyleProp, ViewStyle } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { darkColors } from 'assets/theme';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { makeStyles } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';

export interface TabItemTypes {
  name: string;
  tabItemDom: ReactElement;
  suffix?: string;
}

export type CommonTopTabProps = {
  labelRightNum?: number;
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
  suffixIconDom?: ReactNode;
  suffixIconDomVisible?: boolean;
};

const Tab = createMaterialTopTabNavigator();

const CommonTopTab: React.FC<CommonTopTabProps> = props => {
  const {
    labelRightNum,
    tabList,
    initialRouteName,
    hasTabBarBorderRadius,
    swipeEnabled = false,
    hasBottomBorder = true,
    tabContainerStyle = {},
    isBlockTab,
    onTabChange,
    suffixIconDom,
    suffixIconDomVisible,
  } = props;

  const tabBarRef = useRef<any>(null);
  useEffect(() => {
    if (tabBarRef.current) {
      tabBarRef.current.changeSuffix(tabList.map(item => item.suffix));
    }
  }, [tabBarRef, tabList]);
  useEffect(() => {
    if (tabBarRef.current) {
      tabBarRef.current.changeSuffixIconDomVisible(suffixIconDomVisible);
    }
  }, [tabBarRef, suffixIconDomVisible]);
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      initialLayout={{ width: screenWidth }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={prop => (
        <CustomizedTopTabBar
          {...prop}
          labelRightNum={labelRightNum}
          isBlockTab={isBlockTab}
          hasTabBarBorderRadius={hasTabBarBorderRadius}
          hasBottomBorder={hasBottomBorder}
          containerStyle={tabContainerStyle}
          onTabChange={onTabChange}
          ref={tabBarRef}
          suffixIconDom={suffixIconDom}
        />
      )}
      screenOptions={{
        swipeEnabled,
        tabBarScrollEnabled: false,
      }}>
      {tabList.map(ele => (
        <Tab.Screen key={ele.name} name={ele.name} initialParams={{ suffix: ele.suffix }}>
          {() => ele.tabItemDom}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

const CustomizedTopTabBar = forwardRef(
  (
    {
      state,
      descriptors,
      navigation,
      hasTabBarBorderRadius = false,
      hasBottomBorder = false,
      isBlockTab = false,
      containerStyle = {},
      suffixIconDom,
      onTabChange,
    }: {
      labelRightNum?: number;
      state: { routes: any[]; index: number };
      descriptors: any;
      navigation: any;
      hasTabBarBorderRadius?: boolean;
      hasBottomBorder?: boolean;
      isBlockTab?: boolean;
      containerStyle?: StyleProp<ViewStyle>;
      suffixIconDom?: ReactNode;
      onTabChange?: (name: string) => void;
    },
    ref,
  ) => {
    const onPress = useThrottleCallback(
      (name, params) => {
        onTabChange?.(name);
        navigation.navigate(name, params);
      },
      [navigation, onTabChange],
      600,
    );
    const toolBarStyle = getToolBarStyle();
    const styles = getStyles();
    const [suffixList, setSuffixList] = useState();
    const [suffixIconDomVisible, setSuffixIconDomVisible] = useState<boolean>();

    useImperativeHandle(ref, () => ({
      changeSuffix(updateSuffixList: any) {
        setSuffixList(updateSuffixList);
      },
      changeSuffixIconDomVisible(visible: boolean) {
        setSuffixIconDomVisible(visible);
      },
    }));
    useEffect(() => {
      const name = state.routes[state.index].name;
      onTabChange?.(name);
    }, [onTabChange, state]);
    return (
      <View style={[toolBarStyle.tabBarStyle, containerStyle]}>
        <View
          style={[
            toolBarStyle.container,
            hasBottomBorder ? styles.bottomBorder : {},
            hasTabBarBorderRadius ? styles.radiusTarBarStyle : {},
          ]}>
          {state.routes.map((route, index) => {
            const suffixPro = suffixList ? suffixList[index] : undefined;
            const suffix = suffixPro || route.params?.suffix;
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
                    : { paddingRight: index !== state.routes.length - 1 ? (suffix ? pTd(16) : pTd(32)) : 0 },
                ]}>
                <Text
                  style={[
                    toolBarStyle.labelText,
                    {
                      color: isFocused ? darkColors.textBase1 : darkColors.textBase2,
                    },
                  ]}>
                  {label}
                </Text>
                {suffix && (
                  <View style={styles.suffixWrap}>
                    <TextM style={[styles.suffixText, isFocused && styles.suffixTextFocused]}>{suffix}</TextM>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {suffixIconDomVisible && suffixIconDom}
      </View>
    );
  },
);

CustomizedTopTabBar.displayName = 'CustomizedTopTabBar';

export default memo(CommonTopTab);

const getStyles = makeStyles(theme => ({
  tabBarStyle: {
    elevation: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bottomBorder: {
    borderBottomColor: theme.colors.border6,
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
  suffixWrap: {
    paddingVertical: pTd(4),
    paddingHorizontal: pTd(6),
    borderRadius: pTd(4),
    marginLeft: pTd(4),
    backgroundColor: theme.colors.bgNeutral2,
  },
  suffixText: {
    color: theme.colors.textBase2,
    ...fonts.SGRegularFont,
  },
  suffixTextFocused: {
    color: theme.colors.textBase1,
  },
}));

const getToolBarStyle = makeStyles(theme => ({
  tabBarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: pTd(16),
    height: pTd(54),
    backgroundColor: theme.colors.bgBase1,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    height: pTd(54),
    alignItems: 'center',
  },
  label: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  blockTab: {
    padding: pTd(8),
    borderRadius: pTd(8),
  },
  selectedBlockTab: {
    backgroundColor: theme.colors.bgBase2,
  },
  labelText: {
    fontSize: pTd(18),
    lineHeight: pTd(22.5),
  },
}));
