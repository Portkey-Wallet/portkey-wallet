import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { shrinkSendQrData, QRCodeDataObjType } from '@portkey-wallet/utils/qrCode';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { makeStyles } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import ExchangeIcons from 'components/ExchangeIcons';
import Svg from 'components/Svg';
import ReceiveQRCode from '../ReceiveQRCode';
import { formatChainInfoToShow } from '@portkey-wallet/utils';

export default function ReceiveByETransfer({
  sourceChain,
  destinationChain,
  tokenItem,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
  tokenItem: TokenItemShowType;
}) {
  const styles = getStyles();

  const currentWallet = useCurrentWalletInfo();
  const { chainType } = useCurrentNetwork();
  const currentNetWork = useCurrentNetworkInfo();
  const currentCaAddress = currentWallet?.[destinationChain.chainId]?.caAddress;
  const toCaAddress = useMemo(
    () => `ELF_${currentCaAddress}_${destinationChain.chainId}`,
    [currentCaAddress, destinationChain.chainId],
  );

  const qrcodeData = useMemo(() => {
    return 'aaa';
  }, []);
  const qrcodeAddress = useMemo(() => {
    return 'aaa';
  }, []);

  const reminderUI = useMemo(() => {
    return <Text>Reminder</Text>;
  }, []);

  return (
    <View style={styles.container}>
      <ReceiveQRCode data={qrcodeData ?? ''} address={qrcodeAddress ?? ''} style={styles.qrcode} />
      {reminderUI}
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    marginTop: pTd(24),
  },
  exchangeIcons: {
    marginTop: pTd(24),
    alignItems: 'center',
  },
  qrcode: {
    marginTop: pTd(16),
  },
  reminderWrap: {
    marginTop: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  reminderText: {
    marginLeft: pTd(12),
    fontSize: pTd(16),
    color: theme.colors.textBase2,
  },
  reminderHighlightText: {
    color: theme.colors.textBase1,
  },
}));
