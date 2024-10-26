import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';

type TSelectItem = {
  name: string;
  icon: string;
};

type SelectListProps = {
  title: string;
  list: Array<TSelectItem>;
  selectedIndex: number;
  onSelected: (item: TSelectItem, index: number) => void;
};

const SelectList = ({ title, list, selectedIndex, onSelected }: SelectListProps) => {
  const styles = getStyles();

  return (
    <ModalBody title={title} modalBodyType="bottom">
      <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
        {list.map((item, index) => {
          return (
            <Touchable
              style={styles.itemWrap}
              key={item.name}
              onPress={() => {
                OverlayModal.hide();
                selectedIndex !== index && onSelected(item, index);
              }}>
              <View style={styles.itemLeft}>
                <CommonAvatar avatarSize={pTd(24)} imageUrl={item.icon} />
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              {selectedIndex === index && <Svg icon="checked_circle" size={pTd(24)} iconStyle={styles.checkedIcon} />}
            </Touchable>
          );
        })}
      </ScrollView>
    </ModalBody>
  );
};

const showList = (params: SelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};

const getStyles = makeStyles(theme => ({
  scrollWrap: {},
  itemWrap: {
    marginTop: pTd(12),
    marginBottom: pTd(12),
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
    marginLeft: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    marginLeft: pTd(12),
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
  checkedIcon: {
    marginRight: pTd(16),
  },
}));
