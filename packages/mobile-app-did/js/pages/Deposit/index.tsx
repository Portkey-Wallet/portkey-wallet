import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { DepositCard } from './components/DepositCard';
import { showDepositAddress } from './components/DepositAddress';
import { pTd } from 'utils/unit';
import depositService from '@portkey-wallet/utils/deposit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TTokenItem, TDepositTokenItem, TNetworkItem, TDepositInfo } from '@portkey-wallet/types/types-ca/deposit';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey-wallet/types';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { getCurrentCaHash, getManagerAccount, getPin } from 'utils/redux';

export default function Deposit() {
  const { t } = useLanguage();
  const { fetchTransferToken } = useDeposit();

  // const tokenItem = useRouterParams<TokenItemShowType>();
  // const { chainId, symbol, imageUrl } = tokenItem;
  const chainId = 'tDVV';
  const symbol = 'SGR-1';
  const imageUrl =
    'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png';

  const [depositTokenList, setDepositTokenList] = useState<TDepositTokenItem[] | undefined>();
  const [toChainIdList, setToChainIdList] = useState<ChainId[]>([]);
  const [toChainId, setToChainId] = useState<ChainId>('AELF');
  const [toToken, setToToken] = useState<TTokenItem>();

  const [fromToken, setFromToken] = useState<TTokenItem>();
  const [fromNetwork, setFromNetwork] = useState<TNetworkItem>();
  const [fromNetworkList, setFromNetworkList] = useState<TNetworkItem[]>();

  const [depositInfo, setDepositInfo] = useState<TDepositInfo>();

  useEffectOnce(() => {
    (async () => {
      const pin = getPin();
      if (!pin) return;
      const manager = getManagerAccount(pin);
      if (!manager) return;
      await fetchTransferToken(manager);
      await fetchDepositTokenList();
    })();
  });

  useEffect(() => {
    (async () => {
      const networkList = await depositService.getNetworkList({
        chainId: toChainId,
        symbol: fromToken?.symbol ?? 'USDT',
      });
      if (networkList && networkList.length > 0) {
        setFromNetworkList(networkList);
        setFromNetwork(networkList[0]);
      }
    })();
  }, [fromToken, toChainId]);

  const fetchDepositTokenList = useCallback(async () => {
    const tokenList = await depositService.getDepositTokenList();
    setDepositTokenList(tokenList);

    let findTartgetToken = false;
    tokenList.forEach(token => {
      if (token.toTokenList) {
        if (findTartgetToken) return;
        token.toTokenList.forEach(toTokenItem => {
          if (findTartgetToken) return;
          if (toTokenItem.symbol === symbol) {
            setToChainIdList(toTokenItem.chainIdList || []);
            setFromToken(token);
            findTartgetToken = true;
          }
        });
      }
    });
  }, []);

  const onNext = useCallback(async () => {
    // showDepositAddress({
    //   depositInfo: {
    //     depositAddress: 'U97UqZe52baDgmvdhgt6hcQnWBjiEKayeywLXiFEuH5LAEFhB',
    //     minAmount: '1.23',
    //     minAmountUsd: '1.24',
    //     extraInfo: { slippage: '5%' },
    //     extraNotes: [
    //       'The swap will be in accordance to the actual amount of USDT deposited, hence please take note of the top-up value.',
    //       'After topping up, the swap will factor in the slippage rate.',
    //       'Failing which, the corresponding amount of USDT will be sent to your chain of choice.',
    //     ],
    //   },
    //   contractAddress: '0xU97UqZe52baDgmvdhgt6hcQnWBjiEKayeywLXiFEuH5LAEFhB',
    // });
    // await getTransferToken({ chain_id: '' });
  }, [fetchTransferToken]);

  const showAmount = useMemo(() => {
    return fromToken && toToken && fromToken.symbol === toToken.symbol;
  }, [fromToken, toToken]);

  useEffect(() => {
    (async () => {
      if (toChainId && toToken?.symbol && fromNetwork?.network && fromToken?.symbol) {
        const params = {
          chainId: toChainId,
          toSymbol: toToken?.symbol,
          network: fromNetwork?.network,
          symbol: fromToken?.symbol,
        };
        const info = await depositService.getDepositInfo(params);
        console.log('aaaa info : ', info);
      }
    })();
  }, [fromNetwork, fromToken?.symbol, toChainId, toToken?.symbol]);

  //toChainId=tDVW&fromSymbol=USDT&toSymbol=SGR-1&fromAmount=100
  const calculateAmount = useCallback(
    async (fromAmount: number) => {
      if (toChainId && fromToken?.symbol && toToken?.symbol && fromAmount) {
        const result = await depositService.depositCalculator({
          toChainId: toChainId,
          fromSymbol: fromToken?.symbol,
          toSymbol: toToken?.symbol,
          fromAmount: fromAmount.toString(),
        });
        return result;
      }
    },
    [fromToken?.symbol, toChainId, toToken?.symbol],
  );

  useEffect(() => {
    (async () => {
      const oneAmount = await calculateAmount(1);
      console.log('aaaaoneAmount :', oneAmount);
    })();
  }, [calculateAmount]);

  useEffect(() => {
    (async () => {
      const params = {
        chainId: toChainId ?? '',
        network: fromNetwork?.network ?? '',
        symbol: fromToken?.symbol,
        toSymbol: toToken?.symbol,
      };
      const info = await depositService.getDepositInfo(params);
    })();
  }, [fromNetwork, fromToken?.symbol, toChainId, toToken?.symbol]);

  return (
    <PageContainer
      titleDom={t('Deposit Assets')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <DepositCard
        wrapStyle={styles.fromCard}
        type="From"
        chainId=""
        chainName="BNB Smart Chain"
        chainIcon="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
        tokenName={fromToken?.symbol ?? ''}
        tokenIcon={fromToken?.icon ?? ''}
      />
      <DepositCard
        wrapStyle={styles.toCard}
        type="To"
        chainId=""
        chainName="SideChain tDVV"
        chainIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACXklEQVR4AcTWA6wlMRiG4Tlr27Zt27bN6ERrK1jbN1rbtm3bto3um810M+lRe08mO8kTjYqvf2tF5srWZomFDJiB1/iKjSgNDyzXLvvnsTAXXyActiEnXG9AUVyFUHxBZxh/0IOMaI0+6I0WSA8P1Oer4Q6EH17TBkRDFWzEawjbC6xCBURRGpAexyEUD1DftAFFcBLCj1/Yj7xQR6wt7kPY3mEUEpo2IAI/IQL4jDGwoAaxDPpgEOojKYxD9RS/IYI4hpTwl51YiI2oiFSqf0GE8BzdYcEk3DGRCEkQH9Hg8+CjkCMAnEQVxEKoHydAUXgxGwswFi2QGdHx74XpMgMabmIwaqEKmqIdCsGyZcRQJaDSD+xBY8TG3wYUxOEgq+AOlmIyInAET/EcP+1ndiAzUmEOvkAEcRetEUPWgXJYjjcQtmdYiHoy3YiB/BiL18r6bw4vPkBouIDCctiiIB3qojs6ozrSBKiEiTEZnx35aI7dEJp+YIz/sgyNoKVCFwxESTTARwhNv3Ep3E0pulwVaA9h6Mf/bsDPcKYgJTqFOQWXnSFMizqOENYIEsJEmOgI4Sm0wC7jENrLsAyWKUvrORahvrIM82GM8uxDtDJchhflMsyPg0GG6a5mIcqC1AaFqI0sRFMMSvEtDHWU4iaOUuxxHFaH4z5+65TiB5qb0WlU09yMEqIYvJiF+RiLln42I63ev0BPt7ZjnRE4jtRuHUhmhhiFLxjv5pGsMI4H2Y4PIb+bh9JoqIz1fo7lq1HF7WO57FEGtMKfIXdM5MjpmAx412wod07p3z0HAEmapjUsGtMuAAAAAElFTkSuQmCC"
        tokenName="SGR"
        tokenIcon="https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24@3x.png"
      />
      {showAmount && (
        <View style={styles.rateWrap}>
          <View>
            <Text style={styles.rateText}>1 USDT ≈ 1.12345678 SGR</Text>
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
