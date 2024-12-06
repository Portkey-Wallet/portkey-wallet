import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { GUARDIAN_ITEM_TYPE_ICON } from 'constants/misc';

type ValueType = string | number;
type DefaultValueType = string;

type ItemTypeBase<T extends ValueType = DefaultValueType> = {
  value: T;
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
  labelAttrName = 'value',
}: SelectListProps<ItemType, ItemValueType>) => {
  const { t } = useLanguage();

  return (
    <ModalBody title={t('Select Guardians Type')} modalBodyType="bottom">
      <ScrollView alwaysBounceVertical={false}>
        {list.map((item, index) => {
          return (
            <Touchable
              key={item.value}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <View
                style={[
                  styles.itemRow,
                  index !== 0
                    ? {
                        marginTop: pTd(12),
                      }
                    : {},
                ]}>
                <View style={styles.itemContent}>
                  {item.icon && (
                    <View style={[GStyles.center, styles.itemIconWrap]}>
                      <Svg icon={GUARDIAN_ITEM_TYPE_ICON[item.value]} size={pTd(24)} />
                      {/* <Svg icon={item.icon} size={pTd(24)} /> */}
                    </View>
                  )}
                  <TextL>{item[labelAttrName]}</TextL>
                  {value !== undefined && value === item.value && (
                    <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                  )}
                </View>
              </View>
            </Touchable>
          );
        })}
      </ScrollView>
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
