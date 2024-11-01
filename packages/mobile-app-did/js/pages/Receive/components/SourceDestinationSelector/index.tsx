import React, { useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import { TextM } from 'components/CommonText';

type TSelectItem = {
  name: string;
  icon: string;
  key: string;
};

export enum SourceDestinationTypeEnum {
  Source = 'Source',
  Destination = 'Destination',
}

type SelectListProps = {
  type: SourceDestinationTypeEnum;
  title: string;
  list: Array<TSelectItem>;
  selectedIndex: string;
  onSelected: (item: TSelectItem, key: string) => void;
};

const SelectList = ({ type, title, list, selectedIndex, onSelected }: SelectListProps) => {
  const styles = getStyles();
  const aelfChainArr = useMemo(() => {
    return type === SourceDestinationTypeEnum.Source ? list.filter(item => item.name.includes('aelf')) : [];
  }, [list, type]);
  const otherChainArr = useMemo(() => {
    return type === SourceDestinationTypeEnum.Source ? list.filter(item => !item.name.includes('aelf')) : [];
  }, [list, type]);

  const renderList = useCallback(
    (_list: TSelectItem[]) => {
      return (
        <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
          {_list.map(item => {
            return (
              <Touchable
                style={styles.itemWrap}
                key={item.name}
                onPress={() => {
                  OverlayModal.hide();
                  selectedIndex !== item.key && onSelected(item, item.key);
                }}>
                <View style={styles.itemLeft}>
                  <CommonAvatar avatarSize={pTd(24)} imageUrl={item.icon} />
                  <Text style={styles.nameText}>{item.name}</Text>
                </View>
                {selectedIndex === item.key && (
                  <Svg icon="checked_circle" size={pTd(24)} iconStyle={styles.checkedIcon} />
                )}
              </Touchable>
            );
          })}
        </ScrollView>
      );
    },
    [onSelected, selectedIndex, styles],
  );

  const renderSourceChainList = useCallback(() => {
    return (
      <>
        {aelfChainArr.length && (
          <View>
            <TextM style={styles.chainTitle}>{`aelf chains`}</TextM>
            {renderList(aelfChainArr)}
          </View>
        )}
        {otherChainArr.length && (
          <View>
            <TextM style={styles.chainTitle}>{`Other chains via bridge`}</TextM>
            {renderList(otherChainArr)}
          </View>
        )}
      </>
    );
  }, [aelfChainArr, otherChainArr, renderList, styles.chainTitle]);

  return (
    <ModalBody title={title} modalBodyType="bottom">
      {type === SourceDestinationTypeEnum.Destination ? renderList(list) : renderSourceChainList()}
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
