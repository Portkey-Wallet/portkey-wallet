import { FontStyles } from 'assets/theme/styles';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import CommonAvatar from 'components/CommonAvatar';
import { makeStyles } from '@rneui/themed';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import Touchable from 'components/Touchable';

export interface ITokenBalanceShow {
  symbol: string;
  imageUrl?: string;
  balanceShow: string;
  onPressMax: () => void;
}

const TokenBalanceShow: React.FC<ITokenBalanceShow> = props => {
  const { symbol, imageUrl, balanceShow, onPressMax } = props;
  const styles = getStyles();
  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();

  return (
    <View style={[GStyles.flexRow, GStyles.alignCenter, styles.wrap]}>
      <CommonAvatar
        hasBorder
        title={symbol}
        avatarSize={pTd(42)}
        // elf token icon is fixed , only use white background color
        svgName={symbol === defaultToken.symbol ? 'elf-icon' : undefined}
        imageUrl={imageUrl || symbolImages[symbol]}
        titleStyle={FontStyles.font11}
        borderStyle={GStyles.hairlineBorder}
      />
      <View style={[GStyles.flex1, styles.center]}>
        <TextL style={styles.symbolName}>{symbol}</TextL>
        <TextM style={styles.balanceNumber}>{`${balanceShow} available`}</TextM>
      </View>
      <Touchable onPress={onPressMax}>
        <TextL style={styles.max}>Max</TextL>
      </Touchable>
    </View>
  );
};

export default memo(TokenBalanceShow);

export const getStyles = makeStyles(theme => ({
  wrap: {
    width: '100%',
    backgroundColor: theme.colors.bgBase1,
    padding: pTd(16),
    height: pTd(74),
  },
  center: {
    marginHorizontal: pTd(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  symbolName: {
    color: theme.colors.textBase1,
  },
  balanceNumber: {
    color: theme.colors.textBase2,
  },
  max: {
    height: pTd(40),
    width: pTd(84),
    lineHeight: pTd(40),
    textAlign: 'center',
    borderRadius: pTd(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderNeutral2,
  },
}));
