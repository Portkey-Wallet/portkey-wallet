import React from 'react';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import styles from './styles';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { ModalBody } from '@portkey-wallet/rn-components/components/ModalBody';

type ValueType = string | number;
type DefaultValueType = string;

type ItemTypeBase<T extends ValueType = DefaultValueType> = {
  id: T;
  [key: string]: any;
};

type SelectListProps<ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType> = {
  id?: ItemValueType;
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
  labelAttrName?: string;
};

const SelectList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType>({
  list,
  callBack,
  id,
  labelAttrName = 'id',
}: SelectListProps<ItemType, ItemValueType>) => {
  const { t } = useLanguage();

  return (
    <ModalBody title={t('Select verifiers')} modalBodyType="bottom">
      <ScrollView alwaysBounceVertical={false}>
        {list.map(item => {
          return (
            <Touchable
              key={item.id}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <View style={styles.itemRow}>
                <VerifierImage
                  label={item[labelAttrName]}
                  style={styles.verifierImageStyle}
                  size={pTd(35.5)}
                  uri={item.imageUrl}
                />
                <View style={styles.itemContent}>
                  <TextL>{item[labelAttrName]}</TextL>
                  {id !== undefined && id === item.id && (
                    <CommonSvg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
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
