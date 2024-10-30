import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { darkColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL } from 'components/CommonText';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export interface TokenTitleProps {
  imageUrl?: string;
  symbol: string;
  label?: string;
}

export const TokenTitle: React.FC<TokenTitleProps> = ({ imageUrl, symbol, label }) => {
  const symbolImages = useSymbolImages();
  const iconImg = useMemo(() => {
    return imageUrl ?? symbolImages[symbol] ?? '';
  }, [imageUrl, symbol, symbolImages]);

  return (
    <View>
      <View style={styles.mainTitleLine}>
        <CommonAvatar
          hasBorder
          style={styles.mainTitleIcon}
          title={symbol}
          avatarSize={pTd(24)}
          imageUrl={iconImg}
          titleStyle={Object.assign({}, FontStyles.font11, { fontSize: pTd(12) })}
          borderStyle={GStyles.hairlineBorder}
        />
        <TextL style={[GStyles.textAlignCenter, styles.titleText, fonts.mediumFont]}>{label || symbol}</TextL>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTitleLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitleIcon: {
    height: pTd(24),
    width: pTd(24),
    marginRight: pTd(8),
  },
  titleText: {
    color: darkColors.textBase1,
  },
});
