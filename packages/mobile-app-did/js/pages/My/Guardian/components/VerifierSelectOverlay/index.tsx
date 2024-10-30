import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import Svg from 'components/Svg';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { VerifierImage } from 'pages/Guardian/components/VerifierImage';
import { ModalBody } from 'components/ModalBody';
import { useGuardiansInfo } from 'hooks/store';
import { VerifierItem, zkLoginVerifierItem } from '@portkey-wallet/types/verifier';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { defaultColors } from 'assets/theme';
import { isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';

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
    if (editGuardian && isZKLoginSupported(editGuardian.guardianType)) {
      verifierList.forEach(item => {
        if (item.id !== zkLoginVerifierItem.id) {
          map[item.id] = true;
        } else {
          map[item.id] = false;
        }
      });
    } else {
      map[zkLoginVerifierItem.id] = true;
    }
    return map;
  }, [editGuardian, userGuardiansList, verifierList]);

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
                    <Svg
                      iconStyle={styles.itemIcon}
                      icon="selected"
                      size={pTd(24)}
                      color={defaultColors.primaryColor}
                    />
                  )}
                </View>
              </View>
            </Touchable>
          );
        })}
        <View style={styles.warnWrap}>
          <Svg icon="warning2" size={pTd(16)} color={defaultColors.icon1} iconStyle={styles.warningIcon} />
          <TextM style={styles.warnLabelWrap}>
            {`Except for zkLogin, used verifiers cannot be selected. To choose ZkLogin, the guardian type must be either a Google account or an Apple ID.`}
          </TextM>
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
