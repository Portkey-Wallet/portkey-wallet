import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { IContactPrivacy } from '@portkey-wallet/types/types-ca/contact';
import { LoginGuardianTypeIcon } from 'constants/misc';
import {
  CONTACT_PERMISSION_LABEL_MAP,
  CONTACT_PRIVACY_TYPE_LABEL_MAP,
} from '@portkey-wallet/constants/constants-ca/contact';

interface PrivacyItemProps {
  item: IContactPrivacy;
  onPress?: () => void;
}

const PrivacyItem: React.FC<PrivacyItemProps> = ({ item, onPress }) => {
  return (
    <Touchable style={styles.itemWrap} onPress={() => onPress?.()}>
      <Svg icon={LoginGuardianTypeIcon[item.privacyType]} size={pTd(32)} iconStyle={styles.itemImage} />
      <View style={styles.itemContent}>
        <TextL>{CONTACT_PRIVACY_TYPE_LABEL_MAP[item.privacyType]}</TextL>
        <TextM numberOfLines={1} style={[FontStyles.font7]}>
          {item.identifier}
        </TextM>
      </View>
      <TextM style={[FontStyles.font3, styles.itemRight]}>{CONTACT_PERMISSION_LABEL_MAP[item.permission]}</TextM>
      <Svg icon="right-arrow" size={pTd(20)} />
    </Touchable>
  );
};

export default PrivacyItem;

const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    height: pTd(72),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(14, 16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  itemImage: {
    marginRight: pTd(16),
    // borderRadius: pTd(16),
  },
  itemContent: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  itemRight: {
    marginRight: pTd(4),
    width: pTd(96),
    textAlign: 'right',
  },
});
