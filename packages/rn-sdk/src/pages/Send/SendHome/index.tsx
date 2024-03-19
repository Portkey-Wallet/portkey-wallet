import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import CommonSvg from 'components/Svg';
import From from '../From';
import To from '../To';
import { styles } from './style';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import ActionSheet from 'components/ActionSheet';

import useDebounce from 'hooks/useDebounce';
import { useLanguage } from 'i18n/hooks';
import SelectContact from '../SelectContact';
import AmountToken from '../AmountToken';
import AmountNFT from '../AmountNFT';
import NFTInfo from '../NFTInfo';
import CommonButton from 'components/CommonButton';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';

import CommonToast from 'components/CommonToast';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { TransactionError } from '@portkey-wallet/constants/constants-ca/assets';
import { AddressError, AddressErrorArray, TransactionErrorArray } from '@portkey-wallet/constants/constants-ca/send';
import { ZERO } from '@portkey-wallet/constants/misc';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
import { getEntireDIDAelfAddress, isCrossChain, isAllowAelfAddress, getAelfAddress } from '@portkey-wallet/utils/aelf';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { useChainsNetworkInfo } from 'model/hooks/network';
import { useCommonNetworkInfo } from 'components/TokenOverlay/hooks';
import { useTransactionFee } from 'model/hooks/transaction';
import { useQrScanPermissionAndToast } from 'model/hooks/device';
import { checkManagerSyncState, useGetTransferFee } from 'model/contract/handler';
import { useUnlockedWallet } from 'model/wallet';
import { useSecuritySafeCheckAndToast, useCheckTransferLimitWithJump } from 'components/WalletSecurityAccelerate/hook';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { ScanQRCodeProps, ScanQRCodeResult } from 'pages/QrScanner';
import { isArray } from 'lodash';

