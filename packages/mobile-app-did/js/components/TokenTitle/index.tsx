import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextS } from 'components/CommonText';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export interface TokenTitleProps {
  tokenInfo: TokenItemShowType;
}

export const TokenTitle: React.FC<TokenTitleProps> = ({ tokenInfo }) => {
  const symbolImages = useSymbolImages();
  const defaultToken = useDefaultToken(tokenInfo.chainId);
  const iconImg = useMemo(() => {
    return tokenInfo?.imageUrl ?? symbolImages[tokenInfo?.symbol] ?? '';
  }, [symbolImages, tokenInfo?.imageUrl, tokenInfo?.symbol]);

  return (
    <View>
      <View style={styles.mainTitleLine}>
        <CommonAvatar
          hasBorder
          style={styles.mainTitleIcon}
          title={tokenInfo.symbol}
          avatarSize={pTd(18)}
          svgName={tokenInfo?.symbol === defaultToken.symbol ? 'testnet' : undefined}
          imageUrl={iconImg}
          titleStyle={Object.assign({}, FontStyles.font11, { fontSize: pTd(12) })}
          borderStyle={GStyles.hairlineBorder}
        />
        <TextL style={[GStyles.textAlignCenter, FontStyles.font16, fonts.mediumFont]}>{tokenInfo.symbol}</TextL>
      </View>
      <TextS style={[GStyles.textAlignCenter, FontStyles.font11, styles.subTitle]}>
        {formatChainInfoToShow(tokenInfo.chainId)}
      </TextS>
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
    height: pTd(18),
    width: pTd(18),
    marginRight: 4,
  },
  subTitle: {
    fontSize: pTd(12),
  },
});
