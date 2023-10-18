import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { CommonInputProps } from 'components/CommonInput';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

const WalletMenuItem: React.FC<CommonInputProps> = () => {
  return (
    <Touchable style={[GStyles.flexRow, styles.itemWrap]} onPress={() => navigationService.navigate('WalletName')}>
      <CommonAvatar avatarSize={pTd(60)} />
      <View style={[GStyles.flexCol, GStyles.flex1]}>
        <TextM>david</TextM>
        <View style={styles.blank} />
        <TextM>PortkeyId:!11111</TextM>
      </View>
      <Svg icon="right-arrow" size={pTd(20)} />
    </Touchable>
  );
};

export default memo(WalletMenuItem);

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(108),
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
  },
  blank: {
    width: '100%',
    height: pTd(4),
  },
});
