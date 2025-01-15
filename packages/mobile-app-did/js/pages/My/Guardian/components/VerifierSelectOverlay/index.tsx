import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { ModalBody } from 'components/ModalBody';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import Tag from 'components/Tag';
import GStyles from 'assets/theme/GStyles';
import getStyles from './styles';

type SelectListProps = {
  id?: string;
  editGuardian?: UserGuardianItem;
  list: VerifierItem[];
  disabledMap: Record<string, boolean>;
  callBack: (item: VerifierItem) => void;
};

const SelectList = ({ callBack, id, list, disabledMap }: SelectListProps) => {
  const { t } = useLanguage();
  const styles = getStyles();

  return (
    <ModalBody title={t('Select Verifier')} modalBodyType="bottom">
      <ScrollView alwaysBounceVertical={false}>
        {list?.map((item, index) => {
          return (
            <Touchable
              style={disabledMap[item.id] && styles.disableWrap}
              disabled={disabledMap[item.id]}
              key={item.id}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <View style={[styles.itemRow, index !== 0 ? { marginTop: pTd(12) } : {}]}>
                <VerifierImage label={item.name} style={styles.verifierImageStyle} size={pTd(24)} uri={item.imageUrl} />
                <View style={styles.itemContent}>
                  <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                    <TextL>{item.name}</TextL>
                    {id !== undefined && id === item.id && <Tag style={styles.tagStyle}>Current</Tag>}
                  </View>
                  {id !== undefined && id === item.id && (
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

const showList = (params: SelectListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};
