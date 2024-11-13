import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import React from 'react';
import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';

export interface IIconPairProps {
  item: {
    leftSymbol: string;
    leftIcon: string;
    rightSymbol: string;
    rightIcon: string;
  };
}

const IconPair: React.FC<IIconPairProps> = props => {
  const styles = getStyles();
  const { item } = props;

  return (
    <View style={styles.iconWrap}>
      <CommonAvatar
        hasBorder
        style={styles.tokenIcon}
        title={item?.leftSymbol}
        avatarSize={pTd(40)}
        imageUrl={item?.leftIcon}
        titleStyle={FontStyles.font11}
        borderStyle={GStyles.hairlineBorder}
      />
      <CommonAvatar
        hasBorder={true}
        style={styles.chainIcon}
        title={item?.rightSymbol}
        avatarSize={pTd(20)}
        imageUrl={item?.rightIcon}
        borderStyle={styles.tokenIconBorder}
      />
    </View>
  );
};

export default IconPair;

const getStyles = makeStyles(theme => ({
  iconWrap: {
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tokenIconBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
}));
