import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextM, TextXXXL } from 'components/CommonText';
import React, { memo } from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { pTd } from 'utils/unit';

type ProfileHeaderPropsType = {
  name: string;
  showRemark?: boolean;
  remark?: string;
  avatarUrl?: string;
  noMarginTop?: boolean;
  style?: ViewStyle;
  nameStyle?: TextStyle;
};

const ProfileHeader: React.FC<ProfileHeaderPropsType> = props => {
  const { name, showRemark, remark, avatarUrl, noMarginTop = true, style, nameStyle } = props;

  const styles = getStyles();

  return (
    <View style={[GStyles.center, styles.wrap, noMarginTop && GStyles.marginTop(0), style]}>
      <CommonAvatar
        hasBorder
        resizeMode="cover"
        avatarSize={pTd(80)}
        title={remark || name}
        imageUrl={avatarUrl || ''}
        style={styles.avatarStyle}
        titleStyle={styles.avatarTitleStyle}
      />
      <TextXXXL style={[FontStyles.font5, GStyles.marginTop(pTd(12)), nameStyle]}>{name}</TextXXXL>
      {showRemark && (
        <TextM style={[FontStyles.font7, GStyles.marginTop(pTd(4))]}>{`Remark: ${remark || 'Not set'}`}</TextM>
      )}
    </View>
  );
};

export default memo(ProfileHeader);

const getStyles = makeStyles(theme => ({
  wrap: {
    width: '100%',
    marginBottom: pTd(24),
    marginTop: pTd(24),
  },
  avatarStyle: {
    fontSize: pTd(40),
    backgroundColor: theme.colors.iconBrandDefault,
  },
  avatarTitleStyle: {
    color: theme.colors.textBrandOn,
    fontSize: pTd(24),
    lineHeight: pTd(28),
    ...fonts.BGRegularFont,
  },
}));
