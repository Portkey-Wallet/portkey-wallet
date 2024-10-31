import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { pTd } from 'utils/unit';
import { TReceiveFromNetworkItem } from '@portkey-wallet/types/types-ca/receive';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
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
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';

export default function ReceiveByPortkey({
  sourceChain,
  destinationChain,
  tokenInfo,
}: {
  sourceChain: TReceiveFromNetworkItem;
  destinationChain: IChainItemType;
  tokenInfo: IUserTokenItemResponse;
}) {
  const styles = getStyles();
  const [isExchangeSelected, setExchangeSelected] = useState(true);
  const tokenItem = useMemo(() => {
    return tokenInfo.tokens?.find(item => item.chainId === destinationChain.chainId);
  }, [destinationChain.chainId, tokenInfo.tokens]);
  const isSupportExchange = useMemo(() => {
    return tokenItem?.symbol === 'ELF' && destinationChain.chainId === MAIN_CHAIN_ID;
  }, [destinationChain.chainId, tokenItem?.symbol]);
  const showExchangeTip = useMemo(
    () => tokenItem?.symbol === 'ELF' && destinationChain.chainId !== MAIN_CHAIN_ID,
    [destinationChain.chainId, tokenItem?.symbol],
  );

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
          symbol: tokenInfo?.symbol,
          label: tokenInfo.label,
          tokenContractAddress: tokenItem?.tokenContractAddress || tokenItem?.address || '',
          chainId: tokenItem?.chainId || destinationChain.chainId,
          decimals: tokenItem?.decimals || 0,
        },
      };
      return JSON.stringify(shrinkSendQrData(info));
    }
  }, [
    chainType,
    currentCaAddress,
    currentNetWork.networkType,
    destinationChain.chainId,
    isExchangeSelected,
    isSupportExchange,
    toCaAddress,
    tokenInfo,
    tokenItem,
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
          {`Send ${tokenInfo.label || tokenInfo.symbol} on `}
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
    tokenInfo.label,
    tokenInfo.symbol,
  ]);

  const receiveELFFromExchangeTip = useMemo(() => {
    return (
      <View style={styles.fromExchangeTipWrap}>
        <Svg icon="warning" size={pTd(22)} color={defaultColors.iconWarning5} />
        <TextL
          style={
            styles.fromExchangeTipText
          }>{`If you're transferring from an exchange, set the destination to “aelf MainChain”.`}</TextL>
      </View>
    );
  }, [styles]);

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
      <ReceiveQRCode
        data={qrcodeData ?? ''}
        address={qrcodeAddress ?? ''}
        style={isSupportExchange ? styles.qrcode : {}}
      />
      {reminderUI}
      {showExchangeTip && receiveELFFromExchangeTip}
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
    marginRight: pTd(12),
    fontSize: pTd(16),
    color: theme.colors.textBase2,
  },
  reminderHighlightText: {
    color: theme.colors.textBase1,
  },
  fromExchangeTipWrap: {
    marginTop: pTd(24),
    backgroundColor: theme.colors.bgWarning3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderWarning3,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
  },
  fromExchangeTipText: {
    flex: 1,
    marginLeft: pTd(12),
    color: defaultColors.textWarning3,
  },
}));
