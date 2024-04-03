import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, Text, ScrollView } from 'react-native';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextM, TextS } from 'components/CommonText';
import { useCurrentUserInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr, sleep } from '@portkey-wallet/utils';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';
import { SendTransactionParams } from '@portkey/provider-types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { ZERO } from '@portkey-wallet/constants/misc';
import { usePin } from 'hooks/store';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getManagerAccount } from 'utils/redux';
import DappInfoSection from '../DappInfoSection';
import TransactionDataSection from '../TransactionDataSection';
import { ELF_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { styles, transferGroupStyle } from './styles/index';
import Lottie from 'lottie-react-native';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { RememberInfoType, RememberMe } from 'components/RememberMe';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { isIOS } from '@rneui/base';

enum ErrorText {
  ESTIMATE_ERROR = 'Failed to estimate transaction fee',
  SYNCHRONIZING = 'Synchronizing on-chain account information...',
}

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
  const defaultToken = useDefaultToken();
  const pin = usePin();
  const { nickName = '' } = useCurrentUserInfo() || {};
  const wallet = useCurrentWalletInfo();
  const checkManagerSyncState = useCheckManagerSyncState();
  const amountInUsdShow = useAmountInUsdShow();
  const updateSessionInfo = useUpdateSessionInfo();

  const [rememberInfo, setRememberMeInfo] = useState<RememberInfoType>({
    isRemember: false,
    value: SessionExpiredPlan.hour1,
  });

  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

  const [tokenDecimal, setTokenDecimal] = useState('0');
  const [isFetchingDecimal, setIsFetchingDecimal] = useState(false);

  const [fee, setFee] = useState('');
  const [isFetchingFee, setIsFetchingFee] = useState(true);
  const [errorText, setErrorText] = useState('');

  const isCAContract = useMemo(
    () => chainInfo?.caContractAddress === transactionInfo?.contractAddress,
    [chainInfo?.caContractAddress, transactionInfo?.contractAddress],
  );

  const isTransfer = useMemo(() => transactionInfo.method.toLowerCase() === 'transfer', [transactionInfo.method]);

  const ButtonList = useMemo(
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
        onPress: async () => {
          onSign?.();
          OverlayModal.hide();

          await sleep(500);
          if (!pin) return;
          if (rememberInfo.isRemember) {
            updateSessionInfo({
              manager: getManagerAccount(pin),
              origin: dappInfo.origin,
              expiredPlan: rememberInfo?.value || SessionExpiredPlan.hour1,
            });
          }
        },
      },
    ],
    [dappInfo.origin, onReject, onSign, pin, rememberInfo.isRemember, rememberInfo?.value, t, updateSessionInfo],
  );

  const formatAmountInUsdShow = useCallback(
    (amount: string | number, decimals: string | number, symbol: string) => {
      return amountInUsdShow(amount, decimals, symbol);
    },
    [amountInUsdShow],
  );

  const transferContent = useMemo(() => {
    const { symbol, amount } = transactionInfo?.params?.paramsOption || {};
    const decimals = symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimal;

    return (
      <>
        {isTransfer && (
          <>
            <View style={transferGroupStyle.tokenWrap}>
              {isFetchingDecimal && (
                <Lottie
                  style={transferGroupStyle.loadingIcon}
                  source={require('assets/lottieFiles/loading.json')}
                  autoPlay
                  loop
                />
              )}
              <Text style={[transferGroupStyle.tokenCount, FontStyles.font5, fonts.mediumFont]}>
                {isFetchingDecimal ? symbol : `${formatAmountShow(divDecimals(amount, decimals), 8)} ${symbol}`}
              </Text>
            </View>
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
              <TextM style={transferGroupStyle.blackFontColor}>{nickName}</TextM>
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

              <View style={transferGroupStyle.tokenWrap}>
                {isFetchingFee && (
                  <Lottie
                    style={transferGroupStyle.smallLoadingIcon}
                    source={require('assets/lottieFiles/loading.json')}
                    autoPlay
                    loop
                  />
                )}
                <TextM style={transferGroupStyle.fontBold}>
                  {isFetchingFee
                    ? defaultToken.symbol
                    : `${formatAmountShow(divDecimals(fee, defaultToken.decimals), defaultToken.decimals)} ${
                        defaultToken.symbol
                      }`}
                </TextM>
              </View>
            </View>
            {isMainnet && (
              <View style={[transferGroupStyle.flexSpaceBetween]}>
                <TextM />
                <TextS style={transferGroupStyle.lightGrayFontColor}>
                  {fee === '0'
                    ? '$ 0'
                    : formatAmountInUsdShow(divDecimals(fee, defaultToken.decimals).toNumber(), 0, defaultToken.symbol)}
                </TextS>
              </View>
            )}
          </View>

          {/* total */}
          {isTransfer && (
            <>
              <Text style={[transferGroupStyle.divider, transferGroupStyle.marginTop0]} />
              {symbol === defaultToken.symbol ? (
                <View style={transferGroupStyle.section}>
                  <View style={[transferGroupStyle.flexSpaceBetween]}>
                    <TextM style={transferGroupStyle.fontBold}>{t('Total')}</TextM>

                    <View style={transferGroupStyle.tokenWrap}>
                      {isFetchingFee && (
                        <Lottie
                          style={transferGroupStyle.smallLoadingIcon}
                          source={require('assets/lottieFiles/loading.json')}
                          autoPlay
                          loop
                        />
                      )}
                      <TextM style={transferGroupStyle.fontBold}>
                        {isFetchingFee
                          ? defaultToken.symbol
                          : `${formatAmountShow(divDecimals(ZERO.plus(amount).plus(fee), decimals), 8)} ${symbol}`}
                      </TextM>
                    </View>
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
                    <View style={transferGroupStyle.tokenWrap}>
                      {isFetchingFee && (
                        <Lottie
                          style={transferGroupStyle.smallLoadingIcon}
                          source={require('assets/lottieFiles/loading.json')}
                          autoPlay
                          loop
                        />
                      )}
                      <TextM style={transferGroupStyle.fontBold}>
                        {isFetchingFee
                          ? defaultToken.symbol
                          : `${formatAmountShow(divDecimals(ZERO.plus(fee), defaultToken.decimals), 8)} ${
                              defaultToken.symbol
                            }`}
                      </TextM>
                    </View>
                  </View>
                  {isMainnet && (
                    <View style={[transferGroupStyle.flexSpaceBetween]}>
                      <TextM />
                      <TextS style={transferGroupStyle.lightGrayFontColor}>
                        {fee === '0'
                          ? '$ 0'
                          : formatAmountInUsdShow(
                              divDecimals(fee, defaultToken.decimals).toNumber(),
                              0,
                              defaultToken.symbol,
                            )}
                      </TextS>
                    </View>
                  )}
                  <View style={[transferGroupStyle.flexSpaceBetween]}>
                    <TextM />
                    <View style={transferGroupStyle.tokenWrap}>
                      {isFetchingDecimal && (
                        <Lottie
                          style={transferGroupStyle.smallLoadingIcon}
                          source={require('assets/lottieFiles/loading.json')}
                          autoPlay
                          loop
                        />
                      )}
                      <TextM style={transferGroupStyle.fontBold}>
                        {isFetchingDecimal
                          ? symbol
                          : `${formatAmountShow(divDecimals(ZERO.plus(amount), decimals), 8)} ${symbol}`}
                      </TextM>
                    </View>
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
        {!!errorText && <TextS style={styles.error}>{errorText}</TextS>}
      </>
    );
  }, [
    defaultToken.decimals,
    defaultToken.symbol,
    errorText,
    fee,
    formatAmountInUsdShow,
    isFetchingDecimal,
    isFetchingFee,
    isMainnet,
    isTransfer,
    nickName,
    t,
    tokenDecimal,
    transactionInfo.chainId,
    transactionInfo?.params?.paramsOption,
    wallet,
  ]);

  // get  fee
  const getFee = useCallback(async () => {
    if (!chainInfo || !pin) return;
    const account = getManagerAccount(pin);
    if (!account) return;

    const _isManagerSynced = await checkManagerSyncState(transactionInfo.chainId);
    if (!_isManagerSynced) return setErrorText('Synchronizing on-chain account information...');

    const contract = await getContractBasic({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint,
      account: account,
    });

    try {
      const paramsOption = isCAContract
        ? transactionInfo?.params?.paramsOption
        : {
            caHash: wallet.caHash,
            contractAddress: transactionInfo.contractAddress,
            methodName: transactionInfo.method,
            args: transactionInfo.params?.paramsOption,
          };

      const req = await contract.calculateTransactionFee('ManagerForwardCall', paramsOption);
      const { TransactionFee } = req.data || {};

      if (req.error) request.errorReport('calculateTransactionFee', paramsOption, req.error);

      if (!TransactionFee && !TransactionFee?.[defaultToken.symbol]) setErrorText(ErrorText.ESTIMATE_ERROR);

      setFee(TransactionFee?.[defaultToken.symbol] || '0');

      setIsFetchingFee(false);
    } catch (e) {
      setFee('0');
      setErrorText(ErrorText.ESTIMATE_ERROR);
      setIsFetchingFee(false);
    }
  }, [
    chainInfo,
    checkManagerSyncState,
    defaultToken.symbol,
    isCAContract,
    pin,
    transactionInfo.chainId,
    transactionInfo.contractAddress,
    transactionInfo.method,
    transactionInfo.params?.paramsOption,
    wallet.caHash,
  ]);

  // get decimals
  const getDecimals = useCallback(async () => {
    setIsFetchingDecimal(true);
    try {
      const res = await request.token.fetchTokenItemBySearch({
        params: {
          symbol: transactionInfo?.params?.paramsOption?.symbol,
          chainId: transactionInfo.chainId,
        },
      });
      const { symbol, decimals } = res;

      if (symbol && decimals) {
        setTokenDecimal(decimals);
      }
    } catch (error) {
      console.log('filter search error', error);
    } finally {
      setIsFetchingDecimal(false);
    }
  }, [transactionInfo.chainId, transactionInfo?.params?.paramsOption?.symbol]);

  useEffect(() => {
    getFee();
    getDecimals();
  }, [checkManagerSyncState, getDecimals, getFee, transactionInfo.chainId]);

  useEffect(() => {
    const symbol = transactionInfo?.params?.paramsOption?.symbol;
    if (!symbol) return;
    if (symbol === defaultToken.symbol) {
      getTokenPrice(symbol);
    } else {
      getTokensPrice([symbol, defaultToken.symbol]);
    }
  }, [defaultToken.symbol, getTokenPrice, getTokensPrice, transactionInfo?.params?.paramsOption?.symbol]);

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
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
      <OverlayBottomSection bottomButtonGroup={ButtonList}>
        <RememberMe dappInfo={dappInfo} rememberInfo={rememberInfo} setRememberMeInfo={setRememberMeInfo} />
      </OverlayBottomSection>
    </ModalBody>
  );
};

export const showTransactionModal = (props: TransactionModalPropsType) => {
  OverlayModal.show(<ConnectModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

export default {
  showTransactionModal,
};