const SendHome = (props: IToSendHomeParamsType) => {
  const {
    sendType = 'token',
    toInfo = {
      name: '',
      address: '',
    },
    assetInfo,
  } = props;
  const { t } = useLanguage();

  const { chainsNetworkInfo } = useChainsNetworkInfo();
  const isValidChainId = useCallback(
    (chainId: string) => {
      return !!chainsNetworkInfo[chainId];
    },
    [chainsNetworkInfo],
  );
  const isValidAddress = useCallback((address: string) => {
    return isAllowAelfAddress(address);
  }, []);

  const { wallet: unlockedWallet } = useUnlockedWallet({ getMultiCaAddresses: true });
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();

  const fromChainId = useMemo(() => {
    return assetInfo?.chainId || 'AELF';
  }, [assetInfo?.chainId]);
  const currentNetworkInfo = useCommonNetworkInfo(fromChainId);
  const transactionFees = useTransactionFee(fromChainId);
  const { max: maxFee, crossChain: crossFee } = useMemo(() => {
    const chainId = assetInfo?.chainId || 'AELF';
    return transactionFees.find(ele => ele.chainId === chainId)?.transactionFee || { max: '0.00', crossChain: '0.00' };
  }, [assetInfo?.chainId, transactionFees]);

  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [balance, setBalance] = useState<string>(assetInfo?.balance || '');

  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [, setTransactionFee] = useState<string>('0'); // like 1.2ELF
  const { navigateTo, navigateForResult } = useBaseContainer({ entryName: PortkeyEntries.SEND_TOKEN_HOME_ENTRY });

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);
  const getTransferFee = useGetTransferFee();

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

  // get transfer fee
  const getTransactionFee = useCallback(
    async (isCross: boolean, sendAmount?: string) => {
      return getTransferFee({
        isCross,
        sendAmount: sendAmount ?? debounceSendNumber,
        decimals: assetInfo.decimals,
        symbol: assetInfo.symbol,
        tokenContractAddress: assetInfo.tokenContractAddress,
        toAddress: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
        chainId: fromChainId,
      });
    },
    [
      getTransferFee,
      debounceSendNumber,
      assetInfo.decimals,
      assetInfo.symbol,
      assetInfo.tokenContractAddress,
      assetInfo.chainId,
      selectedToContact.address,
      fromChainId,
    ],
  );

  const onPressMax = useCallback(async () => {
    Loading.show();
    try {
      // check is SYNCHRONIZING
      const _isManagerSynced = await checkManagerSyncState(assetInfo?.chainId || 'AELF');
      if (!_isManagerSynced) return setErrorMessage([TransactionError.SYNCHRONIZING]);

      // balance 0
      if (divDecimals(balance, assetInfo.decimals).isEqualTo(0)) return setSendNumber('0');

      // other tokens
      if (assetInfo.symbol !== currentNetworkInfo.defaultToken.symbol)
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
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    balance,
    currentNetworkInfo.defaultToken.symbol,
    maxFee,
    selectedToContact.chainId,
    getTransactionFee,
  ]);

  const initBalance = useCallback(async () => {
    // TODO: the result is incorrect, emmmmm.....
    // const {
    //   caInfo: { caAddress },
    // } = await getUnlockedWallet();
    // if (!assetInfo || !caAddress) return;
    // try {
    //   const tokenContract = await getTokenContract(fromChainId);
    //   const _balance = await getELFChainBalance(tokenContract, assetInfo.symbol, caAddress);
    //   setBalance(_balance);
    // } catch (error) {
    //   console.log('initBalance', error);
    // }
    setBalance(assetInfo?.balance || '0');
  }, [assetInfo]);

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
    const suffix = getAddressChainId(selectedToContact.address, fromChainId || 'AELF');
    if (!unlockedWallet) return false;
    const { multiCaAddresses } = unlockedWallet;

    if (!isAllowAelfAddress(selectedToContact.address)) {
      setErrorMessage([AddressError.INVALID_ADDRESS]);
      return false;
    }

    if (
      isSameAddresses(multiCaAddresses[fromChainId] || '', getAelfAddress(selectedToContact.address)) &&
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
      // TODO: check if  cross chain
      showDialog('crossChain', () => {
        setErrorMessage([]);
        setStep(2);
      });
      return false;
    }

    return true;
  }, [selectedToContact.address, fromChainId, unlockedWallet, assetInfo.chainId, isValidChainId, showDialog]);

  const nextStep = useCallback(() => {
    if (checkCanNext()) {
      setErrorMessage([]);
      return setStep(2);
    }
  }, [checkCanNext]);

  const dealWithQRCode = useCallback(
    (result: string) => {
      const invalidQRCode = (text = 'Invalid QR code') => {
        CommonToast.fail(t(text));
      };
      if (!result) return invalidQRCode();
      let parseResult: Array<string> = [];
      try {
        parseResult = JSON.parse(result);
      } catch (e) {
        return invalidQRCode();
      }
      if (!isArray(parseResult) || parseResult.length !== 9) return invalidQRCode();
      // example: ["aelf","TESTNET","send","ELF_2YdkMPsjGdt2jC6ApptUQvG31WYCAtVpjgB4dM17R2edswSeAm_AELF","ELF","JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE","AELF",8,null]
      const [, , , address, , , chainId] = parseResult;
      if (!isValidAddress(address)) {
        return invalidQRCode('Invalid address');
      }
      if (!isValidChainId(chainId)) {
        return invalidQRCode('Invalid chainId');
      }
      setSelectedToContact({ address, name: '' });
    },
    [isValidAddress, isValidChainId, t],
  );

  // notice: since current code remove the use of previewParamsWithoutFee, it is now commented out
  // const previewParamsWithoutFee = useMemo(
  //   () =>
  //     ({
  //       sendType,
  //       assetInfo,
  //       toInfo: {
  //         ...selectedToContact,
  //         address: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
  //       },
  //       transactionFee: '0',
  //       sendNumber,
  //     } as IToSendPreviewParamsType),
  //   [assetInfo, selectedToContact, sendNumber, sendType],
  // );

  const checkCanPreview = useCallback(async () => {
    setErrorMessage([]);

    if (!currentNetworkInfo) {
      return { status: false };
    }
    const { defaultToken } = currentNetworkInfo;

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

    try {
      const checkTransferLimitResult = await checkTransferLimitWithJump(
        {
          symbol: assetInfo.symbol,
          decimals: assetInfo.decimals,
          amount: sendNumber,
          chainId: fromChainId,
        },
        fromChainId,
      );
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
    const _isManagerSynced = await checkManagerSyncState(fromChainId || 'AELF');
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
      console.error('getTransactionFee', err);
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
    currentNetworkInfo,
    balance,
    selectedToContact.address,
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    sendNumber,
    sendType,
    fromChainId,
    crossFee,
    securitySafeCheckAndToast,
    checkTransferLimitWithJump,
    getTransactionFee,
  ]);

  const preview = useCallback(async () => {
    // TODO : getTransactionFee and check the balance
    const result = await checkCanPreview();
    if (!result?.status) return;
    navigateTo(PortkeyEntries.SEND_TOKEN_CONFIRM_ENTRY, {
      params: {
        sendType,
        assetInfo,
        toInfo: {
          ...selectedToContact,
          address: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
        },
        transactionFee: result?.fee || '0',
        sendNumber,
      },
    });
  }, [assetInfo, checkCanPreview, navigateTo, selectedToContact, sendNumber, sendType]);

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
        sendType === 'token' ? (
          <TouchableOpacity
            onPress={async () => {
              if (selectedToContact?.address) return showDialog('clearAddress');
              if (!(await qrScanPermissionAndToast())) return;
              navigateForResult<ScanQRCodeResult, ScanQRCodeProps>(
                PortkeyEntries.SCAN_QR_CODE,
                {
                  params: { useScanQRPath: true },
                },
                result => {
                  console.log('scan qr code result', result);
                  const { data } = result;
                  const uri = data?.uri;
                  if (!uri) {
                    CommonToast.fail(t('Invalid QR code'));
                    return;
                  }
                  dealWithQRCode(uri);
                },
              );
            }}>
            <CommonSvg icon="scan" size={pTd(17.5)} color={defaultColors.font2} iconStyle={styles.iconStyle} />
          </TouchableOpacity>
        ) : undefined
      }
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {/* Group 1 */}
      <View style={styles.group}>
        <From />
        <To
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
          <CommonSvg icon="warning1" size={pTd(16)} />
          <TextM style={[GStyles.marginLeft(pTd(8)), GStyles.flex1, FontStyles.font3]}>Send to exchange account?</TextM>
          <CommonSvg icon="down-arrow" size={pTd(16)} />
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
            <AmountNFT sendNumber={sendNumber} setSendNumber={setSendNumber} />
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
