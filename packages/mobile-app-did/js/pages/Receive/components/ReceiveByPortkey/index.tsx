import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { shrinkSendQrData, QRCodeDataObjType } from '@portkey-wallet/utils/qrCode';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { makeStyles } from '@rneui/themed';
import ExchangeIcons from 'components/ExchangeIcons';
import Svg from 'components/Svg';
import ExchangeTabSwitch from './ExchangeTabSwitch';
import ReceiveFromExchangeModal from '../ReceiveFromExchangeModal';
import ReceiveQRCode from '../ReceiveQRCode';
import { formatChainInfoToShow } from '@portkey-wallet/utils';

export default function ReceiveByPortkey({
  sourceChain,
  destinationChain,
  tokenItem,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
  tokenItem: TokenItemShowType;
}) {
  const styles = getStyles();
  const [isExchangeSelected, setExchangeSelected] = useState(true);
  const isSupportExchange = useMemo(() => {
    return sourceChain.network === 'AELF' && destinationChain.chainId === 'AELF';
  }, [destinationChain.chainId, sourceChain.network]);

  const onExchangeTabSelected = useCallback((selected: boolean) => {
    setExchangeSelected(selected);
  }, []);

  useEffect(() => {
    if (isSupportExchange) {
      ReceiveFromExchangeModal.showList({
        onPress: (isExchange: boolean) => {
          setExchangeSelected(isExchange);
        },
      });
    }
  }, [isSupportExchange]);

  const currentWallet = useCurrentWalletInfo();
  const { chainType } = useCurrentNetwork();
  const currentNetWork = useCurrentNetworkInfo();
  const currentCaAddress = currentWallet?.[destinationChain.chainId]?.caAddress;
  const toCaAddress = useMemo(
    () => `ELF_${currentCaAddress}_${destinationChain.chainId}`,
    [currentCaAddress, destinationChain.chainId],
  );

  const qrcodeData = useMemo(() => {
    if (isSupportExchange && isExchangeSelected) {
      return currentCaAddress;
    } else {
      const info: QRCodeDataObjType = {
        address: toCaAddress,
        networkType: currentNetWork.networkType,
        chainType,
        type: 'send',
        toInfo: {
          name: '',
          address: toCaAddress,
        },
        assetInfo: {
          symbol: tokenItem?.symbol,
          label: tokenItem.label,
          tokenContractAddress: tokenItem?.tokenContractAddress || tokenItem?.address,
          chainId: tokenItem?.chainId,
          decimals: tokenItem?.decimals || 0,
        },
      };
      return JSON.stringify(shrinkSendQrData(info));
    }
  }, [
    chainType,
    currentCaAddress,
    currentNetWork.networkType,
    isExchangeSelected,
    isSupportExchange,
    toCaAddress,
    tokenItem?.address,
    tokenItem?.chainId,
    tokenItem?.decimals,
    tokenItem.label,
    tokenItem?.symbol,
    tokenItem?.tokenContractAddress,
  ]);
  const qrcodeAddress = useMemo(() => {
    if (isSupportExchange && isExchangeSelected) {
      return currentCaAddress;
    } else {
      return toCaAddress;
    }
  }, [currentCaAddress, isExchangeSelected, isSupportExchange, toCaAddress]);

  const reminderUI = useMemo(() => {
    return (
      <View style={styles.reminderWrap}>
        <Svg icon="info" size={pTd(22)} />
        <Text style={styles.reminderText}>
          {`Send ${tokenItem.label || tokenItem.symbol} on `}
          <Text style={styles.reminderHighlightText}>{`${sourceChain.name}${
            isSupportExchange && isExchangeSelected ? ' from exchange' : ''
          }`}</Text>
          {' to this address and receive on the '}
          <Text style={styles.reminderHighlightText}>{formatChainInfoToShow(destinationChain.chainId)}</Text>
        </Text>
      </View>
    );
  }, [
    destinationChain.chainId,
    isExchangeSelected,
    isSupportExchange,
    sourceChain.name,
    styles,
    tokenItem.label,
    tokenItem.symbol,
  ]);

  return (
    <View style={styles.container}>
      {isSupportExchange && (
        <ExchangeTabSwitch isExchangeSelected={isExchangeSelected} onSelected={onExchangeTabSelected} />
      )}
      {isSupportExchange && isExchangeSelected && (
        <View style={styles.exchangeIcons}>
          <ExchangeIcons />
        </View>
      )}
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
