import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { useReceiveByETransfer } from '@portkey-wallet/hooks/hooks-ca/receive';
// @ts-expect-error: Importing makeStyles from @rneui/themed
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import Loading from 'components/Loading';
import Svg from 'components/Svg';
import ReceiveQRCode from '../ReceiveQRCode';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { getManagerAccount, getPin } from 'utils/redux';
import CommonTooltip from 'components/CommonTooltip';

export default function ReceiveByETransfer({
  sourceChain,
  destinationChain,
  tokenInfo,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
  tokenInfo: IUserTokenItemResponse;
}) {
  const styles = getStyles();
  const { loading, depositInfo } = useReceiveByETransfer({
    manager: getManagerAccount(getPin() ?? ''),
    fromNetwork: sourceChain.network,
    fromSymbol: tokenInfo.symbol,
    toChainId: destinationChain.chainId,
    toSymbol: tokenInfo.symbol,
  });

  useEffect(() => {
    if (loading) {
      Loading.show();
    } else {
      Loading.hide();
    }
  }, [loading]);

  const qrcodeData = useMemo(() => {
    return depositInfo?.depositAddress;
  }, [depositInfo?.depositAddress]);

  const qrcodeAddress = useMemo(() => {
    return depositInfo?.depositAddress;
  }, [depositInfo?.depositAddress]);

  const infoUI = useMemo(() => {
    if (
      (!depositInfo?.minAmount || depositInfo.minAmount === '0') &&
      (!depositInfo?.serviceFee || depositInfo.serviceFee === '0')
    ) {
      return null;
    }
    return (
      <View style={styles.infoContainer}>
        {depositInfo?.minAmount && (
          <View style={styles.infoWrap}>
            <Text style={styles.infoTitle}>Minimum deposit</Text>
            <View style={styles.minimumWrap}>
              <Text style={styles.minimumCount}>{`${depositInfo?.minAmount} ${
                tokenInfo.label ?? tokenInfo.symbol
              }`}</Text>
              <Text style={styles.minimumUsd}>{`$${depositInfo?.minAmountUsd}`}</Text>
            </View>
          </View>
        )}
        {depositInfo?.serviceFee && (
          <View style={styles.infoWrap}>
            <View style={styles.infoWrapLeft}>
              <Text style={styles.infoTitle}>Service fee</Text>
              <CommonTooltip
                iconStyle={styles.infoLabelHelpIcon}
                tooltipProps={{
                  title: 'Service fee',
                  description: `This is an estimated fee charged by Cobo to cover the costs of asset consolidation.
  Deposit amount ≥ 2 USDT: No service fee
  Deposit amount < USDT: Max service fee 0.5 USDT`,
                }}
              />
            </View>
            <View style={styles.minimumWrap}>
              <Text style={styles.minimumCount}>{`0~${depositInfo.serviceFee} ${
                tokenInfo.label ?? tokenInfo.symbol
              }`}</Text>
              <Text style={styles.minimumUsd}>{`0~$${depositInfo.serviceFeeUsd}`}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }, [depositInfo, styles, tokenInfo]);

  const reminderUI = useMemo(() => {
    return (
      <View style={styles.reminderWrap}>
        <Svg icon="info" size={pTd(22)} />
        <Text style={styles.reminderText}>
          {`Send ${tokenInfo.label || tokenInfo.symbol} on `}
          <Text style={styles.reminderHighlightText}>{sourceChain.name}</Text>
          {' to this address and receive on the '}
          <Text style={styles.reminderHighlightText}>{formatChainInfoToShow(destinationChain.chainId)}</Text>
          {'. Transfers from both exchange and non-exchange addresses are accepted.'}
        </Text>
      </View>
    );
  }, [destinationChain.chainId, sourceChain.name, styles, tokenInfo.label, tokenInfo.symbol]);

  const supportUI = useMemo(() => {
    return (
      <View style={styles.supportWrap}>
        <Text style={styles.supportText}>Powered by</Text>
        <Svg icon="ETransferLogo" size={pTd(70)} iconStyle={styles.etransferIcon} />
      </View>
    );
  }, [styles]);

  return (
    <View style={styles.container}>
      {depositInfo && (
        <>
          <ReceiveQRCode data={qrcodeData ?? ''} address={qrcodeAddress ?? ''} />
          {infoUI}
          {reminderUI}
          {supportUI}
        </>
      )}
    </View>
  );
}

const getStyles = makeStyles((theme: any) => ({
  container: {
    marginTop: pTd(24),
  },
  exchangeIcons: {
    marginTop: pTd(24),
    alignItems: 'center',
  },
  reminderWrap: {
    marginTop: pTd(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  reminderText: {
    marginLeft: pTd(12),
    marginRight: pTd(12),
    fontSize: pTd(14),
    color: theme.colors.textBase2,
  },
  reminderHighlightText: {
    color: theme.colors.textBase1,
  },
  infoContainer: {
    marginTop: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoLabelHelpIcon: {
    marginLeft: pTd(4),
  },
  infoWrap: {
    height: pTd(74),
    width: '100%',
    padding: pTd(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoWrapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: pTd(16),
    color: theme.colors.textBase1,
  },
  minimumWrap: {
    alignItems: 'flex-end',
  },
  minimumCount: {
    fontSize: pTd(16),
    ...fonts.SGMediumFont,
  },
  minimumUsd: {
    fontSize: pTd(14),
  },
  supportWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportText: {
    fontSize: pTd(12),
    color: theme.colors.textBase3,
  },
  etransferIcon: {
    marginLeft: pTd(4),
  },
}));
