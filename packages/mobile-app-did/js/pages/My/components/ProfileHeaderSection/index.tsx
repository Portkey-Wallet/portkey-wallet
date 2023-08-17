import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextM, TextXXXL } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';

type ProfileHeaderPropsType = {
  name: string;
  showRemark?: boolean;
  remark?: string;
  avatarUrl?: string;
};

const ProfileHeader: React.FC<ProfileHeaderPropsType> = props => {
  const { name, showRemark, remark, avatarUrl } = props;

  return (
    <View style={[GStyles.center, styles.wrap]}>
      <CommonAvatar hasBorder avatarSize={pTd(80)} title={name} imageUrl={avatarUrl} style={styles.avatarStyle} />
      <TextXXXL style={[FontStyles.font5, GStyles.marginTop(pTd(8))]}>{name}</TextXXXL>
      {showRemark && <TextM style={[FontStyles.font7, GStyles.marginTop(pTd(4))]}>{remark}</TextM>}
    </View>
  );
};

export default memo(ProfileHeader);

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: pTd(24),
  },
  avatarStyle: {
    fontSize: pTd(40),
  },
});
