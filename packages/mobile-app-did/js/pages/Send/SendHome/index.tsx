import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import From from '../From';
import To from '../To';
import { styles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { ZERO } from '@portkey-wallet/constants/misc';
import { getAelfAddress, getEntireDIDAelfAddress, isAllowAelfAddress, isCrossChain } from '@portkey-wallet/utils/aelf';
import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import SelectContact from '../SelectContact';
import AmountToken from '../AmountToken';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import CommonButton from 'components/CommonButton';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
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
} from '@portkey-wallet/constants/constants-ca/send';
import { getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import CommonToast from 'components/CommonToast';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useGetCAContract, useGetTokenViewContract } from 'hooks/contract';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useGetTransferFee } from 'hooks/transfer';

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

  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [balance, setBalance] = useState<string>(assetInfo?.balance || '');

  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [, setTransactionFee] = useState<string>('0'); // like 1.2ELF

  const [step, setStep] = useState<1 | 2>(isFixedToContact ? 2 : 1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  const checkManagerSyncState = useCheckManagerSyncState();
  const contractRef = useRef<ContractBasic>();
  const getCAContract = useGetCAContract();

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

  // get transfer fee
  const getTransferFee = useGetTransferFee();
  const getTransactionFee = useCallback(
    async (isCross: boolean, sendAmount?: string) => {
      if (!chainInfo) return;
      if (!contractRef.current) {
        try {
          contractRef.current = await getCAContract(chainInfo.chainId);
        } catch (error) {
          return;
        }
      }

      return getTransferFee({
        isCross,
        sendAmount: sendAmount ?? debounceSendNumber,
        decimals: assetInfo.decimals,
        symbol: assetInfo.symbol,
        caContract: contractRef.current,
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

  const onPressMax = useCallback(async () => {
    Loading.show();
    try {
      // check is SYNCHRONIZING
      const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
      if (!_isManagerSynced) return setErrorMessage([TransactionError.SYNCHRONIZING]);

      // balance 0
      if (divDecimals(balance, assetInfo.decimals).isEqualTo(0)) return setSendNumber('0');

      // other tokens
      if (assetInfo.symbol !== defaultToken.symbol)
        return setSendNumber(divDecimals(balance, assetInfo.decimals || '0').toString());

      // elf <= maxFee
      if (divDecimals(balance, assetInfo.decimals).isLessThanOrEqualTo(maxFee))
        return setSendNumber(divDecimals(balance, assetInfo.decimals || '0').toString());

      const isCross = isCrossChain(assetInfo.chainId, selectedToContact.chainId || 'AELF');
      const fee = await getTransactionFee(isCross, divDecimals(balance, assetInfo.decimals).toFixed());
      setTransactionFee(fee || '0');
      setSendNumber(
        divDecimals(balance, assetInfo.decimals || '0')
          .minus(fee || '0')
          .toFixed(),
      );
    } catch (err: any) {
      if (err?.code === 500) {
        setTransactionFee(String(maxFee));
        const selectedAssetsNum = divDecimals(balance, assetInfo.decimals || '0');
        setSendNumber(selectedAssetsNum.minus(maxFee).toFixed());
      }
    } finally {
      Loading.hide();
    }
  }, [
    checkManagerSyncState,
    chainInfo?.chainId,
    balance,
    assetInfo.decimals,
    assetInfo.symbol,
    assetInfo.chainId,
    defaultToken.symbol,
    maxFee,
    selectedToContact.chainId,
    getTransactionFee,
  ]);

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

  // warning dialog
  const showDialog = useCallback(
    (type: 'clearAddress' | 'crossChain' | 'exchange', confirmCallBack?: () => void) => {
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

        default:
          break;
      }
    },
    [t],
  );

  const nextDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    return false;
  }, [selectedToContact.address]);

  const previewDisable = useMemo(() => {
    if (!selectedToContact?.address) return true;
    if (sendNumber === '0' || !sendNumber) return true;
    return false;
  }, [selectedToContact?.address, sendNumber]);

  const checkCanNext = useCallback(() => {
    const suffix = getAddressChainId(selectedToContact.address, chainInfo?.chainId || 'AELF');

    if (!isAllowAelfAddress(selectedToContact.address)) {
      setErrorMessage([AddressError.INVALID_ADDRESS]);
      return false;
    }

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

    return true;
  }, [chainInfo?.chainId, selectedToContact.address, wallet, assetInfo?.chainId, isValidChainId, showDialog]);

  const nextStep = useCallback(() => {
    if (checkCanNext()) {
      setErrorMessage([]);
      return setStep(2);
    }
  }, [checkCanNext]);

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
    // check is security safe
    try {
      const securitySafeResult = await securitySafeCheckAndToast(assetInfo.chainId);
      if (!securitySafeResult) {
        Loading.hide();
        return { status: false };
      }
    } catch (err) {
      CommonToast.failError(err);
      Loading.hide();
    }

    // checkTransferLimitResult
    if (!contractRef.current) {
      try {
        contractRef.current = await getCAContract(chainInfo.chainId);
      } catch (error) {
        return { status: false };
      }
    }

    try {
      const contract = contractRef.current;
      const checkTransferLimitResult = await checkTransferLimitWithJump({
        caContract: contract,
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
    try {
      fee = await getTransactionFee(isCross);
      console.log('fee', fee);
      setTransactionFee(fee || '0');
    } catch (err: any) {
      if (err?.code === 500) {
        setErrorMessage([TransactionError.FEE_NOT_ENOUGH]);
        Loading.hide();
        return { status: false };
      }
    } finally {
      Loading.hide();
    }

    return { status: true, fee };
  }, [
    chainInfo,
    checkManagerSyncState,
    sendNumber,
    assetInfo.decimals,
    assetInfo.chainId,
    assetInfo.symbol,
    balance,
    selectedToContact.address,
    sendType,
    securitySafeCheckAndToast,
    getCAContract,
    checkTransferLimitWithJump,
    previewParamsWithoutFee,
    defaultToken.symbol,
    defaultToken.decimals,
    crossFee,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    const result = await checkCanPreview();
    if (!result?.status) return;

    navigationService.navigate('SendPreview', {
      ...previewParamsWithoutFee,
      transactionFee: result?.fee || '0',
    });
  }, [checkCanPreview, previewParamsWithoutFee]);

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
            onPress={() => nextStep()}
          />
        )}
      </View>
    );
  }, [isLoading, nextDisable, nextStep, preview, previewDisable, step, t]);

  return (
    <PageContainer
      safeAreaColor={['blue', step === 1 ? 'white' : 'gray']}
      titleDom={`${t('Send')}${sendType === 'token' ? ' ' + assetInfo.symbol : ''}`}
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

      {assetInfo?.chainId !== MAIN_CHAIN_ID && (
        <Touchable
          style={[GStyles.flexRow, GStyles.itemCenter, styles.warningWrap]}
          onPress={() => showDialog('exchange')}>
          <Svg icon="warning1" size={pTd(16)} />
          <TextM style={[GStyles.marginLeft(pTd(8)), GStyles.flex1, FontStyles.font3]}>Send to exchange account?</TextM>
          <Svg icon="down-arrow" size={pTd(16)} />
        </Touchable>
      )}

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
