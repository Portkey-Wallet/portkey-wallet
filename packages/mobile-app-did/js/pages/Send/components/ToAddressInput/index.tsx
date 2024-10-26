import { darkColors, defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useState } from 'react';
import { View, TextInput } from 'react-native';
import { formatStr2EllipsisStr, getAddressChainId, isSameAddresses } from '@portkey-wallet/utils';
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

interface IToAddressInput {
  isFixedToContact?: boolean;
  selectedToken?: IToSendAssetParamsType;
  selectedToContact: { name: string; address: string };
  setSelectedToContact: (contact: any) => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  err: WarningKey[];
  setErrorMessage: React.Dispatch<React.SetStateAction<WarningKey[]>>;
  // TODO： change it
  setChainList: React.Dispatch<React.SetStateAction<any>>;
}

export default function ToAddressInput({
  // isChecking,
  // checkedPass,
  isFixedToContact,
  selectedToken,
  selectedToContact,
  setSelectedToContact,
  step,
  setStep,
  setChainList,
  err,
  setErrorMessage,
}: IToAddressInput) {
  const { t } = useLanguage();
  const styles = getStyles();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const [isChecking, setIsChecking] = useState(false);
  const [checkFinish, setCheckFinish] = useState(false);
  const [checkedPass, setCheckedPass] = useState(false);

  const isValidChainId = useIsValidSuffix();
  const wallet = useCurrentWalletInfo();

  const isDangerWarning = warning1Arr.includes(err?.[0]);

  const clearInput = useCallback(() => {
    setStep(1);
    setSelectedToContact({ address: '', name: '' });
  }, [setSelectedToContact, setStep]);

  const checkAddressByFE = useCallback(
    (v: string) => {
      if (!isDIDAelfAddress(v)) return false;

      // include chainId
      if (v.includes('_')) {
        // same address
        const suffix = getAddressChainId(selectedToContact.address);
        if (
          isSameAddresses(
            wallet?.[selectedToken?.chainId || 'AELF']?.caAddress || '',
            getAelfAddress(selectedToContact.address),
          ) &&
          suffix === selectedToken?.chainId
        )
          setErrorMessage([WarningKey.SAME_ADDRESS]);

        // invalid chainId
        if (!isValidChainId(getAddressChainId(selectedToContact?.address || '') || ''))
          setErrorMessage([WarningKey.INVALID_ADDRESS]);

        // cross chain
        if (isCrossChain(selectedToContact.address, selectedToken?.chainId || 'AELF'))
          setErrorMessage([WarningKey.CROSS_CHAIN]);
      } else {
        // TODO: change it
        // same address
      }

      return true;
    },
    [isValidChainId, selectedToContact.address, selectedToken?.chainId, setErrorMessage, wallet],
  );

  const getNetworkList = useDebounceCallback(
    async (toAddress: string) => {
      try {
        setIsChecking(true);
        const list = await getSendNetworkList({
          symbol: selectedToken?.symbol || '',
          chainId: selectedToken?.chainId || 'AELF',
          toAddress,
        });
        setChainList(list);
        setCheckedPass(true);
      } catch (error) {
        console.log('getNetworkList err', error);
        setErrorMessage([WarningKey.INVALID_ADDRESS]);
      } finally {
        setIsChecking(false);
        setCheckFinish(true);
      }
    },
    [selectedToken?.chainId, selectedToken?.symbol, setChainList, setErrorMessage],
  );

  const onInput = useCallback(
    async (v: string) => {
      const _v = v.trim();
      setSelectedToContact({ name: '', address: _v });
      setCheckFinish(false);
      if (!checkAddressByFE(_v)) {
        getNetworkList(_v);
      }
    },
    [checkAddressByFE, getNetworkList, setSelectedToContact],
  );

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
              <TextM>{formatStr2EllipsisStr(selectedToContact?.address, 15)}</TextM>
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

            {selectedToContact.address && (
              <Touchable onPress={clearInput}>
                <Svg icon="clear4" size={pTd(16)} />
              </Touchable>
            )}
            {isChecking && <LottieLoading lottieWrapStyle={[GStyles.paddingArg(0), GStyles.marginLeft(pTd(16))]} />}
            {selectedToContact.address && !isChecking && checkFinish && (
              <Svg
                icon={checkedPass ? 'checked' : 'warning'}
                size={pTd(20)}
                color={isDangerWarning ? defaultColors.iconDanger3 : defaultColors.iconWarning3}
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
      <View style={[GStyles.flexRow, GStyles.paddingArg(pTd(8), pTd(16))]}>
        <TextM>Enter or </TextM>
        <TextM style={styles.brand2Color}>paste a wallet address</TextM>
      </View>
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
