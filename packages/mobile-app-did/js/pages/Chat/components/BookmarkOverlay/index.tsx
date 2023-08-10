import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, StyleSheet } from 'react-native';
import { TextM } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { useBookmarkList } from 'hooks/discover';

type ValueType = string | number;
type DefaultValueType = string;

type ItemTypeBase<T extends ValueType = DefaultValueType> = {
  chainId: T;
  [key: string]: any;
};

type SelectListProps<ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType> = {
  value?: ItemValueType;
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
  labelAttrName?: string;
};

const BookmarksOverlay = () => {
  const { bookmarkList } = useBookmarkList();

  return (
    <ModalBody title={'Select Network'} modalBodyType="bottom">
      {bookmarkList.map(ele => (
        <TextM key={ele.id}>{JSON.stringify(ele)} </TextM>
      ))}
    </ModalBody>
  );
};

const showList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType = DefaultValueType>(
  params: SelectListProps<ItemType, ItemValueType>,
) => {
  console.log(params);
  Keyboard.dismiss();
  OverlayModal.show(<BookmarksOverlay />, {
    position: 'bottom',
  });
};

export default {
  showList,
};

const styles = StyleSheet.create({
  bubbleWrap: {},
  bubbleToolWrap: {
    zIndex: 1000,
    position: 'absolute',
    bottom: -30,
    left: 100,
  },
  bubbleToolItem: {
    width: 60,
    height: 60,
    // backgroundColor: 'green',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
