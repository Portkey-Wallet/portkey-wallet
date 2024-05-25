import React, { useCallback, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';
import CommonInput from 'components/CommonInput';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { TextL, TextM, TextS } from 'components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { ApproveParams } from 'dapp/dappOverlay';
import navigationService from 'utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import Touchable from 'components/Touchable';
import { FontStyles } from 'assets/theme/styles';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { divDecimals, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { LANG_MAX, ZERO } from '@portkey-wallet/constants/misc';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import useEffectOnce from 'hooks/useEffectOnce';
import { isIOS } from '@rneui/base';
import { isValidNumber } from '@portkey-wallet/utils/reg';
import Svg, { IconName } from 'components/Svg';
import {
  ALLOWANCE_DESC,
  SET_ALLOWANCE_BTN_TEXT,
  SET_ALLOWANCE_TIP,
  SET_ALLOWANCE_MULTIPLY_TIP,
} from '@portkey-wallet/constants/constants-ca/allowance';
type SignModalPropsType = {
  dappInfo: DappStoreItem;
  approveParams: ApproveParams;
  onReject: () => void;
  isEditBatchApprovalInApp?: boolean;
};

const ZERO_MESSAGE = 'Please enter a nonzero value';
const ApproveModal = (props: SignModalPropsType) => {
  const { dappInfo, approveParams, onReject, isEditBatchApprovalInApp } = props;
  console.log(approveParams, '====approveInfo');
  const { amount, targetChainId } = approveParams.approveInfo;
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const [errorMessage, setErrorMessage] = useState('');
  const [symbolNum, setSymbolNum] = useState<string>('');
  const [isBatchApproval, setIsBatchApproval] = useState<boolean>(false);
  const decimals = useMemo(() => approveParams.approveInfo.decimals, [approveParams.approveInfo.decimals]);
  const symbol = useMemo(
    () => (isBatchApproval ? '*' : approveParams.approveInfo.symbol),
    [approveParams.approveInfo.symbol, isBatchApproval],
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
        title: t('Pre-authorize'),
        type: 'primary' as CommonButtonProps['type'],
        disabled: !symbolNum.trim(),
        onPress: async () => {
          if (ZERO.isEqualTo(symbolNum)) {
            return setErrorMessage(ZERO_MESSAGE);
          } else {
            setErrorMessage('');
          }

          const tmpAmount = timesDecimals(symbolNum, decimals);
          navigationService.navigate('GuardianApproval', {
            approveParams: {
              isDiscover: approveParams.isDiscover,
              eventName: approveParams.eventName,
              approveInfo: {
                ...approveParams.approveInfo,
                decimals,
                symbol,
                amount: (LANG_MAX.lt(tmpAmount) ? LANG_MAX : tmpAmount).toFixed(0),
              },
            } as ApproveParams,
            targetChainId,
            approvalType: ApprovalType.managerApprove,
          });
          dispatch(changeDrawerOpenStatus(false));
          OverlayModal.hide(false);
        },
      },
    ],
    [
      approveParams.approveInfo,
      approveParams.eventName,
      approveParams.isDiscover,
      decimals,
      dispatch,
      onReject,
      symbol,
      symbolNum,
      t,
      targetChainId,
    ],
  );

  const onPressMax = useCallback(() => {
    setErrorMessage('');
    setSymbolNum(MAX_NUM.toFixed(0));
  }, [MAX_NUM]);

  const onChangeText = useCallback(
    (v: string) => {
      if (isValidNumber(v.trim())) return setSymbolNum(parseInputNumberChange(v.trim(), MAX_NUM, decimals));

      if (!v.trim()) return setSymbolNum('');
    },
    [MAX_NUM, decimals],
  );

  const onUseRecommendedValue = useCallback(() => {
    setErrorMessage('');
    if (LANG_MAX.lt(amount)) return onPressMax();
    setSymbolNum(parseInputNumberChange(divDecimalsStr(amount, approveParams.approveInfo.decimals), MAX_NUM, decimals));
  }, [MAX_NUM, amount, approveParams.approveInfo.decimals, decimals, onPressMax]);

  useEffectOnce(() => {
    onUseRecommendedValue();
  });

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject} onTouchStart={Keyboard.dismiss}>
      <View style={styles.contentWrap}>
        <View style={[GStyles.center, styles.headerSection]}>
          {dappInfo.svgIcon ? (
            <Svg icon={dappInfo.svgIcon as IconName} size={pTd(48)} />
          ) : (
            <DiscoverWebsiteImage size={pTd(48)} imageUrl={getFaviconUrl(dappInfo.origin)} />
          )}

          <TextL
            style={[
              FontStyles.font5,
              GStyles.textAlignCenter,
              GStyles.marginTop(pTd(8)),
              GStyles.marginBottom(pTd(8)),
            ]}>
            {isEditBatchApprovalInApp
              ? `Set access token amount`
              : `${dappInfo.name || dappInfo.origin} is requesting access to your Token`}
          </TextL>

          <TextS style={[FontStyles.font7, GStyles.textAlignCenter]}>{ALLOWANCE_DESC}</TextS>
        </View>

        <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.inputTitle]}>
          <TextM style={GStyles.flex1}>Set Allowance</TextM>
          {!isEditBatchApprovalInApp && (
            <Touchable onPress={onUseRecommendedValue}>
              <TextM style={FontStyles.font4}> Use Recommended Value</TextM>
            </Touchable>
          )}
        </View>

        <CommonInput
          type="general"
          keyboardType="numeric"
          value={symbolNum}
          placeholder=" "
          onChangeText={onChangeText}
          errorMessage={errorMessage}
          rightIcon={
            <Touchable onPress={onPressMax}>
              <TextM style={FontStyles.font4}>Max</TextM>
            </Touchable>
          }
        />

        {approveParams?.showBatchApproveToken && !isEditBatchApprovalInApp && (
          <Touchable style={styles.batchApprovalWrap} onPress={() => setIsBatchApproval(!isBatchApproval)}>
            <Svg
              icon={isBatchApproval ? 'selected' : 'unselected'}
              color={isBatchApproval ? defaultColors.primaryColor : undefined}
              size={pTd(20)}
              iconStyle={{ marginRight: pTd(8) }}
            />
            <TextM>{SET_ALLOWANCE_BTN_TEXT}</TextM>
          </Touchable>
        )}

        <TextM style={[FontStyles.font3]}>
          {approveParams?.showBatchApproveToken ? SET_ALLOWANCE_MULTIPLY_TIP : SET_ALLOWANCE_TIP}
        </TextM>
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

const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  headerSection: {
    paddingTop: pTd(8),
    width: '100%',
  },
  inputWrap: {
    borderColor: 'red',
    borderWidth: pTd(1),
  },
  inputTitle: {
    marginTop: pTd(40),
    marginBottom: pTd(8),
    paddingHorizontal: pTd(8),
  },
  title: {
    marginBottom: pTd(2),
  },
  method: {
    borderRadius: pTd(6),
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.primaryColor,
    backgroundColor: defaultColors.brandLight,
    ...GStyles.paddingArg(2, 8),
  },
  signTitle: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    textAlign: 'center',
  },
  batchApprovalWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(24),
  },
});
