import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';

const ContactUpdateWarning: React.FC = () => {
  const [show, setShow] = useState(true);

  //   TODO: should fetch api
  if (!show) return null;

  return (
    <View style={[GStyles.flexRow, GStyles.itemStart, styles.wrap]}>
      <Svg icon="warning" size={pTd(20)} color={defaultColors.bg17} />
      <TextM style={[GStyles.flex1, styles.tips]}>
        Portkeys will automatic group contacts with matching Portkey IDs and seamlessly update in real-time.{' '}
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
