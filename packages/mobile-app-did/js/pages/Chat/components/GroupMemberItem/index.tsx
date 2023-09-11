import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';

type GroupMemberItemType = {
  title: string;
  relationId: string;
};

type GroupMemberItemPropsType = {
  multiple?: boolean;
  selected?: boolean;
  item: GroupMemberItemType;
  disabled?: boolean;
  onPress?: (id: string, selected?: boolean) => void;
};

export default memo(
  function GroupMemberItem(props: GroupMemberItemPropsType) {
    const { multiple = true, disabled = false, selected = false, item, onPress } = props;

    console.log('item', item);

    const iconDom = useMemo(() => {
      let iconName: IconName | undefined;
      if (multiple) {
        iconName = disabled || selected ? 'selected' : 'unselected';
      } else {
        iconName = disabled || selected ? 'selected' : undefined;
      }

      return iconName ? <Svg iconStyle={styles.itemIcon} icon={iconName} /> : null;
    }, [disabled, multiple, selected]);

    return (
      <Touchable
        disabled={disabled}
        style={[styles.itemRow, disabled && styles.disable]}
        onPress={() => {
          onPress?.(item.relationId);
        }}>
        <CommonAvatar hasBorder title={item.title} avatarSize={pTd(36)} />
        <View style={styles.itemContent}>
          <TextL>{item.title}</TextL>
          {iconDom}
        </View>
      </Touchable>
    );
  },
  (preProps, nextProps) => preProps.selected === nextProps.selected,
);

const styles = StyleSheet.create({
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(20),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginBottom: StyleSheet.hairlineWidth,
  },
  itemContent: {
    flex: 1,
    marginLeft: pTd(8),
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  disable: {
    opacity: 0.5,
  },
});
