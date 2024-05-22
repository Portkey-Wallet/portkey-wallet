import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import { DepositCard } from './components/DepositCard';
import { showDepositAddress } from './components/DepositAddress';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount, getPin } from 'utils/redux';
import { formatChainInfoToShow } from '@portkey-wallet/utils';

export default function Deposit() {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();

  // const tokenItem = useRouterParams<TokenItemShowType>();
  // const { chainId, symbol, imageUrl } = tokenItem;
  const chainId = 'tDVW';
  const symbol = 'SGR-1';
  const imageUrl =
    'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png';
  const initToToken: TTokenItem = {
    name: '',
    symbol: symbol,
    icon: imageUrl,
  };

  const {
    fromNetwork,
    fromToken,
    toChainId,
    toChainIdList,
    toToken,
    unitReceiveAmount,
    payAmount,
    receiveAmount,
    fetchDepositInfo,
    setPayAmount,
  } = useDeposit(initToToken, chainId, getManagerAccount(getPin() ?? ''));

  const onNext = useCallback(async () => {
    try {
      Loading.show();
      const depositInfo = await fetchDepositInfo();
      if (depositInfo) {
        showDepositAddress({
          depositInfo,
          contractAddress: fromNetwork?.contractAddress ?? '',
        });
      }
    } catch (error) {
      console.log('aaaa error : ', error);
    } finally {
      Loading.hide();
    }
  }, [fetchDepositInfo, fromNetwork?.contractAddress]);

  const showAmount = useMemo(() => {
    return fromToken && toToken && fromToken.symbol !== toToken.symbol;
  }, [fromToken, toToken]);

  // useEffect(() => {
  //   (async () => {
  //     const oneAmount = await calculateAmount(1);
  //     console.log('aaaaoneAmount :', oneAmount);
  //   })();
  // }, [calculateAmount]);

  return (
    <PageContainer
      titleDom={t('Deposit Assets')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <DepositCard
        wrapStyle={styles.fromCard}
        type="From"
        chainName={fromNetwork?.name ?? ''}
        chainIcon="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
        tokenSymbol={fromToken?.symbol ?? ''}
        tokenIcon={fromToken?.icon ?? ''}
      />
      <DepositCard
        wrapStyle={styles.toCard}
        type="To"
        chainName={formatChainInfoToShow(chainId, currentNetwork)}
        chainIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACXklEQVR4AcTWA6wlMRiG4Tlr27Zt27bN6ERrK1jbN1rbtm3bto3um810M+lRe08mO8kTjYqvf2tF5srWZomFDJiB1/iKjSgNDyzXLvvnsTAXXyActiEnXG9AUVyFUHxBZxh/0IOMaI0+6I0WSA8P1Oer4Q6EH17TBkRDFWzEawjbC6xCBURRGpAexyEUD1DftAFFcBLCj1/Yj7xQR6wt7kPY3mEUEpo2IAI/IQL4jDGwoAaxDPpgEOojKYxD9RS/IYI4hpTwl51YiI2oiFSqf0GE8BzdYcEk3DGRCEkQH9Hg8+CjkCMAnEQVxEKoHydAUXgxGwswFi2QGdHx74XpMgMabmIwaqEKmqIdCsGyZcRQJaDSD+xBY8TG3wYUxOEgq+AOlmIyInAET/EcP+1ndiAzUmEOvkAEcRetEUPWgXJYjjcQtmdYiHoy3YiB/BiL18r6bw4vPkBouIDCctiiIB3qojs6ozrSBKiEiTEZnx35aI7dEJp+YIz/sgyNoKVCFwxESTTARwhNv3Ep3E0pulwVaA9h6Mf/bsDPcKYgJTqFOQWXnSFMizqOENYIEsJEmOgI4Sm0wC7jENrLsAyWKUvrORahvrIM82GM8uxDtDJchhflMsyPg0GG6a5mIcqC1AaFqI0sRFMMSvEtDHWU4iaOUuxxHFaH4z5+65TiB5qb0WlU09yMEqIYvJiF+RiLln42I63ev0BPt7ZjnRE4jtRuHUhmhhiFLxjv5pGsMI4H2Y4PIb+bh9JoqIz1fo7lq1HF7WO57FEGtMKfIXdM5MjpmAx412wod07p3z0HAEmapjUsGtMuAAAAAElFTkSuQmCC"
        tokenSymbol={toToken?.symbol ?? ''}
        tokenIcon={toToken?.icon ?? ''}
      />
      {showAmount && unitReceiveAmount > 0 && (
        <View style={styles.rateWrap}>
          <View>
            <Text style={styles.rateText}>{`1 ${fromToken?.symbol} ≈ ${unitReceiveAmount} ${toToken?.symbol}`}</Text>
          </View>
          <Text style={styles.rateText}>Slippage: 5%</Text>
        </View>
      )}
      <CommonButton style={styles.nextButton} type="primary" disabled={false} onPress={onNext}>
        Next
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageStyles: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
  },
  fromCard: {
    marginTop: pTd(16),
  },
  toCard: {
    marginTop: pTd(4),
  },
  rateWrap: {
    marginTop: pTd(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateText: {
    color: defaultColors.font18,
    fontSize: pTd(12),
  },
  nextButton: {
    paddingTop: pTd(40),
  },
});
