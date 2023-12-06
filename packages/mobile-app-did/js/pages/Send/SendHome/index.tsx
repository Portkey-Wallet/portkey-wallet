import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain, useDefaultToken, useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount, isMyPayTransactionFee } from 'utils/redux';
import { usePin } from 'hooks/store';
import { divDecimals, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { IToSendHomeParamsType, IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import BigNumber from 'bignumber.js';

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
import { request } from '@portkey-wallet/api/api-did';
import { CalculateTransactionFeeResponse } from '@portkey-wallet/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { useCheckTransferLimitWithJump, useSecuritySafeCheckAndToast } from 'hooks/security';
import CommonToast from 'components/CommonToast';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';

const SendHome: React.FC = () => {
  const {
    params: { sendType = 'token', toInfo, assetInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();
  const { t } = useLanguage();
  useFetchTxFee();
  const isValidChainId = useIsValidSuffix();
  const defaultToken = useDefaultToken();

  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain(assetInfo?.chainId);
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const pin = usePin();

  const { max: maxFee, crossChain: crossFee } = useGetTxFee(assetInfo?.chainId);

  const qrScanPermissionAndToast = useQrScanPermissionAndToast();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [selectedFromAccount] = useState({ name: '', address: '' }); // from
  const [selectedToContact, setSelectedToContact] = useState(toInfo); // to
  const [selectedAssets, setSelectedAssets] = useState(assetInfo); // token or nft
  const [sendNumber, setSendNumber] = useState<string>(''); // tokenNumber  like 100
  const debounceSendNumber = useDebounce(sendNumber, 500);
  const [, setTransactionFee] = useState<string>('0'); // like 1.2ELF

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any[]>([]);

  const checkManagerSyncState = useCheckManagerSyncState();
  const checkTransferLimitWithJump = useCheckTransferLimitWithJump();
  const contractRef = useRef<ContractBasic>();

  useEffect(() => {
    setSelectedToContact(toInfo);
  }, [toInfo]);

  // get transfer fee
  const getTransactionFee = useCallback(
    async (isCross: boolean, sendAmount?: number | string | BigNumber) => {
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      if (!contractRef.current) {
        contractRef.current = await getContractBasic({
          contractAddress: chainInfo.caContractAddress,
          rpcUrl: chainInfo.endPoint,
          account,
        });
      }
      const contract = contractRef.current;

      const firstMethodName = isCross ? 'ManagerTransfer' : 'ManagerForwardCall';
      const secondParams = isCross
        ? {
            contractAddress: selectedAssets.tokenContractAddress,
            caHash: wallet.caHash,
            symbol: selectedAssets.symbol,
            to: wallet.address,
            amount: timesDecimals(sendAmount ?? debounceSendNumber, selectedAssets.decimals || '0').toFixed(),
            memo: '',
          }
        : {
            caHash: wallet.caHash,
            contractAddress: selectedAssets.tokenContractAddress,
            methodName: 'Transfer',
            args: {
              symbol: selectedAssets.symbol,
              to: selectedToContact.address,
              amount: timesDecimals(sendAmount ?? debounceSendNumber, selectedAssets.decimals || '0').toFixed(),
              memo: '',
            },
          };

      const req = await contract.calculateTransactionFee(firstMethodName, secondParams);

      if (req?.error) request.errorReport('calculateTransactionFee', secondParams, req.error);

      const { TransactionFees, TransactionFee } = (req.data as CalculateTransactionFeeResponse) || {};
      // V2 calculateTransactionFee
      if (TransactionFees) {
        const { ChargingAddress, Fee } = TransactionFees;
        const myPayFee = isMyPayTransactionFee(ChargingAddress, assetInfo?.chainId);
        if (myPayFee) return divDecimalsStr(Fee?.[defaultToken.symbol], defaultToken.decimals).toString();
        return '0';
      }
      // V1 calculateTransactionFee
      if (TransactionFee)
        return divDecimalsStr(TransactionFee?.[defaultToken.symbol], defaultToken.decimals).toString();
      throw { code: 500, message: 'no enough fee' };
    },
    [
      assetInfo?.chainId,
      chainInfo,
      debounceSendNumber,
      defaultToken.decimals,
      defaultToken.symbol,
      pin,
      selectedAssets.decimals,
      selectedAssets.symbol,
      selectedAssets.tokenContractAddress,
      selectedToContact.address,
      wallet.address,
      wallet.caHash,
    ],
  );

  const onPressMax = useCallback(async () => {
    Loading.show();
    try {
      // check is SYNCHRONIZING
      const _isManagerSynced = await checkManagerSyncState(chainInfo?.chainId || 'AELF');
      if (!_isManagerSynced) return setErrorMessage([TransactionError.SYNCHRONIZING]);

      // balance 0
      if (divDecimals(selectedAssets.balance, selectedAssets.decimals).isEqualTo(0)) return setSendNumber('0');

      // other tokens
      if (selectedAssets.symbol !== defaultToken.symbol)
        return setSendNumber(divDecimals(selectedAssets.balance, selectedAssets.decimals || '0').toString());

      // elf <= maxFee
      if (divDecimals(selectedAssets.balance, selectedAssets.decimals).isLessThanOrEqualTo(maxFee))
        return setSendNumber(divDecimals(selectedAssets.balance, selectedAssets.decimals || '0').toString());

      const isCross = isCrossChain(selectedAssets.chainId, selectedToContact.chainId || 'AELF');
      const fee = await getTransactionFee(isCross, divDecimals(selectedAssets.balance, selectedAssets.decimals));
      setTransactionFee(fee || '0');
      setSendNumber(
        divDecimals(selectedAssets.balance, selectedAssets.decimals || '0')
          .minus(fee || '0')
          .toFixed(),
      );
    } catch (err: any) {
      if (err?.code === 500) {
        setTransactionFee(String(maxFee));
        const selectedAssetsNum = divDecimals(selectedAssets.balance, selectedAssets.decimals || '0');
        setSendNumber(selectedAssetsNum.minus(maxFee).toFixed());
      }
    } finally {
      Loading.hide();
    }
  }, [
    chainInfo?.chainId,
    checkManagerSyncState,
    defaultToken.symbol,
    getTransactionFee,
    maxFee,
    selectedAssets.balance,
    selectedAssets.chainId,
    selectedAssets.decimals,
    selectedAssets.symbol,
    selectedToContact.chainId,
  ]);

  const getAssetBalance = useCallback(
    async (tokenContractAddress: string, symbol: string) => {
      if (!chainInfo || !pin) return;
      const account = getManagerAccount(pin);
      if (!account) return;

      const contract = await getContractBasic({
        contractAddress: tokenContractAddress,
        rpcUrl: chainInfo?.endPoint,
        account: account,
      });

      const balance = await getELFChainBalance(contract, symbol, wallet?.[assetInfo?.chainId]?.caAddress || '');

      return balance;
    },
    [assetInfo?.chainId, chainInfo, pin, wallet],
  );

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
      // TODO: check if  cross chain
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

  /**
   * elf:   elf balance \  elf sendNumber \elf fee
   * not elf：  not elf balance \  not elf sendNumber \ elf balance \ elf fee
   */

  const checkCanPreview = useCallback(async () => {
    Loading.show();
    let fee;
    setErrorMessage([]);

    if (!chainInfo || !pin) {
      return { status: false };
    }
    const account = getManagerAccount(pin);
    if (!account) {
      return { status: false };
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
    try {
      if (!contractRef.current) {
        contractRef.current = await getContractBasic({
          contractAddress: chainInfo.caContractAddress,
          rpcUrl: chainInfo.endPoint,
          account,
        });
      }
      const contract = contractRef.current;
      const checkTransferLimitResult = await checkTransferLimitWithJump(
        {
          caContract: contract,
          symbol: assetInfo.symbol,
          decimals: assetInfo.decimals,
          amount: sendNumber,
        },
        chainInfo.chainId,
      );
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

    const sendBigNumber = timesDecimals(sendNumber, selectedAssets.decimals || '0');
    const assetBalanceBigNumber = ZERO.plus(selectedAssets.balance);
    const isCross = isCrossChain(selectedToContact.address, assetInfo.chainId);

    // input check
    if (sendType === 'token') {
      // token
      if (assetInfo.symbol === defaultToken.symbol) {
        // ELF
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage([TransactionError.TOKEN_NOT_ENOUGH]);
          Loading.hide();
          return { status: false };
        }

        if (isCross && sendBigNumber.isLessThanOrEqualTo(timesDecimals(crossFee, defaultToken.decimals))) {
          setErrorMessage([TransactionError.CROSS_NOT_ENOUGH]);
          Loading.hide();
          return { status: false };
        }
      } else {
        // nft
        if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
          setErrorMessage([TransactionError.TOKEN_NOT_ENOUGH]);
          Loading.hide();
          return { status: false };
        }
      }
    } else {
      // nft
      if (sendBigNumber.isGreaterThan(assetBalanceBigNumber)) {
        setErrorMessage([TransactionError.NFT_NOT_ENOUGH]);
        Loading.hide();
        return { status: false };
      }
    }

    // transaction fee check
    try {
      fee = await getTransactionFee(isCross);
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
    assetInfo.chainId,
    assetInfo.decimals,
    assetInfo.symbol,
    chainInfo,
    checkManagerSyncState,
    checkTransferLimitWithJump,
    crossFee,
    defaultToken.decimals,
    defaultToken.symbol,
    getTransactionFee,
    pin,
    securitySafeCheckAndToast,
    selectedAssets.balance,
    selectedAssets.decimals,
    selectedToContact.address,
    sendNumber,
    sendType,
  ]);

  const preview = useCallback(async () => {
    // TODO : getTransactionFee and check the balance
    const result = await checkCanPreview();
    if (!result?.status) return;

    navigationService.navigate('SendPreview', {
      sendType,
      assetInfo: selectedAssets,
      toInfo: {
        ...selectedToContact,
        address: getEntireDIDAelfAddress(selectedToContact.address, undefined, assetInfo.chainId),
      },
      transactionFee: result?.fee || '0',
      sendNumber,
    } as IToSendPreviewParamsType);
  }, [assetInfo.chainId, checkCanPreview, selectedAssets, selectedToContact, sendNumber, sendType]);

  useEffect(() => {
    (async () => {
      const balance = await getAssetBalance(assetInfo.tokenContractAddress || assetInfo.address, assetInfo.symbol);
      setSelectedAssets({ ...selectedAssets, balance });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetInfo.address, assetInfo.symbol, assetInfo.tokenContractAddress, getAssetBalance]);

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

              navigationService.navigate('QrScanner', { fromSendPage: true });
            }}>
            <Svg icon="scan" size={pTd(17.5)} color={defaultColors.font2} iconStyle={styles.iconStyle} />
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
            balanceShow={selectedAssets.balance}
            sendTokenNumber={sendNumber}
            setSendTokenNumber={setSendNumber}
            selectedToken={assetInfo}
            selectedAccount={selectedFromAccount}
            setSelectedToken={setSelectedAssets}
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
