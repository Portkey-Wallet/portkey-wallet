import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, Text, ScrollView } from 'react-native';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextM, TextS } from 'components/CommonText';
import { useCurrentWalletInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
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
import DappInfoSection from '../DappInfoSection';
import TransactionDataSection from '../TransactionDataSection';
import { ELF_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { styles, transferGroupStyle } from './styles/index';

type TransactionModalPropsType = {
  dappInfo: DappStoreItem;
  transactionInfo: SendTransactionParams & { params: any };
  onReject: () => void;
  onSign: () => void;
};
const ConnectModal = (props: TransactionModalPropsType) => {
  const { dappInfo, transactionInfo, onReject, onSign } = props;
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const pin = usePin();

  const { walletName } = useWallet();
  const wallet = useCurrentWalletInfo();

  const amountInUsdShow = useAmountInUsdShow();

  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

  const isCAContract = useMemo(
    () => chainInfo?.caContractAddress === transactionInfo?.contractAddress,
    [chainInfo?.caContractAddress, transactionInfo?.contractAddress],
  );

  const [fee, setFee] = useState('');
  const [isFetchingFee, setIsFetchingFee] = useState(true);
  const [noEnoughFee, setNoEnoughFee] = useState(false);

  const isTransfer = useMemo(() => transactionInfo.method.toLowerCase() === 'transfer', [transactionInfo.method]);

  const buttonList = useMemo(() => {
    return [
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
        disabled: isFetchingFee,
        loading: isFetchingFee,
      },
    ];
  }, [isFetchingFee, onReject, onSign, t]);

  const formatAmountInUsdShow = useCallback(
    (amount: string | number, decimals: string | number, symbol: string) => {
      const value = amountInUsdShow(amount, decimals, symbol);
      if (symbol === 'ELF') {
        return value === '$ 0' ? '<$ 0.01' : value;
      } else {
        return value;
      }
    },
    [amountInUsdShow],
  );

  const transferContent = useMemo(() => {
    const { symbol, amount } = transactionInfo?.params?.paramsOption || {};
    const decimals = symbol === 'ELF' ? 8 : 0;

    return (
      <>
        {isTransfer && (
          <>
            <Text style={[transferGroupStyle.tokenCount, FontStyles.font5, fonts.mediumFont]}>
              {`${formatAmountShow(divDecimals(amount, decimals), 8)} ${symbol}`}
            </Text>
            {isMainnet && (
              <TextM style={transferGroupStyle.tokenUSD}>{`${formatAmountInUsdShow(amount, decimals, symbol)}`}</TextM>
            )}
          </>
        )}
        <View style={transferGroupStyle.card}>
          {/* From */}
          <View style={transferGroupStyle.section}>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM style={transferGroupStyle.lightGrayFontColor}>{t('From')}</TextM>
              <TextM style={transferGroupStyle.blackFontColor}>{walletName}</TextM>
            </View>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM style={transferGroupStyle.lightGrayFontColor} />
              <TextS style={transferGroupStyle.lightGrayFontColor}>
                {formatStr2EllipsisStr(
                  addressFormat(wallet?.[transactionInfo?.chainId]?.caAddress, transactionInfo.chainId),
                )}
              </TextS>
            </View>
          </View>
          {/* network */}
          <Text style={[transferGroupStyle.divider, transferGroupStyle.marginTop0]} />
          <View style={transferGroupStyle.section}>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM style={transferGroupStyle.lightGrayFontColor}>{t('Network')}</TextM>
              <TextM style={transferGroupStyle.lightGrayFontColor}>
                {formatChainInfoToShow(transactionInfo.chainId)}
              </TextM>
            </View>
          </View>

          {/* transactionFee */}
          <Text style={[transferGroupStyle.divider, transferGroupStyle.marginTop0]} />
          <View style={transferGroupStyle.section}>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM style={transferGroupStyle.fontBold}>{t('Transaction Fee')}</TextM>
              <TextM style={transferGroupStyle.fontBold}>{`${formatAmountShow(
                divDecimals(fee, ELF_DECIMAL),
                8,
              )} ELF`}</TextM>
            </View>
            {isMainnet && (
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM />
                <TextS style={transferGroupStyle.lightGrayFontColor}>
                  {fee === '0' ? '$ 0' : formatAmountInUsdShow(divDecimals(fee, ELF_DECIMAL).toNumber(), 0, 'ELF')}
                </TextS>
              </View>
            )}
          </View>

          {/* total */}
          {isTransfer && (
            <>
              <Text style={[transferGroupStyle.divider, transferGroupStyle.marginTop0]} />
              {symbol === 'ELF' ? (
                <View style={transferGroupStyle.section}>
                  <View style={[transferGroupStyle.flexSpaceBetween]}>
                    <TextM style={transferGroupStyle.fontBold}>{t('Total')}</TextM>
                    <TextM style={transferGroupStyle.fontBold}>{`${formatAmountShow(
                      divDecimals(ZERO.plus(amount).plus(fee), decimals),
                      8,
                    )} ${symbol}`}</TextM>
                  </View>
                  {isMainnet && (
                    <View style={[transferGroupStyle.flexSpaceBetween]}>
                      <TextM />
                      <TextS style={transferGroupStyle.blackFontColor}>
                        {formatAmountInUsdShow(
                          divDecimals(ZERO.plus(amount).plus(fee), ELF_DECIMAL).toNumber(),
                          0,
                          symbol,
                        )}
                      </TextS>
                    </View>
                  )}
                </View>
              ) : (
                <View style={transferGroupStyle.section}>
                  <View style={[transferGroupStyle.flexSpaceBetween]}>
                    <TextM style={transferGroupStyle.fontBold}>{t('Total')}</TextM>
                    <TextM style={transferGroupStyle.fontBold}>{`${formatAmountShow(
                      divDecimals(ZERO.plus(fee), ELF_DECIMAL),
                      8,
                    )} ELF`}</TextM>
                  </View>
                  {isMainnet && (
                    <View style={[transferGroupStyle.flexSpaceBetween]}>
                      <TextM />
                      <TextS style={transferGroupStyle.lightGrayFontColor}>
                        {fee === '0'
                          ? '$ 0'
                          : formatAmountInUsdShow(divDecimals(fee, ELF_DECIMAL).toNumber(), 0, 'ELF')}
                      </TextS>
                    </View>
                  )}
                  <View style={[transferGroupStyle.flexSpaceBetween]}>
                    <TextM />
                    <TextM style={transferGroupStyle.fontBold}>{`${formatAmountShow(
                      divDecimals(ZERO.plus(amount), decimals),
                      8,
                    )} ${symbol}`}</TextM>
                  </View>
                  {isMainnet && (
                    <View style={[transferGroupStyle.flexSpaceBetween]}>
                      <TextM />
                      <TextM style={transferGroupStyle.lightGrayFontColor}>
                        {formatAmountInUsdShow(divDecimals(ZERO.plus(amount), decimals).toNumber(), 0, symbol)}
                      </TextM>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
        {noEnoughFee && <TextS style={styles.error}>Failed to estimate transaction fee</TextS>}
      </>
    );
  }, [
    fee,
    formatAmountInUsdShow,
    isMainnet,
    isTransfer,
    noEnoughFee,
    t,
    transactionInfo.chainId,
    transactionInfo?.params?.paramsOption,
    wallet,
    walletName,
  ]);

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
              caHash: wallet.caHash,
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

      if (!TransactionFee && !TransactionFee?.ELF) setNoEnoughFee(true);

      setFee(TransactionFee?.ELF || '0');
      setIsFetchingFee(false);
    } catch (e) {
      setFee('0');
      setNoEnoughFee(true);
      console.log('get fee error', e);
      setIsFetchingFee(false);
    }
  }, [
    chainInfo,
    isCAContract,
    pin,
    transactionInfo.contractAddress,
    transactionInfo.method,
    transactionInfo.params?.paramsOption,
    wallet.caHash,
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
    <ModalBody modalBodyType="bottom" title="" bottomButtonGroup={buttonList} onClose={onReject}>
      <View style={GStyles.center}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextS style={styles.method}>{transactionInfo?.method}</TextS>
        <ScrollView style={styles.scrollSection}>
          {transferContent}
          {!isTransfer && (
            <TransactionDataSection
              dataInfo={transactionInfo?.params?.paramsOption || JSON.stringify(transactionInfo?.params)}
              style={styles.transactionDataSection}
            />
          )}
          <View style={styles.blank} />
        </ScrollView>
      </View>
    </ModalBody>
  );
};

export const showTransactionModal = (props: TransactionModalPropsType) => {
  OverlayModal.show(<ConnectModal {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
    onCloseRequest: props.onReject,
  });
};

export default {
  showTransactionModal,
};
