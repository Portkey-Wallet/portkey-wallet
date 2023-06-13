import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextM, TextS } from 'components/CommonText';
import { useCurrentWalletInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
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
import { screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import DappInfoSection from '../DappInfoSection';
import TransactionDataSection from '../TransactionDataSection';
import { ELF_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';

interface TransactionModalPropsType {
  dappInfo: DappStoreItem;
  transactionInfo: SendTransactionParams & { params: any };
  onReject: () => void;
  onSign: () => void;
}
const ConnectModal = (props: TransactionModalPropsType) => {
  const { dappInfo, transactionInfo, onReject, onSign } = props;
  const { t } = useLanguage();
  const gStyles = useGStyles();
  const isMainnet = useIsMainnet();
  const pin = usePin();

  const { walletName } = useWallet();
  const wallet = useCurrentWalletInfo();

  const amountInUsdShow = useAmountInUsdShow();

  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [tokenPriceObject, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

  const isCAContract = useMemo(
    () => chainInfo?.caContractAddress === transactionInfo?.contractAddress,
    [chainInfo?.caContractAddress, transactionInfo?.contractAddress],
  );

  const [fee, setFee] = useState('');
  const [noEnoughFee, setNoEnoughFee] = useState(false);

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
        <Text style={[transferGroupStyle.tokenCount, FontStyles.font5, fonts.mediumFont]}>
          {`${formatAmountShow(divDecimals(amount, decimals), 8)} ${symbol}`}
        </Text>
        {isMainnet && (
          <TextM style={transferGroupStyle.tokenUSD}>{`${formatAmountInUsdShow(amount, decimals, symbol)}`}</TextM>
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
              <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(
                divDecimals(fee, ELF_DECIMAL),
                8,
              )} ELF`}</TextM>
            </View>
            {!isMainnet && (
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM />
                <TextS style={transferGroupStyle.lightGrayFontColor}>
                  {fee === '0' ? '$ 0' : formatAmountInUsdShow(divDecimals(fee, ELF_DECIMAL).toNumber(), 0, 'ELF')}
                </TextS>
              </View>
            )}
          </View>

          {/* total */}
          <Text style={[transferGroupStyle.divider, transferGroupStyle.marginTop0]} />
          {symbol === 'ELF' ? (
            <View style={transferGroupStyle.section}>
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM style={transferGroupStyle.fontBold}>{t('Total')}</TextM>
                <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(
                  divDecimals(ZERO.plus(amount).plus(fee), decimals),
                  8,
                )} ${symbol}`}</TextM>
              </View>
              {!isMainnet && (
                <View style={[transferGroupStyle.flexSpaceBetween]}>
                  <TextM />
                  <TextS style={transferGroupStyle.blackFontColor}>
                    {formatAmountInUsdShow(divDecimals(ZERO.plus(amount).plus(fee)).toNumber(), 0, symbol)}
                  </TextS>
                </View>
              )}
            </View>
          ) : (
            <View style={transferGroupStyle.section}>
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM style={transferGroupStyle.fontBold}>{t('Total')}</TextM>
                <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(
                  divDecimals(ZERO.plus(fee), ELF_DECIMAL),
                  8,
                )} ELF`}</TextM>
              </View>
              {!isMainnet && (
                <View style={[transferGroupStyle.flexSpaceBetween]}>
                  <TextM />
                  <TextS style={transferGroupStyle.lightGrayFontColor}>
                    {fee === '0' ? '$ 0' : formatAmountInUsdShow(divDecimals(fee, ELF_DECIMAL).toNumber(), 0, 'ELF')}
                  </TextS>
                </View>
              )}
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM />
                <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(
                  divDecimals(ZERO.plus(amount), decimals),
                  8,
                )} ${symbol}`}</TextM>
              </View>
              {!isMainnet && (
                <View style={[transferGroupStyle.flexSpaceBetween]}>
                  <TextM />
                  <TextM style={transferGroupStyle.lightGrayFontColor}>
                    {formatAmountInUsdShow(divDecimals(ZERO.plus(amount), decimals).toNumber(), 0, symbol)}
                  </TextM>
                </View>
              )}
            </View>
          )}
        </View>
        {noEnoughFee && <TextS style={styles.error}>Insufficient funds for transaction fee</TextS>}
      </>
    );
  }, [
    fee,
    formatAmountInUsdShow,
    isMainnet,
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

      if (!TransactionFee && !TransactionFee?.ELF) return setNoEnoughFee(true);

      setFee(TransactionFee?.ELF || '0');
    } catch (e) {
      setFee('0');
      setNoEnoughFee(true);
      console.log('get fee error', e);
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
    <ModalBody modalBodyType="bottom" title="" bottomButtonGroup={buttonList}>
      <View style={GStyles.center}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextS style={styles.method}>{transactionInfo?.method}</TextS>
        <ScrollView style={styles.scrollSection}>
          {transferContent}
          {isTransfer && (
            <TransactionDataSection
              dataInfo={transactionInfo?.params?.paramsOption}
              style={styles.transactionDataSection}
            />
          )}
        </ScrollView>
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

  method: {
    borderRadius: pTd(6),
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.primaryColor,
    backgroundColor: defaultColors.bg9,
    ...GStyles.paddingArg(2, 8),
  },
  transactionDataSection: {
    marginTop: pTd(16),
  },
  scrollSection: {
    height: screenHeight / 2,
    paddingLeft: pTd(20),
  },
  error: {
    color: defaultColors.error,
    textAlign: 'left',
    marginTop: pTd(8),
  },
});

const transferGroupStyle = StyleSheet.create({
  tokenCount: {
    marginTop: pTd(4),
    fontSize: pTd(28),
    width: screenWidth,
    textAlign: 'center',
  },
  tokenUSD: {
    color: defaultColors.font3,
    width: screenWidth,
    textAlign: 'center',
    marginTop: pTd(4),
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    lineHeight: pTd(20),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border6,
  },
  card: {
    marginTop: pTd(24),
    borderRadius: pTd(6),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
    width: pTd(335),
  },
  section: {
    ...GStyles.paddingArg(16, 12),
  },
  lightGrayFontColor: {
    color: defaultColors.font3,
  },
  blackFontColor: {
    color: defaultColors.font5,
  },
  fontBold: {
    ...fonts.mediumFont,
  },
  marginTop0: {
    marginTop: 0,
  },
});
