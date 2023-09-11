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
import { sleep } from '@portkey-wallet/utils';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import Touchable from 'components/Touchable';
import { FontStyles } from 'assets/theme/styles';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { divDecimals, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import { parseInputIntegerChange } from '@portkey-wallet/utils/input';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  approveParams: ApproveParams;
  onReject: () => void;
};
const ApproveModal = (props: SignModalPropsType) => {
  const { dappInfo, approveParams, onReject } = props;
  console.log(approveParams, '====approveInfo');
  const dispatch = useAppDispatch();
  const { t } = useLanguage();

  const [errorMessage] = useState('');
  const [symbolNum, setSymbolNum] = useState<string>('');

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
          const amount = timesDecimals(symbolNum, approveParams.approveInfo.decimals);
          navigationService.navigate('GuardianApproval', {
            approveParams: {
              eventName: approveParams.eventName,
              approveInfo: {
                ...approveParams.approveInfo,
                amount: (LANG_MAX.lt(amount) ? LANG_MAX : amount).toFixed(0),
              },
            } as ApproveParams,
            approvalType: ApprovalType.managerApprove,
          });
          await sleep(200);
          dispatch(changeDrawerOpenStatus(false));
          OverlayModal.hide();
        },
      },
    ],
    [approveParams.approveInfo, approveParams.eventName, dispatch, onReject, symbolNum, t],
  );

  const onPressMax = useCallback(() => {
    setSymbolNum(MAX_NUM.toFixed(0));
  }, [MAX_NUM]);

  const onChangeText = useCallback(
    (v: string) => {
      if (MAX_NUM.isLessThan(v)) return;
      setSymbolNum(parseInputIntegerChange(v));
    },
    [MAX_NUM],
  );

  const onUseRecommendedValue = useCallback(() => {
    setSymbolNum(divDecimalsStr(approveParams.approveInfo.amount, approveParams.approveInfo.decimals));
  }, [approveParams.approveInfo.amount, approveParams.approveInfo.decimals]);

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
      <View
        style={styles.contentWrap}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}>
        <View style={[GStyles.center, styles.headerSection]}>
          <DiscoverWebsiteImage size={pTd(48)} imageUrl={getFaviconUrl(dappInfo.origin)} />
          <TextL
            style={[
              FontStyles.font5,
              GStyles.textAlignCenter,
              GStyles.marginTop(pTd(8)),
              GStyles.marginBottom(pTd(8)),
            ]}>{`${dappInfo.name || dappInfo.origin} is requesting access to your ${
            approveParams.approveInfo.symbol
          }`}</TextL>
          <TextS style={[FontStyles.font7, GStyles.textAlignCenter]}>
            {`To ensure your assets' security while interacting with the DApp, please set a token allowance for this DApp. The DApp will notify you when its allowance is used up and you can modify the settings again.`}
          </TextS>
        </View>

        <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.inputTitle]}>
          <TextM>{`Set Allowance (${approveParams.approveInfo.symbol})`}</TextM>
          <Touchable onPress={onUseRecommendedValue}>
            <TextM style={FontStyles.font4}> Use Recommended Value</TextM>
          </Touchable>
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
        <TextM style={[FontStyles.font3, GStyles.marginTop(pTd(24))]}>
          {`Please set a reasonable value as the allowance for this DApp. Then you can click "Authorize" to request guardian approval.`}
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
    backgroundColor: defaultColors.bg9,
    ...GStyles.paddingArg(2, 8),
  },
  signTitle: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    textAlign: 'center',
  },
});
