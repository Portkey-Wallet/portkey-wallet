import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { TextL, TextM, TextS } from 'components/CommonText';
import AccountCard from 'pages/Receive/components/AccountCard';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import CommonAvatar from 'components/CommonAvatar';
import GStyles from 'assets/theme/GStyles';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { copyText } from 'utils';
import Touchable from 'components/Touchable';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { useAfterTransitionEffectOnce } from 'hooks/afterTransition';
import ReceiveTip, { TipView } from './components/ReceiveTip';
import { useSideChainTokenReceiveTipSetting } from '@portkey-wallet/hooks/hooks-ca/misc';

export default function Receive() {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();
  const defaultToken = useDefaultToken();

  const tokenItem = useRouterParams<TokenItemShowType>();
  const { chainId, symbol, imageUrl } = tokenItem;
  const symbolImages = useSymbolImages();
  const currentWallet = useCurrentWalletInfo();

  const currentCaAddress = currentWallet?.[chainId]?.caAddress;

  const copyId = useCallback(() => copyText(`ELF_${currentCaAddress}_${chainId}`), [chainId, currentCaAddress]);

  const isMainChain = useMemo(() => chainId === DefaultChainId, [chainId]);
  const { showSideChainTokenReceiveTip } = useSideChainTokenReceiveTipSetting();
  useAfterTransitionEffectOnce(() => {
    if (!isMainChain && showSideChainTokenReceiveTip) ReceiveTip.showReceiveTip({ chainId });
  });

  return (
    <PageContainer
      titleDom={t('Receive')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: false }}>
      <View style={styles.topWrap}>
        <CommonAvatar
          hasBorder
          style={styles.svgStyle}
          title={symbol}
          avatarSize={pTd(40)}
          svgName={symbol === defaultToken.symbol ? 'testnet' : undefined}
          imageUrl={imageUrl || symbolImages?.[symbol] || ''}
        />
        <View>
          <TextL>{symbol}</TextL>
          <TextS>{formatChainInfoToShow(chainId, currentNetwork)}</TextS>
        </View>
      </View>

      <AccountCard
        toCaAddress={`ELF_${currentCaAddress}_${chainId}`}
        tokenInfo={tokenItem}
        style={styles.accountCardStyle}
      />

      <TextM style={styles.tips}>{t('You can provide QR code to receive')}</TextM>

      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween, styles.addressWrap]}>
        <TextM style={styles.address}>
          {formatStr2EllipsisStr(addressFormat(currentCaAddress, chainId, 'aelf'), 32)}
        </TextM>
        <Touchable onPress={() => copyId()}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>

      <View style={styles.warningWrap}>
        <View style={[GStyles.flexRow, GStyles.itemCenter]}>
          <Svg icon="warning1" size={pTd(16)} />
          <TextM style={[GStyles.marginLeft(pTd(8)), FontStyles.font3]}>Receive from exchange account?</TextM>
        </View>
        {isMainChain ? (
          <TextS style={[styles.warningContent, FontStyles.font3]}>
            {`Please note that your Portkey account can only receive assets from certain exchanges, like Binance, Upbit, OKX, and gate.io, and you need to ensure that "AELF" is selected as the withdrawal network.`}
          </TextS>
        ) : (
          <TipView textStyle={FontStyles.size12} chainId={chainId} style={styles.warningContent} />
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },

  topWrap: {
    ...GStyles.flexRowWrap,
    marginTop: pTd(40),
    height: pTd(38),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultColors.bg1,
  },
  svgStyle: {
    marginRight: pTd(12),
    fontSize: pTd(16),
  },
  accountCardStyle: {
    marginTop: pTd(24),
    marginBottom: 0,
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tips: {
    marginTop: pTd(16),
    width: '100%',
    color: defaultColors.font3,
    textAlign: 'center',
  },
  addressWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(12),
    marginTop: pTd(32),
    borderColor: defaultColors.border6,
  },
  address: {
    lineHeight: pTd(20),
    width: pTd(270),
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  warningWrap: {
    backgroundColor: defaultColors.bg6,
    marginTop: pTd(24),
    padding: pTd(12),
    borderRadius: pTd(6),
    marginBottom: pTd(24),
  },
  warningContent: {
    marginTop: pTd(4),
    marginLeft: pTd(24),
  },
});
