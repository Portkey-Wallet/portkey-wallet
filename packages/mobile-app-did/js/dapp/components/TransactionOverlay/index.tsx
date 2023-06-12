import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Text } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL, TextM, TextS } from 'components/CommonText';
import { useCurrentCaInfo, useCurrentWalletInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
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
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { getHost } from '@portkey-wallet/utils/dapp/browser';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

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

  const { walletName } = useWallet();
  const wallet = useCurrentWalletInfo();

  const amountInUsdShow = useAmountInUsdShow();

  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [tokenPriceObject, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

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
      <>
        <Text style={[transferGroupStyle.tokenCount, FontStyles.font5, fonts.mediumFont]}>
          {`- ${formatAmountShow(amount)} ${symbol}`}
        </Text>
        {!isMainnet && (
          <TextM style={transferGroupStyle.tokenUSD}>{`-$ ${formatAmountShow(
            ZERO.plus(amount).multipliedBy(tokenPriceObject[symbol]),
          )}`}</TextM>
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
              <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(fee)} ELF`}</TextM>
            </View>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM />
              <TextS style={transferGroupStyle.lightGrayFontColor}>{amountInUsdShow(fee, 0, 'ELF')}</TextS>
            </View>
          </View>

          {/* <TextL>Total</TextL>
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
          )} */}
        </View>
      </>
    );
  }, [
    amountInUsdShow,
    fee,
    isMainnet,
    t,
    tokenPriceObject,
    transactionInfo.chainId,
    transactionInfo?.params?.paramsOption,
    wallet,
    walletName,
  ]);

  const otherTransactionContent = useMemo(() => {
    const data = transactionInfo.params?.paramsOption || {};

    console.log('================ transactionInfo.params?.paramsOption====================');

    return (
      <View>
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
              <TextM style={transferGroupStyle.blackFontColor}>{`${formatAmountShow(fee)} ELF`}</TextM>
            </View>
            <View style={[transferGroupStyle.flexSpaceBetween]}>
              <TextM />
              <TextS style={transferGroupStyle.lightGrayFontColor}>{amountInUsdShow(fee, 0, 'ELF')}</TextS>
            </View>
          </View>
        </View>

        <View style={transferGroupStyle.card}>
          <TextM>Card</TextM>
          {Object.keys(data).map(item => (
            <>
              <TextL>{item}</TextL>
              <TextL>{data[item]}</TextL>
            </>
          ))}
        </View>
      </View>
    );
  }, [amountInUsdShow, fee, t, transactionInfo.chainId, transactionInfo.params?.paramsOption, wallet, walletName]);

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

      setFee(TransactionFee?.ELF);
    } catch (e) {
      console.log(e);
      setFee('0');
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
      <View style={[styles.contentWrap, gStyles.overlayStyle]}>
        <View style={GStyles.center}>
          <DiscoverWebsiteImage size={pTd(48)} imageUrl={icon} style={styles.favIcon} />
          <TextL numberOfLines={1} ellipsizeMode="tail" style={[fonts.mediumFont, styles.title]}>
            {name || getHost(origin)}
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
  buttonWrapStyle: {
    justifyContent: 'flex-end',
    paddingBottom: pTd(12),
    paddingTop: pTd(12),
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    paddingLeft: pTd(8),
  },
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
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
  titles1: {
    marginTop: pTd(56),
  },
  values1: {
    marginTop: pTd(4),
  },
  divider: {
    marginTop: pTd(24),
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.border6,
  },
  titles2: {
    marginTop: pTd(25),
  },
  values2: {
    marginTop: pTd(4),
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
  marginTop16: {
    marginTop: pTd(16),
  },
  marginTop4: {
    marginTop: pTd(4),
  },
  marginTop0: {
    marginTop: 0,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  space: {
    flex: 1,
  },
  button: {
    marginBottom: pTd(30),
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
  greenFontColor: {
    color: defaultColors.font10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  leftTitle: {
    width: pTd(120),
    lineHeight: pTd(20),
  },
});

const otherTransactionGroupStyle = StyleSheet.create({});
