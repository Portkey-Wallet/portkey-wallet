import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { BreakWordText } from 'components/CommonText';
import FormItem from 'components/FormItem';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';

import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { copyText } from 'utils';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

type ProfileIDSectionType = {
  title?: string;
  disable?: boolean;
  noMarginTop?: boolean;
  id?: string;
  showQrCodeButton?: boolean;
};

const ProfileIDSection: React.FC<ProfileIDSectionType> = props => {
  const { disable = false, noMarginTop = false, id = '', title = 'Portkey ID', showQrCodeButton = false } = props;

  const copyId = useCallback(() => copyText(id), [id]);

  return (
    <FormItem title={title} style={[noMarginTop && GStyles.marginTop(0)]}>
      <View
        style={[
          GStyles.flexRow,
          GStyles.itemCenter,
          GStyles.spaceBetween,
          disable ? BGStyles.bg18 : BGStyles.bg1,
          styles.content,
        ]}>
        <BreakWordText containerStyle={styles.textContainerStyle}>{id}</BreakWordText>
        <Touchable onPress={copyId}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
        {showQrCodeButton && (
          <Touchable onPress={() => navigationService.navigate('ChatQrCodePage')} style={GStyles.marginLeft(pTd(24))}>
            <Svg icon="chat-scan" size={pTd(16)} />
          </Touchable>
        )}
      </View>
    </FormItem>
  );
};

export default memo(ProfileIDSection);

const styles = StyleSheet.create({
  content: {
    height: pTd(56),
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
  },
  textContainerStyle: {
    flex: 1,
    paddingRight: pTd(10),
  },
});
