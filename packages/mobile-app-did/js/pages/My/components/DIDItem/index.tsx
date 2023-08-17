import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import FormItem from 'components/FormItem';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';

import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { copyText } from 'utils';
import { pTd } from 'utils/unit';

type PortkeyIDItemPropsType = {
  disable?: boolean;
  portkeyID: string;
};

const PortkeyIDItem: React.FC<PortkeyIDItemPropsType> = props => {
  const { disable, portkeyID = 'portkeyID' } = props;

  const copyId = useCallback(() => copyText(portkeyID), [portkeyID]);

  return (
    <FormItem title="Portkey ID">
      <View
        style={[
          GStyles.flexRow,
          GStyles.itemCenter,
          GStyles.spaceBetween,
          disable ? BGStyles.bg18 : BGStyles.bg1,
          styles.content,
        ]}>
        <TextM numberOfLines={1}>{portkeyID}</TextM>
        <Touchable onPress={copyId}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>
    </FormItem>
  );
};

export default memo(PortkeyIDItem);

const styles = StyleSheet.create({
  content: {
    height: pTd(56),
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
  },
});
