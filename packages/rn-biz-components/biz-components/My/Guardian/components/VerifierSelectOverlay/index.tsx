import React, { useMemo } from 'react';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import styles from './styles';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { TextL, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { VerifierImage } from '../../../../Guardian/components/VerifierImage';
import { ModalBody } from '@portkey-wallet/rn-components/components/ModalBody';
import { useGuardiansInfo } from '@portkey-wallet/rn-base/hooks/store';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';

type SelectListProps = {
  id?: string;
  editGuardian?: UserGuardianItem;
  callBack: (item: VerifierItem) => void;
};

const SelectList = ({ callBack, id, editGuardian }: SelectListProps) => {
  const { t } = useLanguage();
  const { verifierMap, userGuardiansList } = useGuardiansInfo();
  const verifierList = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);
  const disabledMap = useMemo(() => {
    if (!userGuardiansList) return {};
    const guardianList = userGuardiansList.filter(item => item.key !== editGuardian?.key);
    const map: Record<string, boolean> = {};
    guardianList.forEach(item => {
      map[item.verifier?.id || ''] = true;
    });
    return map;
  }, [editGuardian, userGuardiansList]);

  return (
    <ModalBody title={t('Select Verifier')} modalBodyType="bottom">
      <ScrollView alwaysBounceVertical={false}>
        {verifierList.map(item => {
          return (
            <Touchable
              style={disabledMap[item.id] && styles.disableWrap}
              disabled={disabledMap[item.id]}
              key={item.id}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <View style={styles.itemRow}>
                <VerifierImage label={item.name} style={styles.verifierImageStyle} size={pTd(32)} uri={item.imageUrl} />
                <View style={styles.itemContent}>
                  <TextL>{item.name}</TextL>
                  {id !== undefined && id === item.id && (
                    <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                  )}
                </View>
              </View>
            </Touchable>
          );
        })}
        <View style={styles.warnWrap}>
          <Svg icon="warning2" size={pTd(16)} color={defaultColors.icon1} />
          <TextM style={styles.warnLabelWrap}>{'Used verifiers cannot be selected.'}</TextM>
        </View>
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
