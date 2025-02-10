import React, { useCallback, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { DeviceEventEmitter, Keyboard, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import { TextL, TextM } from 'components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { ApproveParams } from 'dapp/dappOverlay';
import { useAppDispatch } from 'store/hooks';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-eoa/discover/slice';
import Touchable from 'components/Touchable';
import { divDecimals, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { LANG_MAX, ZERO } from '@portkey-wallet/constants/misc';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import useEffectOnce from 'hooks/useEffectOnce';
import { isIOS } from '@rneui/base';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import Svg from 'components/Svg';
import { isNFT } from '@portkey-wallet/utils/token';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import CommonTooltip from 'components/CommonTooltip';
import TitleInfoSection from '../TitleInfoSection';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  approveParams: ApproveParams;
  onReject: () => void;
  isEditBatchApprovalInApp?: boolean;
};

const ZERO_MESSAGE = 'Please enter a valid amount.';
const ApproveModal = (props: SignModalPropsType) => {
  const { dappInfo, approveParams, onReject, isEditBatchApprovalInApp } = props;
  const { amount } = approveParams.approveInfo;
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');
  const [symbolNum, setSymbolNum] = useState<string>('');
  const styles = getStyles();
  const { theme } = useTheme();

  const decimals = useMemo(() => approveParams.approveInfo.decimals, [approveParams.approveInfo.decimals]);

  const approveSymbol = useMemo(
    () =>
      approveParams?.batchApproveNFT && isNFT(approveParams.approveInfo.symbol)
        ? approveParams.approveInfo.symbol.split('-')[0]
        : approveParams.approveInfo.symbol,
    [approveParams.approveInfo.symbol, approveParams?.batchApproveNFT],
  );

  const MAX_NUM = useMemo(
    () => divDecimals(LANG_MAX, approveParams.approveInfo.decimals),
    [approveParams.approveInfo.decimals],
  );

  const ButtonList = useMemo(
    (): {
      onPress?: () => void;
      type?: CommonButtonProps['type'];
      title: string;
      loading?: CommonButtonProps['loading'];
      disabled?: boolean;
    }[] => [
      {
        title: t('Reject'),
        type: 'outline',
        onPress: () => {
          onReject?.();
          OverlayModal.hide();
        },
      },
      {
        title: t('Approve'),
        type: 'primary' as CommonButtonProps['type'],
        disabled: !symbolNum.trim(),
        onPress: async () => {
          if (ZERO.isEqualTo(symbolNum)) {
            return setErrorMessage(ZERO_MESSAGE);
          } else {
            setErrorMessage('');
          }

          const tmpAmount = timesDecimals(symbolNum, decimals);
          DeviceEventEmitter.emit(approveParams.eventName, {
            approveInfo: {
              ...approveParams.approveInfo,
              decimals,
              symbol: approveParams.approveInfo.symbol,
              amount: (LANG_MAX.lt(tmpAmount) ? LANG_MAX : tmpAmount).toFixed(0),
            },
            success: true,
          });
          dispatch(changeDrawerOpenStatus(false));
          OverlayModal.hide(false);
        },
      },
    ],
    [approveParams.approveInfo, approveParams.eventName, decimals, dispatch, onReject, symbolNum, t],
  );

  const onPressMax = useCallback(() => {
    setErrorMessage('');
    setSymbolNum(MAX_NUM.toFixed(0));
  }, [MAX_NUM]);

  const onChangeText = useCallback(
    (v: string) => {
      if (isValidNumber(v.trim())) {
        return setSymbolNum(parseInputNumberChange(v.trim(), MAX_NUM, decimals));
      }

      if (!v.trim()) {
        return setSymbolNum('');
      }
    },
    [MAX_NUM, decimals],
  );

  const onUseRecommendedValue = useCallback(() => {
    setErrorMessage('');
    if (LANG_MAX.lt(amount)) {
      return onPressMax();
    }
    setSymbolNum(parseInputNumberChange(divDecimalsStr(amount, approveParams.approveInfo.decimals), MAX_NUM, decimals));
  }, [MAX_NUM, amount, approveParams.approveInfo.decimals, decimals, onPressMax]);

  useEffectOnce(() => {
    onUseRecommendedValue();
  });

  return (
    <ModalBody
      modalBodyType="bottom"
      leftTitleDom={
        <TitleInfoSection
          viewStyle={{ paddingLeft: pTd(16) }}
          title={t('Approve token allowance')}
          dappInfo={dappInfo}
        />
      }
      onClose={onReject}
      onTouchStart={Keyboard.dismiss}>
      <View style={styles.contentWrap}>
        <View style={styles.inputWrap}>
          <View style={[GStyles.flexRow, GStyles.itemCenter, { marginBottom: pTd(8) }]}>
            <TextL style={{ lineHeight: pTd(22) }}>{t('Token allowance')}</TextL>
            <CommonTooltip
              iconStyle={{ marginLeft: pTd(4) }}
              tooltipProps={{
                title: t('Token allowance'),
                description: `For asset security, set a custom allowance for this dApp. ${approveSymbol} approval won't be needed until the allowance is used up. You can change the settings anytime.`,
              }}
            />
          </View>
          <KeyboardSafeArea>
            <CommonInput
              type="general"
              keyboardType="numeric"
              value={symbolNum}
              placeholder=" "
              onChangeText={onChangeText}
              errorMessage={errorMessage}
              rightIcon={
                <View style={[GStyles.flexRow, GStyles.itemCenter]}>
                  <Touchable
                    onPress={() => {
                      setSymbolNum('');
                      setErrorMessage('');
                    }}>
                    <Svg icon="clear4" iconStyle={{ marginRight: pTd(8) }} size={pTd(16)} />
                  </Touchable>
                  <Touchable>
                    <TextL style={[{ color: theme.colors.textBase2 }]}>
                      {formatStr2EllipsisStr(approveSymbol, 8, 'tail')}
                    </TextL>
                  </Touchable>
                </View>
              }
            />
          </KeyboardSafeArea>
          <View
            style={[
              GStyles.flexRow,
              GStyles.spaceBetween,
              styles.clickWrap,
              { marginTop: pTd(errorMessage ? 0 : -16) },
            ]}>
            {isEditBatchApprovalInApp ? (
              <TextL> </TextL>
            ) : (
              <Touchable onPress={onUseRecommendedValue}>
                <TextM style={{ color: theme.colors.textBrand1 }}>Use default</TextM>
              </Touchable>
            )}
            <Touchable style={GStyles.marginLeft(pTd(12))} onPress={onPressMax}>
              <TextM style={{ color: theme.colors.textBrand1 }}>Max</TextM>
            </Touchable>
          </View>
        </View>
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList} />
    </ModalBody>
  );
};

export const showApproveModal = (props: SignModalPropsType) => {
  OverlayModal.show(<ApproveModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

export default {
  showApproveModal,
};

const getStyles = makeStyles(() => ({
  contentWrap: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    paddingBottom: pTd(76),
  },
  inputWrap: {
    marginTop: pTd(8),
  },
  clickWrap: {
    height: pTd(38),
  },
}));
