import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';

const ContactUpdateWarning: React.FC = () => {
  const isImputation = useIsImputation();
  const [show, setShow] = useState(true);

  if (!isImputation || !show) return null;

  return (
    <View style={[GStyles.flexRow, GStyles.itemStart, styles.wrap]}>
      <Svg icon="warning" size={pTd(20)} color={defaultColors.bg17} />
      <TextM style={[GStyles.flex1, styles.tips]}>
        {`Portkey automatically updates your contact list and group contacts with the same Portkey ID into one. You can click the red mark on the contact for details.`}
      </TextM>
      <Touchable onPress={() => setShow(false)}>
        <Svg icon="close2" size={pTd(16)} color={defaultColors.font7} />
      </Touchable>
    </View>
  );
};

export default memo(ContactUpdateWarning);

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: defaultColors.bg21,
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(12),
  },
  tips: {
    marginLeft: pTd(8),
    marginRight: pTd(16),
  },
});
