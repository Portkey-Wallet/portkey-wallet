import React, { useCallback, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View, Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { makeStyles } from '@rneui/themed';
import { IRampFiatItem } from '@portkey-wallet/ramp';
import useDebounce from 'hooks/useDebounce';

type SelectListProps = {
  list: Array<IRampFiatItem>;
  selectedItem: IRampFiatItem;
  onSelected: (item: IRampFiatItem) => void;
};

const CurrencyList = ({ list, selectedItem, onSelected }: SelectListProps) => {
  const styles = getStyles();
  const [searchKeyword, setSearchKeyword] = useState('');

  const debounceSearchKeyword = useDebounce(searchKeyword, 800);

  const onSearchInputChange = useCallback(
    (text: string) => {
      setSearchKeyword(text.trim());
    },
    [setSearchKeyword],
  );

  console.log('selectedItem : ', selectedItem);

  const filteredList = useMemo(() => {
    if (debounceSearchKeyword.length <= 0) return list;
    return list.filter(item =>
      `${item.countryName} (${item.symbol})`.toLowerCase().includes(debounceSearchKeyword.toLowerCase()),
    );
  }, [list, debounceSearchKeyword]);

  return (
    <ModalBody title={'Change currency'} modalBodyType="bottom">
      <CommonInput
        containerStyle={styles.searchInput}
        inputContainerStyle={styles.searchInputContainer}
        onChangeText={onSearchInputChange}
      />
      <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
        {filteredList.map((item, index) => {
          return (
            <Touchable
              style={[styles.itemWrap, { marginTop: index > 0 ? pTd(12) : 0 }]}
              key={item.countryName + item.symbol}
              onPress={() => {
                OverlayModal.hide();
                selectedItem.countryName !== item.countryName && selectedItem.symbol !== item.symbol && onSelected(item);
              }}>
              <Text style={styles.nameText}>{`${item.countryName} (${item.symbol})`}</Text>
              {selectedItem.countryName === item.countryName && selectedItem.symbol === item.symbol && (
                <Svg icon="checked_circle" size={pTd(24)} iconStyle={styles.checkedIcon} />
              )}
            </Touchable>
          );
        })}
      </ScrollView>
    </ModalBody>
  );
};

const showList = (params: SelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<CurrencyList {...params} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showList,
};

const getStyles = makeStyles(theme => ({
  searchInput: {
    height: pTd(40),
    marginVertical: pTd(12),
    borderRadius: pTd(20),
  },
  searchInputContainer: {
    marginHorizontal: pTd(16),
  },
  scrollWrap: {
    height: '100%',
  },
  itemWrap: {
    height: pTd(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    marginLeft: pTd(16),
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
  checkedIcon: {
    marginRight: pTd(16),
  },
}));
