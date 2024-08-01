import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import From from '../From';
import To from '../To';
import { otherChainWarningStyle, styles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getAelfAddress, getEntireDIDAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import SelectContact from '../SelectContact';
import AmountToken from '../AmountToken';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import CommonButton from 'components/CommonButton';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import {
  CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL,
  useCrossTransferByEtransfer,
} from '@portkey-wallet/hooks/hooks-ca/useWithdrawByETransfer';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { IToSendHomeParamsType, IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';

import { getELFChainBalance } from '@portkey-wallet/utils/balance';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { RouteProp, useRoute } from '@react-navigation/native';
import Loading from 'components/Loading';
import { useFetchTxFee, useGetTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';

import {
  TransactionError,
  TransactionErrorArray,
  AddressError,
  AddressErrorArray,
  CROSS_CHAIN_INTERCEPTED_CONTENT,
} from '@portkey-wallet/constants/constants-ca/send';
import { getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import CommonToast from 'components/CommonToast';
import Touchable from 'components/Touchable';
import { useGetCAContract, useGetTokenViewContract } from 'hooks/contract';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferFee } from 'hooks/transfer';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppETransShow } from 'hooks/cms';
import { usePin } from 'hooks/store';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { checkIsValidEtransferAddress } from '@portkey-wallet/utils/check';
import { RichText } from 'components/RichText';
import { DepositModalMap, useOnDisclaimerModalPress } from 'hooks/deposit';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useEtransferFee } from 'hooks/etransfer';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { getAssetsEstimation } from '@portkey-wallet/store/store-ca/assets/api';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';

const SendHome: React.FC = () => {
  const {
    params: { sendType = 'token', toInfo, assetInfo, imTransferInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();
  const { t } = useLanguage();
  useFetchTxFee();
  const isValidChainId = useIsValidSuffix();
  const defaultToken = useDefaultToken();

  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain(assetInfo?.chainId);
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const isFixedToContact = useMemo(() => !!imTransferInfo?.channelId, [imTransferInfo?.channelId]);
  const { max: maxFee, crossChain: crossFee } = useGetTxFee(assetInfo?.chainId);
  const { getEtransferMaxFee } = useEtransferFee(assetInfo?.chainId);

  const pin = usePin();
  const crossTransferByEtransfer = useCrossTransferByEtransfer(pin);

  const isSupportCross = useMemo(
    () => CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(assetInfo.symbol),
    [assetInfo.symbol],
  );

  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [balance, setBalance] = useState<string>(assetInfo?.balance || '');

  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [maxAmountSend, setMaxAmountSend] = useState<string>('0');

  const [step, setStep] = useState<1 | 2>(isFixedToContact ? 2 : 1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  const checkManagerSyncState = useCheckManagerSyncState();
  const getCAContract = useGetCAContract();
  const { isETransDepositShow } = useAppETransShow();
  const onDisclaimerModalPress = useOnDisclaimerModalPress();
  const { eTransferUrl = '' } = useCurrentNetworkInfo();

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

  // get transfer fee
  const getTransferFee = useGetTransferFee();
  const getTransactionFee = useCallback(
    async (isCross: boolean, sendAmount?: string) => {
      if (!chainInfo) return;
      const caContract = await getCAContract(chainInfo.chainId);
      return getTransferFee({
        isCross,
        sendAmount: sendAmount ?? debounceSendNumber,
        decimals: assetInfo.decimals,
        symbol: assetInfo.symbol,
        caContract,
        tokenContractAddress: assetInfo.tokenContractAddress,
        toAddress: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
        chainId: assetInfo.chainId,
      });
    },
    [
      chainInfo,
      getTransferFee,
      debounceSendNumber,
      assetInfo.decimals,
      assetInfo.symbol,
      assetInfo.tokenContractAddress,
      assetInfo.chainId,
      selectedToContact.address,
      getCAContract,
    ],
  );

  const onGetMaxAmount = useLockCallback(async () => {
    if (!balance) return setMaxAmountSend('0');

    const balanceBN = divDecimals(balance, assetInfo.decimals);
    const balanceStr = balanceBN.toString();

    // balance 0
    if (divDecimals(balance, assetInfo.decimals).isEqualTo(0)) return setMaxAmountSend('0');

    // if other tokens
    if (assetInfo.symbol !== defaultToken.symbol)
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toString());

    // elf <= maxFee
    if (divDecimals(balance, assetInfo.decimals).isLessThanOrEqualTo(maxFee))
      return setMaxAmountSend(divDecimals(balance, assetInfo.decimals || '0').toString());

    const isCross = isCrossChain(selectedToContact.address, assetInfo.chainId || 'AELF');
    let fee;
    try {
      fee = await getTransactionFee(isCross, divDecimals(balance, assetInfo.decimals).toFixed());
    } catch (error) {
      fee = '0';
      console.log('FEE ERROR');
    }
    const etransferFee = await getEtransferMaxFee({ amount: balanceStr, toInfo, tokenInfo: assetInfo });

    if (fee) {
      setMaxAmountSend(balanceBN.minus(etransferFee).toString());
    } else {
      setMaxAmountSend(
        ZERO.plus(divDecimals(balance, assetInfo.decimals)).minus(maxFee).minus(etransferFee).toString(),
      );
    }
  }, [
    balance,
    assetInfo,
    defaultToken.symbol,
    maxFee,
    getTransactionFee,
    getEtransferMaxFee,
    toInfo,
    selectedToContact.address,
  ]);

  const onPressMax = useCallback(async () => {
    try {
      Loading.hide();
      // check is SYNCHRONIZING
      const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
      if (!_isManagerSynced) return setErrorMessage([TransactionError.SYNCHRONIZING]);
      setSendNumber(maxAmountSend);
      setErrorMessage([]);
    } catch (err) {
      console.log('max err!!', err);
    } finally {
      Loading.hide();
    }
  }, [checkManagerSyncState, chainInfo?.chainId, maxAmountSend]);

  const getTokenViewContract = useGetTokenViewContract();
  const initBalance = useCallback(async () => {
    const caAddress = wallet?.[assetInfo.chainId]?.caAddress;
    if (!assetInfo || !caAddress) return;
    try {
      const tokenContract = await getTokenViewContract(assetInfo.chainId);
      const _balance = await getELFChainBalance(tokenContract, assetInfo.symbol, caAddress);
      setBalance(_balance);
    } catch (error) {
      console.log('initBalance', error);
    }
  }, [assetInfo, getTokenViewContract, wallet]);

  useEffectOnce(() => {
    initBalance();
  });

  const enableEtransfer = useMemo(() => {
    const { symbol, chainId } = assetInfo;
    const { withdraw } = checkEnabledFunctionalTypes(symbol, chainId === MAIN_CHAIN_ID);
    return isETransDepositShow && withdraw;
  }, [assetInfo, isETransDepositShow]);

  const isValidOtherChainAddress = useMemo(() => {
    const { address } = selectedToContact || {};
    return (
      checkIsValidEtransferAddress(address) &&
      !(isDIDAelfAddress(address) && isValidChainId(getAddressChainId(selectedToContact.address, assetInfo.chainId)))
    );
  }, [assetInfo.chainId, isValidChainId, selectedToContact]);

  // warning dialog
  const showDialog = useCallback(
    (type: 'clearAddress' | 'crossChain' | 'exchange' | 'crossChainInterception', confirmCallBack?: () => void) => {
      switch (type) {
        case 'clearAddress':
          ActionSheet.alert({
            title: t('Clear Address First'),
            message: t('Only after clearing the receiving address can the new address be scanned'),
            buttons: [
              {
                title: t('Close'),
                type: 'solid',
              },
            ],
          });

          break;

        case 'crossChain':
          ActionSheet.alert({
            title: t('This is a cross-chain transaction'),
            buttons: [
              {
                title: t('Cancel'),
                type: 'outline',
              },
              {
                title: t('Confirm'),
                type: 'primary',
                onPress: () => {
                  confirmCallBack?.();
                },
              },
            ],
          });
          break;

        case 'exchange':
          ActionSheet.alert({
            title: t('Send to exchange account?'),
            message: t(
              "Please note that assets on the SideChain can't be sent directly to exchanges. You can transfer your SideChain assets to the MainChain before sending them to your exchange account.",
            ),
            buttons: [
              {
                title: t('Got it'),
                type: 'primary',
              },
            ],
          });
          break;
        case 'crossChainInterception':
          ActionSheet.alert({
            title: t('Notice'),
            message: <TextM style={styles.alertMessage}>{t(CROSS_CHAIN_INTERCEPTED_CONTENT)}</TextM>,
            buttons: [
              {
                title: t('Got it'),
                type: 'primary',
              },
            ],
          });
          break;
        default:
          break;
      }
    },
    [t],
  );

  const nextDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    if (isValidOtherChainAddress && enableEtransfer) {
      setErrorMessage([]);
      return true;
    }
    return false;
  }, [enableEtransfer, isValidOtherChainAddress, selectedToContact?.address]);

  const previewDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    if (sendNumber === '0' || !sendNumber) return true;
    return false;
  }, [selectedToContact?.address, sendNumber]);

  const checkCanNext = useCallback(() => {
    const suffix = getAddressChainId(selectedToContact.address, chainInfo?.chainId || 'AELF');
    if (
      isSameAddresses(wallet?.[assetInfo?.chainId]?.caAddress || '', getAelfAddress(selectedToContact.address)) &&
      suffix === assetInfo?.chainId
    ) {
      setErrorMessage([AddressError.SAME_ADDRESS]);
      return false;
    }

    if (!isValidChainId(getAddressChainId(selectedToContact.address, assetInfo.chainId))) {
      setErrorMessage([AddressError.INVALID_ADDRESS]);
      return false;
    }

    if (isCrossChain(selectedToContact.address, assetInfo.chainId)) {
      showDialog('crossChain', () => {
        setErrorMessage([]);
        setStep(2);
      });
      return false;
    }

    if (!isDIDAelfAddress(selectedToContact.address)) {
      if (enableEtransfer && checkIsValidEtransferAddress(selectedToContact.address)) {
        setErrorMessage([]);
      } else {
        setErrorMessage([AddressError.INVALID_ADDRESS]);
      }
      return false;
    }

    return true;
  }, [
    selectedToContact.address,
    chainInfo?.chainId,
    wallet,
    assetInfo.chainId,
    isValidChainId,
    showDialog,
    enableEtransfer,
  ]);

  const nextStep = useCallback(() => {
    if (checkCanNext()) {
      setErrorMessage([]);
      return setStep(2);
    }
  }, [checkCanNext]);

  const ensureKeyboardClosed = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  //when finish send  upDate balance
  const previewParamsWithoutFee = useMemo(
    () =>
      ({
        sendType,
        assetInfo,
        toInfo: {
          ...selectedToContact,
          address: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
        },
        transactionFee: '0',
        sendNumber,
      } as IToSendPreviewParamsType),
    [assetInfo, selectedToContact, sendNumber, sendType],
  );

  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();
  const checkCanPreview = useCallback(async () => {
    setErrorMessage([]);

    if (!chainInfo) {
      return { status: false };
    }

    const assetBalanceBigNumber = ZERO.plus(balance);
    const isCross = isCrossChain(selectedToContact.address, assetInfo.chainId);
    const sendBigNumber = timesDecimals(sendNumber, assetInfo.decimals || '0');
    // input check
    if (sendType === 'token') {
      // token
      if (assetInfo.symbol === defaultToken.symbol) {
        // ELF
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage([TransactionError.TOKEN_NOT_ENOUGH]);
          return { status: false };
        }

        if (isCross && sendBigNumber.isLessThanOrEqualTo(timesDecimals(crossFee, defaultToken.decimals))) {
          setErrorMessage([TransactionError.CROSS_NOT_ENOUGH]);
          return { status: false };
        }
      } else {
        // nft
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage([TransactionError.TOKEN_NOT_ENOUGH]);
          return { status: false };
        }
      }
    } else {
      // nft
      if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
        setErrorMessage([TransactionError.NFT_NOT_ENOUGH]);
        return { status: false };
      }
    }
    Loading.show();
    try {
      // cross chain interception
      if (isCrossChain(selectedToContact.address, assetInfo.chainId)) {
        const sendChainId = selectedToContact.chainId || (getChainIdByAddress(selectedToContact.address) as ChainId);
        const interceptResult = await getAssetsEstimation({
          symbol: assetInfo.symbol,
          chainId: sendChainId,
          type: sendType,
        });
        if (!interceptResult) {
          showDialog('crossChainInterception');
          return;
        }
      }
      // check is security safe
      const securitySafeResult = await securitySafeCheckAndToast(assetInfo.chainId);
      if (!securitySafeResult) {
        return { status: false };
      }
    } catch (err) {
      CommonToast.failError(err);
      return { status: false };
    } finally {
      Loading.hide();
    }

    // checkTransferLimitResult

    let caContract: ContractBasic;
    try {
      caContract = await getCAContract(chainInfo.chainId);
    } catch (error) {
      Loading.hide();
      return { status: false };
    }

    try {
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract,
        symbol: assetInfo.symbol,
        decimals: assetInfo.decimals,
        amount: sendNumber,
        balance: balance,
        chainId: chainInfo.chainId,
        approveMultiLevelParams: {
          sendTransferPreviewApprove: {
            successNavigateName: 'SendPreview',
            params: previewParamsWithoutFee,
          },
        },
      });
      console.log('checkTransferLimitResult', checkTransferLimitResult);
      if (!checkTransferLimitResult) {
        Loading.hide();
        return { status: false };
      }
    } catch (error) {
      CommonToast.failError(error);
      Loading.hide();
      return { status: false };
    }

    // check is SYNCHRONIZING
    const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
    if (!_isManagerSynced) {
      Loading.hide();
      setErrorMessage([TransactionError.SYNCHRONIZING]);
      return { status: false };
    }

    // transaction fee check
    let fee;
    let receiveAmount: string | undefined;
    let receiveAmountUsd: string | undefined;
    let transactionFee: string | undefined;
    let transactionUnit: string | undefined;
    let isEtransferCrossInLimit = false;
    try {
      if (isCross && isSupportCross) {
        const { withdrawInfo } = await crossTransferByEtransfer.withdrawPreview({
          symbol: assetInfo.symbol,
          address: selectedToContact.address,
          chainId: assetInfo.chainId,
          amount: sendNumber,
        });
        fee = withdrawInfo?.aelfTransactionFee;
        const maxAmount = Number(withdrawInfo?.maxAmount);
        const minAmount = Number(withdrawInfo?.minAmount);
        transactionFee = withdrawInfo.transactionFee;
        transactionUnit = withdrawInfo.transactionUnit;
        isEtransferCrossInLimit = Number(sendNumber) >= minAmount && Number(sendNumber) <= maxAmount;
        if (isEtransferCrossInLimit) {
          receiveAmount = withdrawInfo?.receiveAmount;
          receiveAmountUsd = withdrawInfo?.receiveAmountUsd;
        } else {
          fee = await getTransactionFee(isCross);
        }
      } else {
        fee = await getTransactionFee(isCross);
      }
      console.log('fee', fee);
    } catch (err: any) {
      if (err?.code === 500) {
        setErrorMessage([TransactionError.FEE_NOT_ENOUGH]);
        Loading.hide();
        return { status: false };
      }
    } finally {
      Loading.hide();
    }

    return {
      status: true,
      fee,
      receiveAmount,
      receiveAmountUsd,
      isEtransferCrossInLimit,
      transactionFee,
      transactionUnit,
    };
  }, [
    chainInfo,
    balance,
    selectedToContact.address,
    selectedToContact.chainId,
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    sendNumber,
    sendType,
    checkManagerSyncState,
    defaultToken.symbol,
    defaultToken.decimals,
    crossFee,
    securitySafeCheckAndToast,
    getCAContract,
    checkTransferLimitWithJump,
    previewParamsWithoutFee,
    isSupportCross,
    crossTransferByEtransfer,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    const result = await checkCanPreview();
    if (!result?.status) return;

    navigationService.navigate('SendPreview', {
      ...previewParamsWithoutFee,
      transactionFee: result?.fee || '0',
      receiveAmount: result?.receiveAmount,
      receiveAmountUsd: result?.receiveAmountUsd,
      isEtransferCrossInLimit: result?.isEtransferCrossInLimit,
      crossChainFee: result?.transactionFee || crossFee,
      crossChainFeeUnit: result?.transactionUnit || '',
    });
  }, [checkCanPreview, crossFee, previewParamsWithoutFee]);

  const ButtonUI = useMemo(() => {
    return (
      <View style={[styles.buttonWrapStyle, step === 1 && BGStyles.bg1]}>
        {step === 2 && (
          <CommonButton
            disabled={previewDisable}
            loading={isLoading}
            title={t('Preview')}
            type="primary"
            onPress={preview}
          />
        )}
        {step === 1 && (
          <CommonButton
            loading={isLoading}
            disabled={nextDisable}
            title={t('Next')}
            type="primary"
            onPress={nextStep}
          />
        )}
      </View>
    );
  }, [isLoading, nextDisable, nextStep, preview, previewDisable, step, t]);

  const WarningUI = useMemo(() => {
    if (enableEtransfer && isValidOtherChainAddress) {
      return (
        <View style={[otherChainWarningStyle.wrap, otherChainWarningStyle.flex]}>
          <Svg icon="warning" size={pTd(16)} iconStyle={otherChainWarningStyle.icon} />
          <RichText
            text={AddressError.OTHER_CHAIN_ADDRESS}
            commonTextStyle={otherChainWarningStyle.commonText}
            links={[
              {
                linkSyntax: 'ETransfer',
                linkStyle: otherChainWarningStyle.linkText,
                linkPress: () => {
                  ensureKeyboardClosed();
                  if (!eTransferUrl) return;
                  onDisclaimerModalPress(
                    DepositModalMap.eTransfer,
                    stringifyETrans({
                      url: eTransferUrl,
                      query: {
                        tokenSymbol: assetInfo?.symbol,
                        type: 'Withdraw',
                        chainId: assetInfo?.chainId,
                        withdrawAddress: selectedToContact.address,
                      },
                    }),
                  );
                },
              },
            ]}
            wrapperStyle={otherChainWarningStyle.text}
            textDivider={'$'}
          />
        </View>
      );
    } else if (assetInfo?.chainId !== MAIN_CHAIN_ID) {
      return (
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter, styles.warningWrap]}
          onPress={() => showDialog('exchange')}>
          <Svg icon="warning1" size={pTd(16)} />
          <TextM style={[GStyles.marginLeft(pTd(8)), GStyles.flex1, FontStyles.font3]}>Send to exchange account?</TextM>
          <Svg icon="down-arrow" size={pTd(16)} />
        </Touchable>
      );
    } else {
      return null;
    }
  }, [
    assetInfo?.chainId,
    assetInfo?.symbol,
    eTransferUrl,
    enableEtransfer,
    ensureKeyboardClosed,
    isValidOtherChainAddress,
    onDisclaimerModalPress,
    selectedToContact.address,
    showDialog,
  ]);

  useEffect(() => {
    onGetMaxAmount();
  }, [onGetMaxAmount]);

  return (
    <PageContainer
      safeAreaColor={['white']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + (assetInfo.label || assetInfo.symbol) : ''}`}
      rightDom={
        sendType === 'token' && !isFixedToContact ? (
          <Touchable
            onPress={async () => {
              if (selectedToContact?.address) return showDialog('clearAddress');
              if (!(await qrScanPermissionAndToast())) return;
              navigationService.navigate('QrScanner', { fromSendPage: true });
            }}>
            <Svg icon="scan" size={pTd(17.5)} color={defaultColors.font2} iconStyle={styles.iconStyle} />
          </Touchable>
        ) : undefined
      }
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {/* Group 1 */}
      <View style={styles.group}>
        <From />
        <To
          isFixedToContact={isFixedToContact}
          step={step}
          setStep={setStep}
          setErrorMessage={setErrorMessage}
          selectedToContact={selectedToContact}
          setSelectedToContact={setSelectedToContact}
        />
      </View>
      {AddressErrorArray.filter(ele => errorMessage.includes(ele)).map(err => (
        <Text key={err} style={[styles.errorMessage]}>
          {t(err)}
        </Text>
      ))}

      {WarningUI}

      {/* Group 2 token */}
      {sendType === 'token' && step === 2 && (
        <View style={styles.group}>
          <AmountToken
            onPressMax={onPressMax}
            balanceShow={balance}
            sendTokenNumber={sendNumber}
            setSendTokenNumber={setSendNumber}
            selectedToken={assetInfo}
            selectedAccount={selectedFromAccount}
          />
        </View>
      )}

      {/* Group 2 nft */}
      {sendType === 'nft' && step === 2 && (
        <>
          <View style={styles.group}>
            <NFTInfo nftItem={assetInfo} />
          </View>
          <View style={styles.group}>
            <AmountNFT sendNumber={sendNumber} setSendNumber={setSendNumber} assetInfo={assetInfo} />
          </View>
        </>
      )}

      {TransactionErrorArray.filter(ele => errorMessage.includes(ele)).map(err => (
        <Text
          key={err}
          style={[
            styles.errorMessage,
            sendType === 'nft' && styles.nftErrorMessage,
            err === TransactionError.SYNCHRONIZING && styles.warnMessage,
          ]}>
          {t(err)}
        </Text>
      ))}

      {/* Group 3 contact */}
      <View style={styles.space} />
      {step === 1 && (
        <SelectContact
          chainId={assetInfo.chainId}
          onPress={(item: { address: string; name: string }) => {
            setSelectedToContact(item);
          }}
        />
      )}

      {ButtonUI}
    </PageContainer>
  );
};

export default memo(SendHome);
