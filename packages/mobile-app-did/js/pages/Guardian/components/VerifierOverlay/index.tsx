import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { TextXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import OverlayBody from 'components/OverlayModal/OverlayBody';
import { VerifierItem } from '@portkey-wallet/types/verifier';
import { VerifierImage } from '../VerifierImage';

type VerifierListProps = {
  selectedVerifier: VerifierItem;
  verifierList: VerifierItem[];
  callBack: (item: VerifierItem) => void;
};

const VerifierList = ({ verifierList, callBack, selectedVerifier }: VerifierListProps) => {
  return (
    <OverlayBody>
      <ScrollView alwaysBounceVertical={false}>
        {verifierList.map(item => {
          return (
            <Touchable
              key={item.name}
              style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.itemRow]}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <VerifierImage uri={item.imageUrl} size={36} label={item.name} />
              <TextXL style={styles.itemName}>{item.name}</TextXL>
              {selectedVerifier.name === item.name && (
                <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
              )}
            </Touchable>
          );
        })}
      </ScrollView>
    </OverlayBody>
  );
};

const showVerifierList = (params: VerifierListProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<VerifierList {...params} />, {
    position: 'bottom',
  });
};

export default {
  showVerifierList,
};
