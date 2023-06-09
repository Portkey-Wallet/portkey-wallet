import React, { useCallback, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { useGStyles } from 'assets/theme/useGStyles';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';

type SelectListProps = {
  value?: string; // `${country}_${currency}`
  list: Array<FiatType>;
  callBack: (item: FiatType) => void;
};

const SelectCurrency = ({ list, callBack, value }: SelectListProps) => {
  const { t } = useLanguage();
  const gStyle = useGStyles();
  const [keyWord, setKeyWord] = useState<string>('');

  const _list = useMemo(() => {
    const _keyWord = keyWord?.trim().toLocaleLowerCase();
    return _keyWord === ''
      ? list
      : list.filter(
          item =>
            item.currency.toLocaleLowerCase().includes(_keyWord) ||
            item.countryName?.toLocaleLowerCase().includes(_keyWord),
        );
  }, [keyWord, list]);

  const renderItem = useCallback(
    ({ item }: { item: FiatType }) => {
      return (
        <Touchable
          onPress={() => {
            OverlayModal.hide();
            callBack(item);
          }}>
          <View style={styles.itemRow}>
            <Image style={styles.fiatIconStyle} source={{ uri: item.icon || '' }} />
            <View style={styles.itemContent}>
              <TextL>{`${item.countryName || ''} - ${item.currency}`}</TextL>

              {value !== undefined && value === `${item.country}_${item.currency}` && (
                <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
              )}
            </View>
          </View>
        </Touchable>
      );
    },
    [callBack, value],
  );

  return (
    <ModalBody style={gStyle.overlayStyle} title={t('Select Currency')} modalBodyType="bottom">
      <View style={styles.titleWrap}>
        <CommonInput
          containerStyle={styles.titleInputWrap}
          inputContainerStyle={styles.titleInputWrap}
          inputStyle={styles.titleInput}
          leftIconContainerStyle={styles.titleIcon}
          value={keyWord}
          placeholder={t('Search currency')}
          onChangeText={setKeyWord}
        />
      </View>
      <FlatList
        disableScrollViewPanResponder={true}
        data={_list}
        renderItem={renderItem}
        ListEmptyComponent={<TextL style={styles.noResult}>{t('No results found')}</TextL>}
        keyExtractor={item => `${item.country}_${item.currency}`}
      />
    </ModalBody>
  );
};

const showList = (params: SelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectCurrency {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};

const styles = StyleSheet.create({
  titleWrap: {
    paddingHorizontal: pTd(16),
    marginBottom: pTd(8),
  },
  titleLabel: {
    textAlign: 'center',
    marginVertical: pTd(16),
  },
  titleInputWrap: {
    height: pTd(44),
  },
  titleInput: {
    fontSize: pTd(14),
  },
  titleIcon: {
    marginLeft: pTd(16),
  },
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginHorizontal: pTd(20),
  },
  itemContent: {
    flex: 1,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(16),
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
  fiatIconStyle: {
    width: pTd(32),
    height: pTd(32),
    marginRight: pTd(16),
  },
});
