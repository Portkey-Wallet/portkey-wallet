import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import Loading from 'components/Loading';
import Svg from 'components/Svg';
import { selectPayToken, selectReceiveToken } from 'components/Selects/Entry';
import { FromCard } from './components/FromCard';
import { ToCard } from './components/ToCard';
import { showDepositAddress } from './components/DepositAddress';
import { pTd } from 'utils/unit';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import { useDeposit } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { getManagerAccount, getPin } from 'utils/redux';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useThrottleCallback } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey-wallet/types';

export default function Deposit() {
  const { t } = useLanguage();

  const tokenItem = useRouterParams<TokenItemShowType>();
  const { chainId, symbol, imageUrl } = tokenItem;
  const initToToken: TTokenItem = {
    name: '',
    symbol: symbol,
    icon: imageUrl ?? '',
  };

  const {
    loading,
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
    setTo,
  } = useDeposit(initToToken, chainId, getManagerAccount(getPin() ?? ''));

  useEffect(() => {
    if (loading) {
      Loading.show();
    } else {
      Loading.hide();
    }
  }, [loading]);

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
      console.log('fetchDepositInfo error : ', error);
    } finally {
      Loading.hide();
    }
  }, [fetchDepositInfo, fromNetwork, fromToken]);

  const onPayAmountChanged = useThrottleCallback(
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
    if (toToken && toChainId && toChainIdList && toChainIdList.length > 0) {
      const res = await selectReceiveToken({
        networkList: toChainIdList.map(chainid => mapChainToNetwork(chainid)),
        currentToken: toToken,
        currentNetwork: mapChainToNetwork(toChainId),
      });
      if (res.network.name && res.token) {
        setTo({
          newToChainId: res.network.name as unknown as ChainId,
          newToToken: res.token,
        });
      }
    }
  }, [mapChainToNetwork, setTo, toChainId, toChainIdList, toToken]);

  return (
    <PageContainer
      titleDom={t('Deposit Asset')}
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
          chainName={formatChainInfoToShow(toChainId)}
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
