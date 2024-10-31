import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import { View, TextInput } from 'react-native';
import { formatStr2EllipsisStr, getAddressChainId, getChainIdByAddress, isSameAddresses } from '@portkey-wallet/utils';
import LottieLoading from 'components/LottieLoading';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';
import Divider from 'components/Divider';
import navigationService from 'utils/navigationService';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import { getSendNetworkList } from 'pages/Send/utils';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { getAelfAddress, isCrossChain, isDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import { useIsValidSuffix } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { warning1Arr, WarningKey } from 'pages/Send/constant';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { INetworkItem } from '../SelectNetwork';
import { getStringAsync } from 'expo-clipboard';
interface IToAddressInput {
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
}

export default function ToAddressInput({
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
}: IToAddressInput) {
  const { t } = useLanguage();
  const styles = getStyles();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const [isChecking, setIsChecking] = useState(false);
  const [checkedPass, setCheckedPass] = useState(false);

  const isValidChainId = useIsValidSuffix();
  const wallet = useCurrentWalletInfo();

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
      if (!isDIDAelfAddress(v)) return false;

      // include chainId
      if (v.includes('_')) {
        const suffix = getAddressChainId(v);

        // same address
        if (
          isSameAddresses(wallet?.[selectedToken?.chainId || 'AELF']?.caAddress || '', getAelfAddress(v)) &&
          suffix === selectedToken?.chainId
        ) {
          console.log('isDIDAelfAddress333');

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
          console.log('isDIDAelfAddress222');
          setWarning([]);
          setCheckedPass(true);
        }
      } else {
        // TODO: change it
        // same address
        if (selectedToken?.chainId === 'AELF') {
          setCheckedPass(false);
          setWarning([WarningKey.MAIN_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]);
        } else {
          setCheckedPass(false);
          setWarning([WarningKey.DAPP_CHAIN_TO_NO_AFFIX_ADDRESS_ELF]);
        }
      }
      setCheckFinish(true);
      return true;
    },
    [isValidChainId, selectedToContact.address, selectedToken?.chainId, setCheckFinish, setWarning, wallet],
  );

  const getNetworkList = useDebounceCallback(
    async (toAddress: string) => {
      if (!toAddress) {
        setWarning([]);
        setIsChecking(false);
        setCheckFinish(true);
        return;
      }

      try {
        setIsChecking(true);
        const { data } = await getSendNetworkList({
          symbol: selectedToken?.symbol || '',
          chainId: selectedToken?.chainId || 'AELF',
          toAddress,
        });

        const chainListLen = data.networkList.length;
        setChainList(data.networkList);
        setCheckedPass(!!chainListLen);
        chainListLen ? setWarning([WarningKey.MAKE_SURE_SUPPORT_PLATFORM]) : setWarning([WarningKey.INVALID_ADDRESS]);
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

  const onInput = useCallback(
    async (v: string) => {
      const _v = v.trim();
      setCheckFinish(false);
      setSelectedToContact(() => {
        let chainId = '';
        if (_v.includes('_') && isDIDAelfAddress(_v)) chainId = getChainIdByAddress(_v);
        return { name: '', address: _v, chainId };
      });

      const FEPass = checkAddressByFE(_v);
      if (!FEPass) getNetworkList(_v);
      // getNetworkList(_v);
    },
    [checkAddressByFE, getNetworkList, setCheckFinish, setSelectedToContact],
  );

  const pasteAddress = useCallback(async () => {
    try {
      const str = await getStringAsync();
      console.log('str', str);
      onInput(str);
    } catch (error) {
      console.log('pasteAddress', error);
    }
  }, [onInput]);

  return (
    <View style={styles.wrap}>
      <View style={styles.toWrap}>
        {step === 2 ? (
          <>
            <TextL style={styles.grayColor}>{`To:  `}</TextL>
            {selectedToContact?.name ? (
              <>
                <TextM>{selectedToContact?.name || ''}</TextM>
                <TextM style={styles.grayColor}>{`(${
                  formatStr2EllipsisStr(selectedToContact?.address || '', 15) || ''
                })`}</TextM>
              </>
            ) : (
              <TextM>{formatStr2EllipsisStr(selectedToContact?.address, 8)}</TextM>
            )}
            {!isFixedToContact && (
              <Touchable onPress={() => setStep(1)}>
                <Svg icon="edit" size={pTd(16)} color={darkColors.iconBase1} />
              </Touchable>
            )}
          </>
        ) : (
          <>
            <TextL style={styles.grayColor}>{`To:  `}</TextL>
            <TextInput
              editable={step === 1}
              style={styles.inputStyle}
              placeholder={t('Address')}
              placeholderTextColor={darkColors.textBase3}
              multiline={true}
              numberOfLines={2}
              maxLength={64}
              value={selectedToContact?.address || ''}
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
                size={pTd(20)}
                color={defaultColors.iconSuccess1}
                iconStyle={GStyles.marginLeft(16)}
              />
            )}

            {!isFixedToContact && !selectedToContact.address && (
              <Touchable
                style={[GStyles.marginLeft(16), GStyles.flex1, GStyles.flexRow, GStyles.flexEnd]}
                onPress={async () => {
                  if (!(await qrScanPermissionAndToast())) return;
                  navigationService.navigate('QrScanner');
                }}>
                <Svg icon="scan" size={pTd(20)} color={darkColors.iconBase1} />
              </Touchable>
            )}
          </>
        )}
      </View>

      <Divider />
      {!selectedToContact.address && (
        <View style={[GStyles.flexRow, GStyles.paddingArg(pTd(8), pTd(16))]}>
          <TextM>Enter or </TextM>
          <TextM style={styles.brand2Color} onPress={pasteAddress}>
            paste a wallet address
          </TextM>
        </View>
      )}
    </View>
  );
}

export const getStyles = makeStyles(theme => ({
  wrap: {},
  toWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pTd(14),
    paddingHorizontal: pTd(16),
  },
  grayColor: {
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
    color: theme.colors.textBase1,
    paddingRight: pTd(6),
    fontSize: pTd(14),
    lineHeight: pTd(14),
    width: pTd(260),
  },
  right: {
    width: pTd(16),
  },
}));
