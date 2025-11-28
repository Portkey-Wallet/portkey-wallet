import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';

export type GroupMemberItemType = {
  title: string;
  relationId: string;
  avatar?: string;
  userId?: string;
  [key: string]: any;
};

type GroupMemberItemPropsType<T> = {
  multiple?: boolean;
  selected?: boolean;
  item: T;
  wrapStyle?: StyleProp<ViewStyle>;
  innerWrapStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: (id: string, item: T, selected?: boolean) => void;
};

export default memo(
  function GroupMemberItem(props: GroupMemberItemPropsType<GroupMemberItemType>) {
    const {
      multiple = true,
      disabled = false,
      selected = false,
      item,
      onPress,
      wrapStyle = {},
      innerWrapStyle = {},
    } = props;

    const iconDom = useMemo(() => {
      // if disabled grey and selected ; if multiple unselected show icon, single unselect show nothing
      let iconName: IconName | undefined = multiple ? 'unselected' : undefined;
      if (disabled || selected) iconName = 'selected';

      return iconName ? (
        <Svg
          iconStyle={styles.itemIcon}
          color={disabled ? defaultColors.bg16 : selected ? defaultColors.primaryColor : undefined}
          icon={iconName}
        />
      ) : null;
    }, [disabled, multiple, selected]);

    return (
      <Touchable
        style={[styles.itemWrap, wrapStyle]}
        onPress={() => {
          if (disabled) return;
          onPress?.(item.relationId, item);
        }}>
        <View style={[styles.itemRow, disabled && styles.disable, innerWrapStyle]}>
          <CommonAvatar hasBorder resizeMode="cover" title={item.title} avatarSize={pTd(36)} imageUrl={item.avatar} />
          <View style={styles.itemContent}>
            <TextL>{item.title}</TextL>
            {iconDom}
          </View>
        </View>
      </Touchable>
    );
  },
  (preProps, nextProps) => preProps.selected === nextProps.selected && preProps.disabled === nextProps.disabled,
);

const styles = StyleSheet.create({
  itemWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginBottom: StyleSheet.hairlineWidth,
  },
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(20),
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
    opacity: 0.4,
  },
});
