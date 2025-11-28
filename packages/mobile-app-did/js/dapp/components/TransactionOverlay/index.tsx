import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, ScrollView } from 'react-native';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextH1, TextL, TextM } from 'components/CommonText';
import { useCurrentUserInfo, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr, sleep } from '@portkey-wallet/utils';
import { divDecimals, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
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
import TransactionDataSection from '../TransactionDataSection';
import { ELF_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { getStyles } from './styles/index';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { RememberInfoType } from 'components/RememberMe';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { isIOS } from '@rneui/base';
import TitleInfoSection from '../TitleInfoSection';
import { pTd } from 'utils/unit';
import CommonTooltip from 'components/CommonTooltip';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { SessionKeyMap } from '@portkey-wallet/constants/constants-ca/dapp';
import { showRememberMeModal } from '../RememberMeOverlay';
import LottieLoading from 'components/LottieLoading';
import { useTheme } from '@rneui/themed';

enum ErrorText {
  ESTIMATE_ERROR = 'Insufficient funds for transaction fee.',
  SYNCHRONIZING = 'Synchronizing on-chain account information...',
}
const AUTH_MSG =
  'When set to any value other than "Always," your session key will automatically approve this dApp\'s requests on this device, suppressing pop-ups until it expires. The feature disables when you disconnect or when the session key expires, and you can manually turn it off or adjust the expiration time.';
type TransactionModalPropsType = {
  dappInfo: DappStoreItem;
  transactionInfo: SendTransactionParams & { params: any };
  onReject: () => void;
  onSign: () => void;
};
const TransactionModal = (props: TransactionModalPropsType) => {
  const { dappInfo, transactionInfo, onReject, onSign } = props;
  const { t } = useLanguage();
  const isMainnet = useIsMainnet();
  const defaultToken = useDefaultToken();
  const pin = usePin();
  const { nickName = '' } = useCurrentUserInfo();
  const wallet = useCurrentWalletInfo();
  const checkManagerSyncState = useCheckManagerSyncState();
  const amountInUsdShow = useAmountInUsdShow();
  const updateSessionInfo = useUpdateSessionInfo();
  const styles = getStyles();
  const { theme } = useTheme();
  const [rememberInfo, setRememberMeInfo] = useState<RememberInfoType>({
    isRemember: false,
    value: SessionExpiredPlan.always,
  });
  const chainInfo = useCurrentChain(transactionInfo.chainId);
  const [, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();

  const [tokenDecimal, setTokenDecimal] = useState('0');

  const { symbol, amount } = useMemo(
    () => transactionInfo?.params?.paramsOption || {},
    [transactionInfo?.params?.paramsOption],
  );
  const decimals = useMemo(
    () => (symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimal),
    [defaultToken.decimals, defaultToken.symbol, symbol, tokenDecimal],
  );
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
        disabled: !!errorText,
        onPress: async () => {
          onSign?.();
          OverlayModal.hide();

          await sleep(500);
          if (!pin) {
            return;
          }
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
    [
      dappInfo.origin,
      onReject,
      onSign,
      pin,
      rememberInfo.isRemember,
      rememberInfo?.value,
      t,
      updateSessionInfo,
      errorText,
    ],
  );

  const formatAmountInUsdShow = useCallback(
    (_amount: string | number, _decimals: string | number, _symbol: string) => {
      return amountInUsdShow(_amount, _decimals, _symbol);
    },
    [amountInUsdShow],
  );

  const getFee = useCallback(async () => {
    if (!chainInfo || !pin) {
      return;
    }
    const account = getManagerAccount(pin);
    if (!account) {
      return;
    }

    const _isManagerSynced = await checkManagerSyncState(transactionInfo.chainId);
    if (!_isManagerSynced) {
      return setErrorText(ErrorText.SYNCHRONIZING);
    }

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

      if (req.error) {
        request.errorReport('calculateTransactionFee', paramsOption, req.error);
      }

      if (!TransactionFee && !TransactionFee?.[defaultToken.symbol]) {
        setErrorText(ErrorText.ESTIMATE_ERROR);
      }

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

  const showSymbolAmountUI = useMemo(() => {
    return isTransfer ? (
      <>
        <View style={[{ marginTop: pTd(8), padding: pTd(16) }]}>
          <View style={styles.tokenWrap}>
            {isFetchingDecimal && (
              <LottieLoading
                type="custom"
                lottieWrapStyle={[{ padding: pTd(0) }, GStyles.flexRow, GStyles.flexCenter, GStyles.alignCenter]}
                style={[{ width: pTd(20), marginRight: pTd(8) }]}
              />
            )}
            <TextH1 style={[fonts.BGMediumFont]}>
              {isFetchingDecimal ? symbol : `${formatTokenAmountShowWithDecimals(amount, decimals)} ${symbol}`}
            </TextH1>
          </View>
          {isMainnet && (
            <TextL
              style={[
                { lineHeight: pTd(22), color: theme.colors.textBase2, marginTop: pTd(8) },
                GStyles.flexRow,
                GStyles.flexCenter,
                GStyles.alignCenter,
              ]}>
              {`${formatAmountInUsdShow(amount, decimals, symbol)}`}
            </TextL>
          )}
        </View>
        <View style={[styles.bar]} />
      </>
    ) : (
      <></>
    );
  }, [
    amount,
    decimals,
    formatAmountInUsdShow,
    isFetchingDecimal,
    isMainnet,
    isTransfer,
    styles.bar,
    symbol,
    theme.colors.textBase2,
    styles.tokenWrap,
  ]);

  const transferContent = useMemo(() => {
    return (
      <>
        <View style={{ marginTop: pTd(8) }}>
          {/* Method */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextL>{t('Method')}</TextL>
              <TextL style={[fonts.SGMediumFont]}>{transactionInfo?.method}</TextL>
            </View>
          </View>
          {/* From */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextL>{t('From')}</TextL>
              <View>
                <TextL style={[fonts.SGMediumFont, GStyles.alignEnd]}>{nickName}</TextL>
                <TextM style={[{ color: theme.colors.textBase2 }, GStyles.alignEnd]}>
                  {formatStr2EllipsisStr(
                    addressFormat(wallet?.[transactionInfo?.chainId]?.caAddress, transactionInfo.chainId),
                  )}
                </TextM>
              </View>
            </View>
          </View>
          {/* Network */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextL>{t('Network')}</TextL>
              <View style={[GStyles.flexRow, GStyles.itemCenter, { height: pTd(22) }]}>
                <Svg icon={transactionInfo.chainId === 'AELF' ? 'mainnet' : 'chain_side'} size={pTd(18)} />
                <TextL style={[fonts.SGMediumFont, { marginLeft: pTd(4) }]}>
                  {formatChainInfoToShow(transactionInfo.chainId)}
                </TextL>
              </View>
            </View>
          </View>
          {/* TransactionFee */}
          <View style={styles.section}>
            <View style={[styles.flexSpaceBetween]}>
              <TextL>{t('Transaction Fee')}</TextL>
              <View>
                <View style={styles.tokenWrap}>
                  {isFetchingFee && <LottieLoading type="custom" style={{ width: pTd(12), marginRight: pTd(4) }} />}
                  <TextL style={[fonts.SGMediumFont]}>
                    {isFetchingFee
                      ? defaultToken.symbol
                      : `${formatTokenAmountShowWithDecimals(fee, defaultToken.decimals)} ${defaultToken.symbol}`}
                  </TextL>
                </View>
                {isMainnet && (
                  <TextM style={[{ color: theme.colors.textBase2 }, GStyles.alignEnd]}>
                    {fee === '0'
                      ? '$0'
                      : formatAmountInUsdShow(
                          divDecimals(fee, defaultToken.decimals).toNumber(),
                          0,
                          defaultToken.symbol,
                        )}
                  </TextM>
                )}
              </View>
            </View>
          </View>

          {/* Total or Data*/}
          {isTransfer ? (
            <>
              {symbol === defaultToken.symbol ? (
                <View style={styles.section}>
                  <View style={[styles.flexSpaceBetween]}>
                    <TextL>{t('Total')}</TextL>
                    <View>
                      <View style={styles.tokenWrap}>
                        {isFetchingFee && (
                          <LottieLoading type="custom" style={{ width: pTd(12), marginRight: pTd(4) }} />
                        )}
                        <TextL style={[fonts.SGMediumFont]}>
                          {isFetchingFee
                            ? defaultToken.symbol
                            : `${formatTokenAmountShowWithDecimals(
                                ZERO.plus(amount).plus(fee),
                                defaultToken.decimals,
                              )} ${symbol}`}
                        </TextL>
                      </View>
                      {isMainnet && (
                        <TextM style={[{ color: theme.colors.textBase2 }, GStyles.alignEnd]}>
                          {formatAmountInUsdShow(
                            divDecimals(ZERO.plus(amount).plus(fee), ELF_DECIMAL).toNumber(),
                            0,
                            symbol,
                          )}
                        </TextM>
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.section}>
                  <View style={[styles.flexSpaceBetween]}>
                    <TextL>{t('Total')}</TextL>
                    <View>
                      <View style={styles.tokenWrap}>
                        {isFetchingFee && (
                          <LottieLoading type="custom" style={{ width: pTd(12), marginRight: pTd(4) }} />
                        )}
                        <TextL style={[fonts.SGMediumFont]}>
                          {isFetchingFee
                            ? defaultToken.symbol
                            : `${formatTokenAmountShowWithDecimals(fee, defaultToken.decimals)} ${defaultToken.symbol}`}
                        </TextL>
                      </View>
                      {isMainnet && (
                        <TextM style={[{ color: theme.colors.textBase2 }, GStyles.alignEnd]}>
                          {fee === '0' ? '$0' : formatTokenAmountShowWithDecimals(fee, defaultToken.decimals)}
                        </TextM>
                      )}
                    </View>
                  </View>
                  <View style={[styles.flexSpaceBetween, { marginTop: pTd(16) }]}>
                    <TextM />
                    <View>
                      <View style={styles.tokenWrap}>
                        {isFetchingDecimal && (
                          <LottieLoading type="custom" style={{ width: pTd(12), marginRight: pTd(4) }} />
                        )}
                        <TextL style={[fonts.SGMediumFont]}>
                          {isFetchingDecimal
                            ? symbol
                            : `${formatTokenAmountShowWithDecimals(amount, decimals)} ${symbol}`}
                        </TextL>
                      </View>
                      {isMainnet && (
                        <TextM style={[{ color: theme.colors.textBase2 }, GStyles.alignEnd]}>
                          {formatAmountInUsdShow(divDecimals(ZERO.plus(amount), decimals).toNumber(), 0, symbol)}
                        </TextM>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <TransactionDataSection
              topTitle="Data"
              dataInfo={transactionInfo?.params?.paramsOption || JSON.stringify(transactionInfo?.params)}
              style={{ marginTop: -pTd(8), marginBottom: pTd(24) }}
              topTitleStyle={[fonts.SGRegularFont]}
            />
          )}
        </View>
        {!!errorText && <TextL style={{ color: theme.colors.textDanger2, marginBottom: pTd(8) }}>{errorText}</TextL>}
      </>
    );
  }, [
    amount,
    decimals,
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
    symbol,
    t,
    theme,
    transactionInfo,
    styles,
    wallet,
  ]);

  const rememberMeUI = useMemo(() => {
    return (
      <View style={[styles.authInfo, GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween]}>
        <View style={[GStyles.flexRow, GStyles.itemCenter]}>
          <TextL style={{ lineHeight: pTd(22) }}>{t('Require authentication')}</TextL>
          <CommonTooltip
            iconStyle={{ marginLeft: pTd(4) }}
            tooltipProps={{
              title: t('Require authentication'),
              description: AUTH_MSG,
            }}
          />
        </View>
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter]}
          onPress={() => showRememberMeModal({ rememberInfo, setRememberMeInfo })}>
          <TextL style={[{ lineHeight: pTd(22) }, fonts.SGMediumFont]}>{SessionKeyMap[rememberInfo.value]}</TextL>
          <Svg iconStyle={styles.arrowIcon} icon="down-arrow" size={pTd(16)} />
        </Touchable>
      </View>
    );
  }, [rememberInfo, styles.arrowIcon, styles.authInfo, t]);

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
      const { symbol: _symbol, decimals: _decimals } = res;

      if (_symbol && _decimals) {
        setTokenDecimal(_decimals);
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
    const _symbol = transactionInfo?.params?.paramsOption?.symbol;
    if (!_symbol) {
      return;
    }
    if (_symbol === defaultToken.symbol) {
      getTokenPrice(_symbol);
    } else {
      getTokensPrice([_symbol, defaultToken.symbol]);
    }
  }, [defaultToken.symbol, getTokenPrice, getTokensPrice, transactionInfo?.params?.paramsOption?.symbol]);

  return (
    <ModalBody
      modalBodyType="bottom"
      leftTitleDom={
        <TitleInfoSection viewStyle={{ paddingLeft: pTd(16) }} dappInfo={dappInfo} title="Approve transaction" />
      }
      onClose={onReject}>
      <View style={[styles.contentWrap]}>
        <ScrollView contentContainerStyle={GStyles.paddingBottom(106)}>
          {showSymbolAmountUI}
          {transferContent}
          {rememberMeUI}
        </ScrollView>
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList}>
        <TextL style={[styles.bottomText, GStyles.alignCenter]}>{t('Only approve if you trust this website')}</TextL>
      </OverlayBottomSection>
    </ModalBody>
  );
};

export const showTransactionModal = (props: TransactionModalPropsType) => {
  OverlayModal.show(<TransactionModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

export default {
  showTransactionModal,
};
