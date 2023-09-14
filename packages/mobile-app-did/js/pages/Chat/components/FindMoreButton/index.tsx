import React from 'react';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';

export default function FindMoreButton() {
  return (
    <Touchable
      style={[GStyles.flexRow, GStyles.itemCenter, styles.wrap]}
      onPress={() => navigationService.navigate('FindMorePeoplePage')}>
      <Svg size={pTd(20)} icon="chat-find-more" color={defaultColors.font4} />
      <TextL style={[FontStyles.font4, GStyles.marginLeft(pTd(16))]}>Find People</TextL>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: pTd(48),
    paddingLeft: pTd(20),
    backgroundColor: defaultColors.bg1,
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
