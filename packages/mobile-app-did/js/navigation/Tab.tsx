import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoard from 'pages/DashBoard';
import Svg, { IconName } from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import MyMenu from 'pages/My';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useLogOut from 'hooks/useLogOut';
import useInitData from 'hooks/useInitData';
import DiscoverHome from 'pages/Discover/DiscoverHome';
import ChatHome from 'pages/Chat/ChatHomePage';
import TradeHomePage from 'pages/Trade/TradeHomePage';
import { formatMessageCountToStr } from '@portkey-wallet/utils/chat';
import { StyleSheet, Animated, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { TextS } from 'components/CommonText';
import { useIsChatShow, useTabMenuList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { setBadge } from 'utils/notifee';
import { ReferralStatusEnum } from '@portkey-wallet/store/store-ca/referral/type';
import { SvgXml } from 'react-native-svg';
import svgs from 'assets/image/svgs';
import myEvents from 'utils/deviceEvent';
import { TabRouteNameEnum } from 'types/navigate';
import navigationService from 'utils/navigationService';

const Tab = createBottomTabNavigator();

export interface IRenderTabMenuItem {
  name: TabRouteNameEnum;
  label: string;
  index: number;
  icon: IconName;
  largeIcon?: IconName;
  component: React.FC;
  isDefault?: boolean;
}

export const tabMenuTypeMap: Record<TabRouteNameEnum, IRenderTabMenuItem> = {
  [TabRouteNameEnum.WALLET]: {
    name: TabRouteNameEnum.WALLET,
    index: 0,
    label: 'Wallet',
    icon: 'logo-icon',
    isDefault: true,
    component: DashBoard,
  },
  [TabRouteNameEnum.DISCOVER]: {
    name: TabRouteNameEnum.DISCOVER,
    index: 1,
    label: 'Discover',
    icon: 'discover',
    component: DiscoverHome,
  },
  [TabRouteNameEnum.TRADE]: {
    name: TabRouteNameEnum.TRADE,
    index: 2,
    label: 'Trade',
    largeIcon: 'trade',
    icon: 'trade-small',
    component: TradeHomePage,
  },
  [TabRouteNameEnum.CHAT]: {
    name: TabRouteNameEnum.CHAT,
    index: 3,
    label: 'Chat',
    icon: 'chat-tab',
    component: ChatHome,
  },
  [TabRouteNameEnum.SETTINGS]: {
    name: TabRouteNameEnum.SETTINGS,
    isDefault: true,
    index: 4,
    label: 'My',
    icon: 'my',
    component: MyMenu,
  },
};

export const defaultTabMenuList = Object.values(tabMenuTypeMap).filter(item => item.isDefault);

export default function TabRoot() {
  const { t } = useLanguage();
  const { address } = useCurrentWalletInfo();
  const tabMenuListStore = useTabMenuList();
  const unreadCount = useUnreadCount();
  const isImputation = useIsImputation();
  const isChatShow = useIsChatShow();
  const { viewReferralStatus } = useReferral();
  const rotateAnimate = useRef(new Animated.Value(0)).current;
  const rotatedRef = useRef(false);
  const logOut = useLogOut();

  const tabMenuList = useMemo(() => {
    const _tabMenuListStore = tabMenuListStore.reduce((acc: typeof tabMenuListStore, cur) => {
      if (!acc.find(item => item.type.value === cur.type.value)) {
        acc.push(cur);
      }
      return acc;
    }, []);

    if (!_tabMenuListStore.length) return defaultTabMenuList;

    return _tabMenuListStore
      .map(item => ({
        name: item?.type?.value,
        label: item?.title,
        index: item?.index,
        icon: tabMenuTypeMap?.[item?.type?.value as TabRouteNameEnum]?.icon || 'my',
        component: tabMenuTypeMap?.[item?.type?.value as TabRouteNameEnum]?.component,
      }))
      .filter(item => item.component !== undefined);
  }, [tabMenuListStore]);

  const rotateButton = useCallback(async () => {
    const rotateToValue = rotatedRef.current ? 180 : 0;
    await Animated.timing(rotateAnimate, {
      toValue: rotateToValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
    rotatedRef.current = !rotatedRef.current;
    navigationService.navToBottomTab(TabRouteNameEnum.TRADE);
  }, [rotateAnimate]);

  const rotateStyle = {
    transform: [
      {
        rotate: rotateAnimate.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  // init data
  useInitData();

  useEffect(() => {
    if (!address) logOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    // TODO: need to adjust other message
    if (!isChatShow) return;
    setBadge(unreadCount);
  }, [isChatShow, unreadCount]);

  // rotate btn
  useEffect(() => {
    const listener = myEvents.rotateTabTrade.addListener(rotateButton);
    return () => listener.remove();
  }, [rotateButton]);

  if (tabMenuList.length >= 5)
    return (
      <Tab.Navigator
        initialRouteName="Wallet"
        screenOptions={({ route }) => ({
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarAllowFontScaling: false,
          header: () => null,
          tabBarIcon: ({ focused }) => {
            const tabMenu = tabMenuList.find(tab => tab.name === route.name);
            if (tabMenu?.name === TabRouteNameEnum.CHAT) {
              return (
                <View style={styles.chatWrap}>
                  {unreadCount > 0 && <TextS style={styles.messageCount}>{formatMessageCountToStr(unreadCount)}</TextS>}
                  <Svg
                    icon={tabMenu?.icon || 'my'}
                    size={pTd(24)}
                    color={focused ? defaultColors.font4 : defaultColors.font7}
                  />
                </View>
              );
            } else if (tabMenu?.name === TabRouteNameEnum.SETTINGS) {
              return (
                <View style={styles.chatWrap}>
                  {(isImputation || viewReferralStatus === ReferralStatusEnum.UN_VIEWED) && (
                    <TextS style={styles.warningCycle} />
                  )}
                  <Svg
                    icon={tabMenu?.icon || 'my'}
                    size={pTd(24)}
                    color={focused ? defaultColors.font4 : defaultColors.font7}
                  />
                </View>
              );
            } else if (tabMenu?.name === TabRouteNameEnum.TRADE) {
              return (
                <View style={styles.tradeWrap}>
                  <Animated.View style={rotateStyle}>
                    <SvgXml xml={svgs.trade} width={pTd(40)} height={pTd(40)} />
                  </Animated.View>
                </View>
              );
            }

            return (
              <Svg
                icon={tabMenu?.icon || 'my'}
                size={pTd(24)}
                color={focused ? defaultColors.font4 : defaultColors.font7}
              />
            );
          },
        })}>
        {tabMenuList.map(ele => (
          <Tab.Screen
            key={ele.name}
            name={ele.name}
            component={ele.component}
            options={{
              title: t(ele.label),
              tabBarActiveTintColor: defaultColors.font4,
            }}
          />
        ))}
      </Tab.Navigator>
    );

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={({ route }) => ({
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarAllowFontScaling: false,
        header: () => null,
        tabBarIcon: ({ focused }) => {
          const tabMenu = tabMenuList.find(tab => tab.name === route.name);
          if (tabMenu?.name === TabRouteNameEnum.CHAT) {
            return (
              <View style={styles.chatWrap}>
                {unreadCount > 0 && <TextS style={styles.messageCount}>{formatMessageCountToStr(unreadCount)}</TextS>}
                <Svg
                  icon={tabMenu?.icon || 'my'}
                  size={pTd(24)}
                  color={focused ? defaultColors.font4 : defaultColors.font7}
                />
              </View>
            );
          } else if (tabMenu?.name === TabRouteNameEnum.SETTINGS) {
            return (
              <View style={styles.chatWrap}>
                {(isImputation || viewReferralStatus === ReferralStatusEnum.UN_VIEWED) && (
                  <TextS style={styles.warningCycle} />
                )}
                <Svg
                  icon={tabMenu?.icon || 'my'}
                  size={pTd(24)}
                  color={focused ? defaultColors.font4 : defaultColors.font7}
                />
              </View>
            );
          }

          return (
            <Svg
              icon={tabMenu?.icon || 'my'}
              size={pTd(24)}
              color={focused ? defaultColors.font4 : defaultColors.font7}
            />
          );
        },
      })}>
      {tabMenuList.map(ele => (
        <Tab.Screen
          key={ele.name}
          name={ele.name}
          component={ele.component}
          options={{
            title: t(ele.label),
            tabBarActiveTintColor: defaultColors.font4,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  chatWrap: {
    position: 'relative',
  },
  tradeWrap: {
    paddingBottom: pTd(15),
  },
  messageCount: {
    position: 'absolute',
    zIndex: 1000,
    left: pTd(15),
    top: -pTd(6),
    height: pTd(17),
    minWidth: pTd(17),
    borderColor: defaultColors.bg1,
    borderWidth: pTd(1),
    borderRadius: pTd(9),
    backgroundColor: defaultColors.bg17,
    color: defaultColors.font2,
    overflow: 'hidden',
    textAlign: 'center',
    paddingHorizontal: pTd(4),
    lineHeight: pTd(isIOS ? 15 : 17),
  },
  warningCycle: {
    position: 'absolute',
    zIndex: 1000,
    right: -pTd(3),
    top: -pTd(3),
    borderRadius: pTd(4),
    width: pTd(8),
    height: pTd(8),
    backgroundColor: defaultColors.bg17,
    overflow: 'hidden',
  },
  tabBarLabelStyle: {
    paddingBottom: isIOS ? 0 : 5,
  },
});
