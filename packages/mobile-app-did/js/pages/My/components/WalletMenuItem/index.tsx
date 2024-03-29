import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import CommonAvatar from 'components/CommonAvatar';
import { CommonInputProps } from 'components/CommonInput';
import { TextM, TextXXL } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

const WalletMenuItem: React.FC<CommonInputProps> = () => {
  const userInfo = useCurrentUserInfo();
  return (
    <Touchable
      style={[GStyles.flexRow, GStyles.center, styles.itemWrap]}
      onPress={() => navigationService.navigate('WalletName')}>
      <CommonAvatar
        hasBorder={!userInfo?.avatar}
        title={userInfo?.nickName}
        avatarSize={pTd(60)}
        imageUrl={userInfo?.avatar || ''}
        resizeMode="cover"
        style={styles.avatar}
      />
      <View style={[GStyles.flexCol, GStyles.flex1, styles.centerSection]}>
        <TextXXL numberOfLines={1} style={styles.nickName}>
          {userInfo?.nickName || ''}
        </TextXXL>
        <View style={styles.blank} />
        <TextM numberOfLines={1} style={styles.portkeyId}>{`Portkey ID: ${userInfo?.userId || ''}`}</TextM>
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
    width: pTd(200),
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
