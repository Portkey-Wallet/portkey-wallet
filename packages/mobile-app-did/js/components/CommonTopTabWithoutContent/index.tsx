import React from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';

interface ITabItem<T> {
  name: string;
  key: T;
}

interface ICommonTopTabWithoutContentProps<T> {
  tabList: ITabItem<T>[];
  selectTab: T;
  onTabPress: (key: T) => void;
}

function CommonTopTabWithoutContent<T extends string>({
  tabList,
  selectTab,
  onTabPress,
}: ICommonTopTabWithoutContentProps<T>) {
  const styles = getStyles();
  return (
    <View style={styles.tabContainer}>
      {tabList.map((ele, index) => {
        const isSelected = selectTab === ele.key;
        return (
          <Touchable
            key={index}
            style={[styles.tabItem, isSelected && styles.selectTabItem, index !== 0 && styles.tabItemMarginLeft]}
            onPress={() => onTabPress(ele.key)}>
            <Text style={[styles.tabItemText, isSelected && styles.selectTabText]}>{ele.name}</Text>
          </Touchable>
        );
      })}
    </View>
  );
}

export default CommonTopTabWithoutContent;

const getStyles = makeStyles(theme => ({
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pTd(4),
    paddingHorizontal: pTd(12),
    borderRadius: pTd(8),
  },
  tabItemMarginLeft: {
    marginLeft: pTd(8),
  },
  selectTabItem: {
    backgroundColor: theme.colors.bgBase2,
  },
  tabItemText: {
    fontSize: pTd(16),
    lineHeight: pTd(22),
    color: theme.colors.textNeutral3,
  },
  selectTabText: {
    color: theme.colors.textNeutral1,
  },
}));
