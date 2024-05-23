import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import Svg from 'components/Svg';
import { selectPayToken, selectReceiveToken, ISelectTokenResult } from 'components/Selects/Entry';
import { FromCard } from './components/FromCard';
import { ToCard } from './components/ToCard';
import { showDepositAddress } from './components/DepositAddress';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount, getPin } from 'utils/redux';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';

export default function Deposit() {
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();

  const tokenItem = useRouterParams<TokenItemShowType>();
  const { chainId, symbol, imageUrl } = tokenItem;
  const initToToken: TTokenItem = {
    name: '',
    symbol: symbol,
    icon: imageUrl ?? '',
  };

  const {
    allNetworkList,
    fromNetwork,
    fromToken,
    toChainId,
    toChainIdList,
    toToken,
    unitReceiveAmount,
    receiveAmount,
    rateRefreshTime,
    isSameSymbol,
    fetchDepositInfo,
    setPayAmount,
    setFrom,
  } = useDeposit(initToToken, chainId, getManagerAccount(getPin() ?? ''));

  const onNext = useCallback(async () => {
    try {
      Loading.show();
      const depositInfo = await fetchDepositInfo();
      if (depositInfo && fromNetwork && fromToken) {
        showDepositAddress({
          fromNetwork,
          fromToken,
          depositInfo,
          contractAddress: fromNetwork?.contractAddress ?? '',
        });
      }
    } catch (error) {
      console.log('aaaa error : ', error);
    } finally {
      Loading.hide();
    }
  }, [fetchDepositInfo, fromNetwork, fromToken]);

  const onPayAmountChanged = useCallback(
    (text: string) => {
      if (text.length === 0) {
        setPayAmount(0);
        return;
      }
      const amount = parseFloat(text);
      setPayAmount(amount);
    },
    [setPayAmount],
  );

  const mapChainToNetwork = useCallback((chainid: ChainId) => {
    const network: TNetworkItem = {
      network: 'AELF',
      name: chainid,
      multiConfirm: '',
      multiConfirmTime: '',
      contractAddress: '',
      explorerUrl: '',
    };
    return network;
  }, []);

  const onSelectPayToken = useCallback(async () => {
    if (fromToken && fromNetwork && allNetworkList) {
      const res = await selectPayToken({
        networkList: allNetworkList,
        currentToken: fromToken,
        currentNetwork: fromNetwork,
        onResolve: (data: ISelectTokenResult) => {
          console.log('select pay: ', data);
        },
        onReject: reason => {
          console.log('select pay reject: ', reason);
        },
      });
      if (res.network && res.token) {
        setFrom({
          newFromNetwork: res.network,
          newFromToken: res.token,
        });
      }
    }
  }, [allNetworkList, fromNetwork, fromToken, setFrom]);

  const onSelectReceiveToken = useCallback(async () => {
    console.log('select receive');
    if (toToken && toChainId && toChainIdList && toChainIdList.length > 0) {
      const res = await selectReceiveToken({
        networkList: toChainIdList.map(chainid => mapChainToNetwork(chainid)),
        currentToken: toToken,
        currentNetwork: mapChainToNetwork(toChainId),
        onResolve: (data: ISelectTokenResult) => {
          console.log('select receive: ', data);
        },
        onReject: reason => {
          console.log('select receive reject: ', reason);
        },
      });
      console.log('res : ', res);
    }
  }, [mapChainToNetwork, toChainId, toChainIdList, toToken]);

  return (
    <PageContainer
      titleDom={t('Deposit Assets')}
      safeAreaColor={['white']}
      containerStyles={styles.pageStyles}
      scrollViewProps={{ disabled: false }}>
      <View style={styles.cardWrap}>
        <FromCard
          network={fromNetwork?.network ?? ''}
          networkName={fromNetwork?.name ?? ''}
          tokenSymbol={fromToken?.symbol ?? ''}
          tokenIcon={fromToken?.icon ?? ''}
          onChangeText={onPayAmountChanged}
          showAmount={!isSameSymbol}
          onPress={onSelectPayToken}
        />
        <ToCard
          wrapStyle={styles.toCard}
          chainName={formatChainInfoToShow(chainId, currentNetwork)}
          chainIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACXklEQVR4AcTWA6wlMRiG4Tlr27Zt27bN6ERrK1jbN1rbtm3bto3um810M+lRe08mO8kTjYqvf2tF5srWZomFDJiB1/iKjSgNDyzXLvvnsTAXXyActiEnXG9AUVyFUHxBZxh/0IOMaI0+6I0WSA8P1Oer4Q6EH17TBkRDFWzEawjbC6xCBURRGpAexyEUD1DftAFFcBLCj1/Yj7xQR6wt7kPY3mEUEpo2IAI/IQL4jDGwoAaxDPpgEOojKYxD9RS/IYI4hpTwl51YiI2oiFSqf0GE8BzdYcEk3DGRCEkQH9Hg8+CjkCMAnEQVxEKoHydAUXgxGwswFi2QGdHx74XpMgMabmIwaqEKmqIdCsGyZcRQJaDSD+xBY8TG3wYUxOEgq+AOlmIyInAET/EcP+1ndiAzUmEOvkAEcRetEUPWgXJYjjcQtmdYiHoy3YiB/BiL18r6bw4vPkBouIDCctiiIB3qojs6ozrSBKiEiTEZnx35aI7dEJp+YIz/sgyNoKVCFwxESTTARwhNv3Ep3E0pulwVaA9h6Mf/bsDPcKYgJTqFOQWXnSFMizqOENYIEsJEmOgI4Sm0wC7jENrLsAyWKUvrORahvrIM82GM8uxDtDJchhflMsyPg0GG6a5mIcqC1AaFqI0sRFMMSvEtDHWU4iaOUuxxHFaH4z5+65TiB5qb0WlU09yMEqIYvJiF+RiLln42I63ev0BPt7ZjnRE4jtRuHUhmhhiFLxjv5pGsMI4H2Y4PIb+bh9JoqIz1fo7lq1HF7WO57FEGtMKfIXdM5MjpmAx412wod07p3z0HAEmapjUsGtMuAAAAAElFTkSuQmCC"
          tokenSymbol={toToken?.symbol ?? ''}
          tokenIcon={toToken?.icon ?? ''}
          receiveAmount={receiveAmount.toAmount}
          minumumReceiveAmount={receiveAmount.minimumReceiveAmount}
          showAmount={!isSameSymbol}
          onPress={onSelectReceiveToken}
        />
        <View style={styles.directionIconWrap} pointerEvents="none">
          <Svg size={pTd(32)} icon={'direction_down'} />
        </View>
      </View>
      {!isSameSymbol && unitReceiveAmount > 0 && (
        <View style={styles.rateWrap}>
          <View style={styles.countDownWrap}>
            <Text style={styles.rateText}>{`1 ${fromToken?.symbol} ≈ ${unitReceiveAmount} ${toToken?.symbol}`}</Text>
            <Svg size={14} icon="time" />
            <Text style={styles.countDownText}>{`${rateRefreshTime}s`}</Text>
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
  cardWrap: {
    marginTop: pTd(16),
  },
  toCard: {
    marginTop: pTd(4),
  },
  directionIconWrap: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateWrap: {
    marginTop: pTd(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countDownWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateText: {
    marginRight: pTd(8),
    color: defaultColors.font18,
    fontSize: pTd(12),
  },
  countDownText: {
    marginLeft: pTd(2),
    color: defaultColors.font18,
    fontSize: pTd(12),
  },
  nextButton: {
    paddingTop: pTd(40),
  },
});
