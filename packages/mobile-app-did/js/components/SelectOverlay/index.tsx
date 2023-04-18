import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { TextL, TextM } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';

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
    <ModalBody modalBodyType="center" style={styles.modalStyle}>
      <TextL style={styles.title}>{title}</TextL>
      <View style={styles.divider} />

      <View style={styles.listWrap}>
        {dataList.map(ele => (
          <TouchableOpacity
            style={styles.item}
            key={ele.value}
            onPress={() => {
              onChangeValue?.(ele);
              OverlayModal.hide();
            }}>
            <TextM>{t(ele.label)}</TextM>
            {ele.value === value ? <Svg icon="selected" size={pTd(20)} color={defaultColors.primaryColor} /> : <Text />}
          </TouchableOpacity>
        ))}
      </View>
    </ModalBody>
  );
};

export const showSelectModal = (props: SelectModalProps) => {
  OverlayModal.show(<SelectModal {...props} />, {
    position: 'center',
  });
};

export default {
  showSelectModal,
};

export const styles = StyleSheet.create({
  modalStyle: {
    width: pTd(287),
  },
  title: {
    textAlign: 'center',
    height: pTd(22),
    lineHeight: pTd(22),
    marginVertical: pTd(13),
    ...fonts.mediumFont,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border6,
  },
  listWrap: {
    paddingTop: pTd(8),
    paddingBottom: pTd(8),
  },
  item: {
    width: '100%',
    paddingLeft: pTd(24),
    paddingRight: pTd(24),
    height: pTd(44),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: pTd(14),
    color: defaultColors.font5,
  },
});
