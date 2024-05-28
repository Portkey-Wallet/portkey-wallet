import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, ScrollView } from 'react-native';
import { TextL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import Touchable from 'components/Touchable';

type DataItemType = { value: string | number; label: string };
type SelectModalProps = {
  value?: string | number;
  dataList?: DataItemType[];
  title?: string;
  onChangeValue?: (item: DataItemType) => void;
};

const SelectModal = ({ title = '', value = 1, dataList = [], onChangeValue }: SelectModalProps) => {
  const { t } = useLanguage();
  return (
    <ModalBody modalBodyType="bottom" title={title}>
      <ScrollView style={styles.wrapStyle}>
        {dataList.map(ele => (
          <Touchable
            key={ele.value}
            style={styles.item}
            onPress={() => {
              onChangeValue?.(ele);
              OverlayModal.hide();
            }}>
            <TextL>{ele.label}</TextL>
            {value === ele.value && <Svg icon="selected" size={pTd(24)} color={defaultColors.primaryColor} />}
          </Touchable>
        ))}
      </ScrollView>
    </ModalBody>
  );
};

export const showSelectModal = (props: SelectModalProps) => {
  OverlayModal.show(<SelectModal {...props} />, {
    position: 'bottom',
  });
};

export default {
  showSelectModal,
};

export const styles = StyleSheet.create({
  wrapStyle: {
    paddingHorizontal: pTd(20),
    flex: 1,
  },
  item: {
    height: 72,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
  },
  label: {
    fontSize: pTd(14),
    color: defaultColors.font5,
  },
});
