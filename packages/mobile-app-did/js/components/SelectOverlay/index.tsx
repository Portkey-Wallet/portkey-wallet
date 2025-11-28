import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, ScrollView } from 'react-native';
import { TextL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';

type DataItemType<T> = { value: T; label: string };
type SelectModalProps<T> = {
  value?: T;
  dataList?: DataItemType<T>[];
  title?: string;
  onChangeValue?: (item: DataItemType<T>) => void;
};

const SelectModal = <T,>({ title = '', value, dataList = [], onChangeValue }: SelectModalProps<T>) => {
  const { t } = useLanguage();
  return (
    <ModalBody modalBodyType="bottom" title={t(title)}>
      <ScrollView style={styles.wrapStyle}>
        {dataList.map((ele, index) => (
          <Touchable
            key={index}
            style={[styles.item, index !== 0 && styles.itemMarginTop]}
            onPress={() => {
              onChangeValue?.(ele);
              OverlayModal.hide();
            }}>
            <TextL>{ele.label}</TextL>
            {value === ele.value && <Svg icon="check-circle" size={pTd(24)} />}
          </Touchable>
        ))}
      </ScrollView>
    </ModalBody>
  );
};

export const showSelectModal = <T extends string | number>(props: SelectModalProps<T>) => {
  OverlayModal.show(<SelectModal {...props} />, {
    position: 'bottom',
  });
};

export default {
  showSelectModal,
};

export const styles = StyleSheet.create({
  wrapStyle: {
    paddingHorizontal: pTd(16),
  },
  item: {
    height: pTd(48),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemMarginTop: {
    marginTop: pTd(12),
  },
  label: {
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
});
