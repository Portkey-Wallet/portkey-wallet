import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import {
  formatStr2EllipsisStr,
  getAddressChainId,
  getChainIdByAddress,
  isSameAddresses,
  sleep,
} from '@portkey-wallet/utils';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';
import Divider from 'components/Divider';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { getSendNetworkList } from 'pages/Send/utils';
import { IToSendAssetParamsType, IToSendHomeParamsType } from '@portkey-wallet/types/types-eoa/routeParams';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { getAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { useIsValidSuffix, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { warning1Arr, WarningKey } from 'pages/Send/constant';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { INetworkItem } from '../SelectNetwork';
import { getStringAsync } from 'expo-clipboard';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SendType } from '@portkey-wallet/types/types-eoa/send';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { DefaultChainId } from '@portkey-wallet/constants/constants-eoa/network';

export interface IToAddressInputRef {
  onInput: (address: string) => void;
}

export interface IToAddressInput {
  isFixedToContact?: boolean;
  selectedToken?: IToSendAssetParamsType;
  selectedToContact: { name: string; address: string };
  setSelectedToContact: (contact: any) => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  warning: WarningKey[];
  setWarning: React.Dispatch<React.SetStateAction<WarningKey[]>>;
  // TODO： change it
  setChainList: React.Dispatch<React.SetStateAction<INetworkItem[]>>;
  checkFinish: boolean;
  setCheckFinish: React.Dispatch<React.SetStateAction<boolean>>;
  setSendNumber: React.Dispatch<React.SetStateAction<string>>;
  setSendUSDNumber: React.Dispatch<React.SetStateAction<string>>;
  sendType?: SendType;
}

export const ToAddressInputRef = forwardRef<IToAddressInputRef, IToAddressInput>(function (
  {
    isFixedToContact,
    selectedToken,
    selectedToContact,
    setSelectedToContact,
    step,
    setStep,
    setChainList,
    warning,
    setWarning,
    checkFinish,
    setCheckFinish,
    setSendNumber,
    setSendUSDNumber,
    sendType,
  },
  ref,
) {
  const {
    params: { toInfo },
  } = useRoute<RouteProp<{ params: IToSendHomeParamsType }>>();

  const { t } = useLanguage();
  const styles = getStyles();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const [isChecking, setIsChecking] = useState(false);
  const [checkedPass, setCheckedPass] = useState(false);

  const isValidChainId = useIsValidSuffix();
  const wallet = useCurrentAccount();
  const defaultToken = useDefaultToken(selectedToken?.chainId || 'AELF');

  const isDangerWarning = useMemo(() => warning1Arr.includes(warning?.[0]), [warning]);

  const clearInput = useCallback(() => {
    setStep(1);
    setWarning([]);
    setSendNumber('');
    setSendUSDNumber('');
    setSelectedToContact({ address: '', name: '' });
  }, [setSelectedToContact, setSendNumber, setSendUSDNumber, setStep, setWarning]);

  const checkAddressByFE = useCallback(
    (v: string) => {
      if (!isDIDAelfAddress(v)) {
        return false;
      }

      // include chainId
      if (v.includes('_')) {
        const suffix = getAddressChainId(v);

        console.log('isSameAddresses!!!!', wallet?.address, getAelfAddress(v), suffix, selectedToken?.chainId);

        // same address
        if (isSameAddresses(wallet?.address || '', getAelfAddress(v)) && suffix === selectedToken?.chainId) {
          setCheckedPass(false);
          setWarning([WarningKey.SAME_ADDRESS]);
        } else if (!isValidChainId(suffix)) {
          // invalid chainId
          setCheckedPass(false);
          setWarning([WarningKey.INVALID_ADDRESS]);
        } else if (isCrossChain(v, selectedToken?.chainId || 'AELF')) {
          // cross chain
          setCheckedPass(false);
          setWarning([WarningKey.CROSS_CHAIN]);
        } else {
          setWarning([]);
          setCheckedPass(true);
        }
      } else {
        console.log('checkAddressByFE1111');
        const isSameAddress = isSameAddresses(wallet?.address || '', v);
        // same address
        if (selectedToken?.chainId === 'AELF' && !isSameAddress && selectedToken?.symbol === defaultToken.symbol) {
          setCheckedPass(false);
          setWarning([WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]);
        } else if (
          selectedToken?.chainId === 'AELF' &&
          !isSameAddress &&
          selectedToken?.symbol !== defaultToken.symbol
        ) {
          setCheckedPass(true);
        } else if (selectedToken?.chainId === 'AELF' && isSameAddress) {
          setCheckedPass(false);
          setWarning([WarningKey.SAME_ADDRESS]);
        } else if (!isSameAddress && selectedToken?.symbol !== defaultToken.symbol) {
          setCheckedPass(true);
          // same chain transfer
          setSelectedToContact((pre: any) => ({ ...pre, chainId: selectedToken?.chainId }));
        } else {
          setCheckedPass(false);
          setWarning([WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]);
        }
      }
      setCheckFinish(true);
      return true;
    },
    [
      defaultToken.symbol,
      isValidChainId,
      selectedToken?.chainId,
      selectedToken?.symbol,
      setCheckFinish,
      setSelectedToContact,
      setWarning,
      wallet,
    ],
  );

  const getNetworkList = useCallback(
    async (toAddress: string) => {
      if (!toAddress) {
        setWarning([]);
        setIsChecking(false);
        setCheckFinish(true);
        return;
      }

      try {
        setIsChecking(true);
        const { networkList } = await getSendNetworkList({
          symbol: selectedToken?.symbol || '',
          chainId: selectedToken?.chainId || 'AELF',
          toAddress,
        });

        setCheckedPass(true);
        setChainList(networkList);
        setWarning([WarningKey.MAKE_SURE_SUPPORT_PLATFORM]);
      } catch (error) {
        console.log('getNetworkList err', error);
        setWarning([WarningKey.INVALID_ADDRESS]);
      } finally {
        setIsChecking(false);
        setCheckFinish(true);
      }
    },
    [selectedToken?.chainId, selectedToken?.symbol, setChainList, setCheckFinish, setWarning],
  );

  const onInput = useCallback((v: string) => {
    const _v = v.trim();
    setCheckFinish(false);

    setSelectedToContact((pre: any) => {
      let chainId = DefaultChainId;
      if (_v.includes('_') && isDIDAelfAddress(_v)) {
        chainId = getChainIdByAddress(_v);
      }
      return { ...pre, name: '', address: _v, chainId };
    });
    // eslint-disable-next-line prettier/prettier, react-hooks/exhaustive-deps
  }, []);

  const pasteAddress = useCallback(async () => {
    try {
      const str = await getStringAsync();
      onInput(str);
    } catch (error) {
      console.log('pasteAddress', error);
    }
  }, [onInput]);

  const onPressEdit = useCallback(async () => {
    setCheckFinish(true);
    setCheckedPass(true);
    setStep(1);
    onInput(selectedToContact.address);
    await sleep(10);
    setSelectedToContact((pre: any) => ({ ...pre, name: '' }));
  }, [onInput, selectedToContact.address, setCheckFinish, setSelectedToContact, setStep]);

  const checkAddress = useDebounceCallback(async () => {
    const FEPass = checkAddressByFE(selectedToContact.address);

    console.log('checkAddress FE', FEPass);

    // when send nft other chain is not support
    if (!FEPass && sendType === 'nft' && !!selectedToContact.address) {
      setCheckFinish(true);
      return setWarning([WarningKey.INVALID_ADDRESS]);
    }
    if (!FEPass) {
      await getNetworkList(selectedToContact.address);
    }
  }, [checkAddressByFE, getNetworkList, selectedToContact.address, sendType, setCheckFinish, setWarning]);

  useEffect(() => {
    checkAddress();
  }, [checkAddress, checkAddressByFE, getNetworkList, selectedToContact.address, sendType, setCheckFinish, setWarning]);

  useImperativeHandle(
    ref,
    () => ({
      onInput,
    }),
    [onInput],
  );

  useEffect(() => {
    onInput(toInfo.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={styles.toWrap}>
        {step === 2 ? (
          <>
            <TextL style={styles.grayColor}>{'To:  '}</TextL>
            {selectedToContact?.name ? (
              <>
                <TextM>{selectedToContact?.name || ''}</TextM>
                <TextM style={styles.grayColor}>{`(${
                  formatStr2EllipsisStr(selectedToContact?.address || '', 8) || ''
                })`}</TextM>
              </>
            ) : (
              <TextM>{formatStr2EllipsisStr(selectedToContact?.address, 8)}</TextM>
            )}
            {!isFixedToContact && (
              <Touchable onPress={onPressEdit}>
                <Svg icon="edit" size={pTd(16)} color={darkColors.iconBase1} />
              </Touchable>
            )}
          </>
        ) : (
          <>
            <TextL style={styles.grayColor}>{'To:  '}</TextL>
            <TextInput
              multiline
              editable={step === 1}
              style={styles.inputStyle}
              placeholder={t('Address')}
              placeholderTextColor={darkColors.textBase3}
              value={selectedToContact?.address}
              onChangeText={onInput}
            />

            {selectedToContact.address && !isChecking && (
              <Touchable onPress={clearInput}>
                <Svg icon="clear4" size={pTd(16)} />
              </Touchable>
            )}
            {isChecking && <LottieLoading lottieWrapStyle={[GStyles.paddingArg(0), GStyles.marginLeft(pTd(16))]} />}
            {selectedToContact.address && !isChecking && checkFinish && !checkedPass && (
              <Svg
                icon={'warning'}
                size={pTd(20)}
                color={isDangerWarning ? defaultColors.iconDanger3 : defaultColors.iconWarning3}
                iconStyle={GStyles.marginLeft(16)}
              />
            )}
            {selectedToContact.address && !isChecking && checkFinish && checkedPass && (
              <Svg
                icon={'checked'}
                size={pTd(24)}
                color={defaultColors.iconSuccess1}
                iconStyle={GStyles.marginLeft(14)}
              />
            )}

            {!isFixedToContact && !selectedToContact.address && (
              <Touchable
                style={[GStyles.marginLeft(16), GStyles.flex1, GStyles.flexRow, GStyles.flexEnd]}
                onPress={async () => {
                  if (!(await qrScanPermissionAndToast())) {
                    return;
                  }
                  navigationService.navigate('QrScanner');
                }}>
                <Svg icon="scan" size={pTd(20)} color={darkColors.iconBase1} />
              </Touchable>
            )}
          </>
        )}
      </View>

      <Divider />
      {!selectedToContact?.address && (
        <View style={[GStyles.flexRow, GStyles.paddingArg(pTd(8), pTd(16))]}>
          <TextM>Enter or </TextM>
          <TextM style={styles.brand2Color} onPress={pasteAddress}>
            paste a wallet address
          </TextM>
        </View>
      )}
    </View>
  );
});

export default ToAddressInputRef;

export const getStyles = makeStyles((theme: any) => ({
  wrap: {},
  toWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pTd(12),
    paddingHorizontal: pTd(16),
    height: pTd(59),
  },
  grayColor: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase2,
  },
  brand2Color: {
    color: theme.colors.textBrand2,
  },
  leftTitle: {
    width: pTd(49),
    color: defaultColors.font3,
  },
  middle: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  middleTitle: {
    fontSize: pTd(14),
    color: defaultColors.font5,
    lineHeight: pTd(20),
  },
  middleAddress: {
    marginTop: pTd(2),
    width: pTd(235),
    fontSize: pTd(10),
    color: defaultColors.font3,
    lineHeight: pTd(14),
  },
  iconWrap: {
    zIndex: 100,
    position: 'absolute',
    right: 0,
  },
  containerStyle: {
    ...GStyles.marginArg(0),
    ...GStyles.paddingArg(0),
    height: pTd(56),
  },
  inputStyle: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    paddingVertical: 0,
    paddingRight: pTd(6),
    fontSize: pTd(14),
    width: pTd(273),
  },
  right: {
    width: pTd(16),
  },
}));
