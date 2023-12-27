import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import CommonAvatar from 'components/CommonAvatar';
import { CommonInputProps } from 'components/CommonInput';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import upGrade_Background from 'assets/images/upgrade_background.png';
import { pTd } from 'utils/unit';
import { useUploadWarning } from 'hooks/useUloadWarning';

const WalletMenuItem: React.FC<CommonInputProps> = () => {
  const { showUploadWaring } = useUploadWarning();

  return (
    <ImageBackground source={upGrade_Background} style={[GStyles.flexRow, GStyles.center, styles.itemWrap]}>
      <CommonAvatar />
      <View>
        <TextM>Portkey Upgraded</TextM>

        <TextS>With enhanced user experience! </TextS>
      </View>

      <Touchable onPress={() => showUploadWaring()}>
        <TextS>Upgrade</TextS>
      </Touchable>
    </ImageBackground>
  );
};

export default memo(WalletMenuItem);

const styles = StyleSheet.create({
  itemWrap: {
    height: pTd(108),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
  },
  avatar: {
    fontSize: pTd(24),
    backgroundColor: defaultColors.bg18,
  },
  centerSection: {
    paddingHorizontal: pTd(16),
  },
  nickName: {
    ...fonts.mediumFont,
  },
  portkeyId: {
    width: pTd(200),
    color: defaultColors.font3,
  },
  blank: {
    width: '100%',
    height: pTd(4),
  },
});
