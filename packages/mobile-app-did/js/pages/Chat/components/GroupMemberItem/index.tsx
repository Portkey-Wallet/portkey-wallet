import { TextL } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ContactItemType, GroupMemberItemType } from '@portkey-wallet/im/types';
import CommonAvatar from 'components/CommonAvatar';
import { defaultColors } from 'assets/theme';

type GroupMemberItemPropsType<T> = {
  selected?: boolean;
  // TODO
  item: any;
  onPress?: (id: string, selected: boolean) => void;
};

export default memo(
  function GroupMemberItem(props: GroupMemberItemPropsType<GroupMemberItemType & ContactItemType>) {
    const { selected = false, item, onPress } = props;

    return (
      <Touchable style={styles.itemRow} onPress={() => onPress?.(item.id, !selected)}>
        <CommonAvatar
          hasBorder
          title={item.name || item.caHolderInfo?.walletName || item.imInfo?.name}
          avatarSize={pTd(36)}
        />
        <View style={styles.itemContent}>
          <TextL>{item.name || item.caHolderInfo?.walletName || item.imInfo?.name}</TextL>
          <Svg iconStyle={styles.itemIcon} icon={selected ? 'selected' : 'unselected'} />
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
});
