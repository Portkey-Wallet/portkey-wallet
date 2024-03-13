import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { useGStyles } from 'assets/theme/useGStyles';
import { ModalBody } from 'components/ModalBody';
import { useCurrentNetworkType } from 'model/hooks/network';

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

const SelectList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType>({
  list,
  callBack,
  value,
  labelAttrName = 'chainId',
}: SelectListProps<ItemType, ItemValueType>) => {
  const { t } = useLanguage();
  const gStyle = useGStyles;
  const networkType = useCurrentNetworkType();

  return (
    <ModalBody style={gStyle.overlayStyle} title={t('Select Network')} modalBodyType="bottom">
      {list.length ? (
        <ScrollView alwaysBounceVertical={false} style={styles.scrollWrap}>
          {list.map(item => {
            return (
              <Touchable
                key={item.chainId}
                onPress={() => {
                  OverlayModal.hide();
                  callBack(item);
                }}>
                <View style={styles.itemRow}>
                  {networkType === 'MAINNET' ? (
                    <Svg icon="mainnet" size={pTd(40)} />
                  ) : (
                    <Svg icon="testnet" size={pTd(40)} />
                  )}
                  <View style={styles.itemContent}>
                    <TextL>{item[labelAttrName]}</TextL>
                    {value !== undefined && value === item.chainId && (
                      <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                    )}
                  </View>
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
      ) : (
        <TextL style={styles.noResult}>{t('No results found')}</TextL>
      )}
    </ModalBody>
  );
};

const showList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType = DefaultValueType>(
  params: SelectListProps<ItemType, ItemValueType>,
) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList<ItemType, ItemValueType> {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};
