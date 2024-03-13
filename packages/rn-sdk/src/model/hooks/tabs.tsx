import React, { FC, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

export const RNTabView = (config: UseTabConfig) => {
  const { tabs } = config;
  const [index, setIndex] = useState(0);
  const [routes] = useState(tabs.map(item => ({ key: item.key, title: item.title })));
  const sceneMap = useMemo(() => {
    const sceneProps: SceneMap = {};
    tabs.forEach(item => {
      sceneProps[item.key] = item.component;
    });
    return SceneMap(sceneProps);
  }, [tabs]);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={sceneMap}
      onIndexChange={setIndex}
      initialLayout={{ width: 0, height: 0 }}
      renderTabBar={renderTabBar}
      style={styles.containerStyle}
    />
  );
};

const renderTabBar = (props: any) => {
  return (
    <TabBar
      {...props}
      style={styles.tabBar}
      getLabelText={scene => {
        return scene.route.title;
      }}
      activeColor={defaultColors.bg5}
      inactiveColor="black"
      tabStyle={styles.tabStyle}
      labelStyle={styles.labelFocused}
      indicatorStyle={styles.indicatorStyle}
      indicatorContainerStyle={styles.indicatorContainerStyle}
      renderLabel={renderLabel}
    />
  );
};

const renderLabel = (props: { color: string; route: { title: string } }) => {
  const { color, route } = props;
  const { title } = route;
  return <Text style={[styles.labelFocused, { color }]}>{title ?? ''}</Text>;
};

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: -10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  labelFocused: {
    fontWeight: '400',
  },
  indicatorStyle: {
    backgroundColor: defaultColors.bg5,
  },
  indicatorContainerStyle: {
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  tabStyle: {
    backgroundColor: 'white',
  },
  tabBar: {
    backgroundColor: defaultColors.bg1,
    shadowColor: defaultColors.border1,
    shadowOffset: {
      height: pTd(3),
      width: 0,
    },
  },
});

export interface UseTabConfig {
  tabs: TabProps[];
  defaultTab?: string;
}

interface SceneMap {
  [key: string]: FC;
}

export interface TabProps {
  key: string;
  title: string;
  component: FC;
}
