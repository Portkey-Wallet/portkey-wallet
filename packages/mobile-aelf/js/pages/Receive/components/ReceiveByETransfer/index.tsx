import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-eoa/receive';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-eoa/token';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { useReceiveByETransfer } from '@portkey-wallet/hooks/hooks-eoa/receive';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import Loading from 'components/Loading';
import Svg from 'components/Svg';
import ReceiveQRCode from '../ReceiveQRCode';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { getManagerAccount, getPin } from 'utils/redux';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import GStyles from 'assets/theme/GStyles';

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
    if (!depositInfo?.minAmount || depositInfo.minAmount === '0') {
      return null;
    }
    return (
      <View style={styles.infoWrap}>
        <Text style={styles.infoTitle}>Minimum deposit</Text>
        <View style={styles.minimumWrap}>
          <Text style={styles.minimumCount}>{`${depositInfo?.minAmount} ${tokenInfo.label ?? tokenInfo.symbol}`}</Text>
          <Text style={styles.minimumUsd}>{`$${depositInfo?.minAmountUsd}`}</Text>
        </View>
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
        <Svg
          icon="ETransferLogo"
          iconStyle={[styles.etransferIcon, !isIOS && GStyles.marginTop(pTd(3))]}
          size={pTd(70)}
        />
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
  infoWrap: {
    marginTop: pTd(24),
    height: pTd(74),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
