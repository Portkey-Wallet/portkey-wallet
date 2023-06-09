import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Image } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL, TextS } from 'components/CommonText';
import { useCurrentCaInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useGStyles } from 'assets/theme/useGStyles';
import { CommonButtonProps } from 'components/CommonButton';
import { SendTransactionParams } from '@portkey/provider-types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ZERO } from '@portkey-wallet/constants/misc';
import { usePin } from 'hooks/store';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getManagerAccount } from 'utils/redux';
import { customFetch } from '@portkey-wallet/utils/fetch';

interface TransactionModalPropsType {
  dappInfo: DappStoreItem;
  transactionInfo: SendTransactionParams & { params: any };
  onReject: () => void;
  onSign: () => void;
}
const ConnectModal = (props: TransactionModalPropsType) => {
  const {
    dappInfo: { origin, name, icon },
    transactionInfo,
    onReject,
    onSign,
  } = props;
  const { t } = useLanguage();
  const gStyles = useGStyles();
  const isMainnet = useIsMainnet();
  const pin = usePin();

  const { walletName, caHash } = useCurrentWalletInfo();
  const amountInUsdShow = useAmountInUsdShow();

  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

  const currentCaInfo = useCurrentCaInfo();
  const currentCaAddress = currentCaInfo?.[transactionInfo.chainId]?.caAddress;
  const isCAContract = useMemo(
    () => chainInfo?.caContractAddress === transactionInfo?.contractAddress,
    [chainInfo?.caContractAddress, transactionInfo?.contractAddress],
  );

  const [fee, setFee] = useState('');

  const isTransfer = useMemo(() => transactionInfo.method.toLowerCase() === 'transfer', [transactionInfo.method]);

  const buttonList = useMemo(
    () => [
      {
        title: t('Reject'),
        type: 'outline' as CommonButtonProps['type'],
        onPress: () => {
          onReject?.();
          OverlayModal.hide();
        },
      },
      {
        title: t('Approve'),
        type: 'primary' as CommonButtonProps['type'],
        onPress: () => {
          onSign?.();
          OverlayModal.hide();
        },
      },
    ],
    [onReject, onSign, t],
  );

  const transferContent = useMemo(() => {
    const { symbol, amount } = transactionInfo?.params?.paramsOption || {};

    return (
      <View>
        <TextL>Amount</TextL>
        <TextL>{`${formatAmountShow(amount)} ${symbol}`}</TextL>
        <TextL>{amountInUsdShow(amount, 0, symbol)}</TextL>
        <TextL>{walletName}</TextL>
        <TextL>from</TextL>
        <TextL>{formatStr2EllipsisStr(addressFormat(currentCaAddress, transactionInfo.chainId))}</TextL>
        <TextL>network</TextL>
        <TextL>{formatChainInfoToShow(transactionInfo.chainId)}</TextL>
        <TextL>transactionFee</TextL>
        <TextL>{`${formatAmountShow(fee)} ELF`}</TextL>
        <TextL>{amountInUsdShow(fee, 0, 'ELF')}</TextL>
        <TextL>Total</TextL>
        {symbol === 'ELF' ? (
          <>
            <TextL>{`${formatAmountShow(ZERO.plus(amount).plus(fee))} ${symbol}`}</TextL>
            {isMainnet && <TextL>{amountInUsdShow(ZERO.plus(amount).plus(fee).toNumber(), 0, symbol)}</TextL>}
          </>
        ) : (
          <>
            <TextL>{`${formatAmountShow(fee)} ELF`}</TextL>
            {isMainnet && <TextL>{amountInUsdShow(fee, 0, 'ELF')}</TextL>}
            <TextL>{`${formatAmountShow(amount)} ${symbol}`}</TextL>
            {isMainnet && <TextL>{amountInUsdShow(amount, 0, symbol)}</TextL>}
          </>
        )}
      </View>
    );
  }, [
    amountInUsdShow,
    currentCaAddress,
    fee,
    isMainnet,
    transactionInfo.chainId,
    transactionInfo?.params?.paramsOption,
    walletName,
  ]);

  const otherTransactionContent = useMemo(() => {
    const data = transactionInfo.params?.paramsOption || {};

    return (
      <View>
        <TextL>from</TextL>
        <TextL>{formatStr2EllipsisStr(addressFormat(currentCaAddress, transactionInfo.chainId))}</TextL>
        <TextL>network</TextL>
        <TextL>{formatChainInfoToShow(transactionInfo.chainId)}</TextL>
        <TextL>transactionFee</TextL>
        <TextL>{`${formatAmountShow(fee)} ELF`}</TextL>
        <TextL>{amountInUsdShow(fee, 0, 'ELF')}</TextL>

        <TextL>Data</TextL>
        <View>
          {Object.keys(data).map(item => (
            <>
              <div className="title">{item}</div>
              <div className="content">{data[item]}</div>
            </>
          ))}
        </View>
      </View>
    );
  }, [amountInUsdShow, currentCaAddress, fee, transactionInfo.chainId, transactionInfo.params?.paramsOption]);

  // get  fee
  const getFee = useCallback(async () => {
    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    const contract = await getContractBasic({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint,
      account: account,
    });

    try {
      const raw = await contract.encodedTx(
        'ManagerForwardCall',
        isCAContract
          ? transactionInfo?.params?.paramsOption
          : {
              caHash: caHash,
              contractAddress: transactionInfo.contractAddress,
              methodName: transactionInfo.method,
              args: transactionInfo.params?.paramsOption,
            },
      );

      const { TransactionFee } = await customFetch(`${chainInfo?.endPoint}/api/blockChain/calculateTransactionFee`, {
        method: 'POST',
        params: {
          RawTransaction: raw,
        },
      });

      setFee(TransactionFee?.ELF);
    } catch (e) {
      console.log(e);
      setFee('0');
      console.log('get fee error', e);
    }
  }, [
    caHash,
    chainInfo,
    isCAContract,
    pin,
    transactionInfo.contractAddress,
    transactionInfo.method,
    transactionInfo.params?.paramsOption,
  ]);

  useEffect(() => {
    getFee();
  }, [getFee]);

  useEffect(() => {
    const symbol = transactionInfo?.params?.paramsOption?.symbol;
    if (!symbol) return;
    if (symbol === 'ELF') {
      getTokenPrice(symbol);
    } else {
      getTokensPrice([symbol, 'ELF']);
    }
  }, [getTokenPrice, getTokensPrice, transactionInfo?.params?.paramsOption?.symbol]);

  return (
    <ModalBody modalBodyType="bottom" title="" bottomButtonGroup={buttonList}>
      <View style={[styles.contentWrap, gStyles.overlayStyle]}>
        <View style={GStyles.center}>
          <Image source={{ uri: icon }} style={styles.favIcon} />
          <TextL numberOfLines={1} ellipsizeMode="tail" style={[fonts.mediumFont, styles.title]}>
            {name}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode="tail" style={FontStyles.font7}>
            {origin}
          </TextS>
          <TextS style={styles.method}>{transactionInfo.method}</TextS>
          {isTransfer ? transferContent : otherTransactionContent}
        </View>
      </View>
    </ModalBody>
  );
};

export const showTransactionModal = (props: TransactionModalPropsType) => {
  OverlayModal.show(<ConnectModal {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showTransactionModal,
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  favIcon: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginBottom: pTd(8),
    marginTop: pTd(24),
  },
  title: {
    marginBottom: pTd(2),
  },
  method: {
    borderRadius: pTd(6),
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.primaryColor,
    backgroundColor: defaultColors.bg9,
    ...GStyles.paddingArg(2, 8),
  },
});

const transferGroupStyle = StyleSheet.create({
  title: {},
});

const otherTransactionGroupStyle = StyleSheet.create({});
