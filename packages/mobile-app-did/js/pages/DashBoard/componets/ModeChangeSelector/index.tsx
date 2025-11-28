import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import { ViewStyleType } from 'types/styles';

type TSelectItem = {
  name: string;
  icon?: string;
  imageUrl?: string;
  key: string;
};

export enum SourceDestinationTypeEnum {
  Source = 'Source',
  Destination = 'Destination',
}

type SelectListProps = {
  list: Array<TSelectItem>;
  selectedIndex: string;
  iconSize?: number;
  isShowRightCloseIcon?: boolean;
  title?: string;
  onSelected: (item: TSelectItem, key: string) => void;
  topWrapStyle?: ViewStyleType;
};

const SelectList = ({
  list,
  selectedIndex,
  iconSize,
  isShowRightCloseIcon,
  title,
  topWrapStyle,
  onSelected,
}: SelectListProps) => {
  const styles = getStyles();
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(selectedIndex);

  const renderModeList = useCallback(() => {
    return (
      <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
        {list.map(item => {
          console.log('item', item.key);
          return (
            <Touchable
              style={styles.itemWrap}
              key={item.name}
              onPress={() => {
                OverlayModal.hide();
                if (selectedIndex !== item.key) {
                  setCurrentSelectedIndex(item.key);
                  onSelected(item, item.key);
                }
              }}>
              <View style={styles.itemLeft}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore*/}
                {item.icon && <Svg icon={item.icon} />}
                {item.imageUrl && <CommonAvatar avatarSize={pTd(iconSize ?? 24)} imageUrl={item.imageUrl} />}
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              {currentSelectedIndex === item.key && (
                <Svg icon="checked_circle" size={pTd(24)} iconStyle={styles.checkedIcon} />
              )}
            </Touchable>
          );
        })}
      </ScrollView>
    );
  }, [
    currentSelectedIndex,
    iconSize,
    list,
    onSelected,
    selectedIndex,
    styles.checkedIcon,
    styles.itemLeft,
    styles.itemWrap,
    styles.nameText,
    styles.scrollWrap,
  ]);

  return (
    <ModalBody
      modalBodyType="bottom"
      isShowRightCloseIcon={!!isShowRightCloseIcon}
      title={title}
      topWrapStyle={topWrapStyle}>
      {renderModeList()}
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
  chainTitle: {
    marginLeft: pTd(16),
    color: theme.colors.textBase2,
  },
}));
