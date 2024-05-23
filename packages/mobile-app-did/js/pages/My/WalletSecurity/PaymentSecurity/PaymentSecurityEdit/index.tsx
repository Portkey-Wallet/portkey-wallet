import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonInput from 'components/CommonInput';
import CommonSwitch from 'components/CommonSwitch';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';

interface RouterParams {
  transferLimitDetail?: ITransferLimitItem;
}

type EditInfoType = {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
};
const MAX_LENGTH = 18;

const PaymentSecurityEdit: React.FC = () => {
  const { transferLimitDetail: detail } = useRouterParams<RouterParams>();
  const [editInfo, setEditInfo] = useState<EditInfoType>();
  const [singleLimitError, setSingleLimitError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const [dailyLimitError, setDailyLimitError] = useState<ErrorType>({ ...INIT_NONE_ERROR });

  const isButtonDisabled = useMemo(() => {
    if (!editInfo?.restricted) return false;
    return !editInfo?.dailyLimit || !editInfo?.singleLimit;
  }, [editInfo?.dailyLimit, editInfo?.restricted, editInfo?.singleLimit]);

  useEffectOnce(() => {
    if (detail) {
      setEditInfo({
        singleLimit: detail.restricted
          ? divDecimals(detail.singleLimit, detail.decimals).toFixed()
          : divDecimals(detail.defaultSingleLimit, detail.decimals).toFixed(),
        dailyLimit: detail.restricted
          ? divDecimals(detail.dailyLimit, detail.decimals).toFixed()
          : divDecimals(detail.defaultDailyLimit, detail.decimals).toFixed(),
        restricted: detail.restricted,
      });
    }
  });

  const maxLength = useMemo(() => MAX_LENGTH - (Number(detail?.decimals) || 0), [detail?.decimals]);

  const onRestrictedChange = useCallback((value: boolean) => {
    setEditInfo(pre => {
      if (!pre) return undefined;
      return {
        ...pre,
        restricted: value,
      };
    });
  }, []);
  const onSingleLimitInput = useCallback((value: string) => {
    setSingleLimitError({
      ...INIT_NONE_ERROR,
    });
    setEditInfo(pre => {
      if (!pre) return undefined;
      return {
        ...pre,
        singleLimit: value,
      };
    });
  }, []);
  const onDailyLimitInput = useCallback((value: string) => {
    setDailyLimitError({
      ...INIT_NONE_ERROR,
    });
    setEditInfo(pre => {
      if (!pre) return undefined;
      return {
        ...pre,
        dailyLimit: value,
      };
    });
  }, []);

  const save = useCallback(() => {
    if (!editInfo) return;
    let isError = false;

    if (editInfo.restricted) {
      if (!isValidInteger(editInfo.singleLimit)) {
        setSingleLimitError({
          ...INIT_HAS_ERROR,
          errorMsg: 'Please enter a positive whole number',
        });
        isError = true;
      }
      if (!isValidInteger(editInfo.dailyLimit)) {
        setDailyLimitError({
          ...INIT_HAS_ERROR,
          errorMsg: 'Please enter a positive whole number',
        });
        isError = true;
      }

      if (!isError && Number(editInfo.singleLimit) > Number(editInfo.dailyLimit)) {
        setSingleLimitError({
          ...INIT_HAS_ERROR,
          errorMsg: 'Cannot exceed the daily limit',
        });
        isError = true;
      }
    }

    if (isError) return;

    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.modifyTransferLimit,
      transferLimitDetail: {
        chainId: detail?.chainId,
        symbol: detail?.symbol,
        singleLimit: editInfo.restricted ? timesDecimals(editInfo.singleLimit, detail?.decimals).toFixed(0) : '-1',
        dailyLimit: editInfo.restricted ? timesDecimals(editInfo.dailyLimit, detail?.decimals).toFixed(0) : '-1',
        restricted: editInfo.restricted,
        decimals: detail?.decimals,
      },
      targetChainId: detail?.chainId,
    });
  }, [detail, editInfo]);

  return (
    <PageContainer
      titleDom={'Transfer Settings'}
      safeAreaColor={['white', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={pageStyles.switchWrap}>
          <TextM>Transfer Settings</TextM>
          <CommonSwitch value={editInfo?.restricted || false} onValueChange={onRestrictedChange} />
        </View>

        {editInfo?.restricted ? (
          <>
            <CommonInput
              label={'Limit per Transaction'}
              theme="white-bg"
              type="general"
              keyboardType={isIOS ? 'number-pad' : 'numeric'}
              value={editInfo?.singleLimit || ''}
              rightIcon={<TextM>{detail?.symbol || ''}</TextM>}
              onChangeText={onSingleLimitInput}
              maxLength={maxLength}
              errorMessage={singleLimitError.isError ? singleLimitError.errorMsg : ''}
            />
            <CommonInput
              label={'Daily Limit'}
              theme="white-bg"
              type="general"
              keyboardType={isIOS ? 'number-pad' : 'numeric'}
              value={editInfo?.dailyLimit || ''}
              rightIcon={<TextM>{detail?.symbol || ''}</TextM>}
              onChangeText={onDailyLimitInput}
              maxLength={maxLength}
              errorMessage={dailyLimitError.isError ? dailyLimitError.errorMsg : ''}
            />
            <TextM style={pageStyles.tipsWrap}>
              {
                'Transfers within the limits do not need approval from guardians. However, if a transfer exceeds these limits, you must either request a one-time approval for that specific transaction or modify the settings beforehand. \nPlease note that settings of the limits will be applied universally to all your token transfers.'
              }
            </TextM>
          </>
        ) : (
          <TextM style={FontStyles.font3}>No limit for transfer</TextM>
        )}
      </View>
      <CommonButton disabled={isButtonDisabled} type="solid" onPress={save}>
        Send Request
      </CommonButton>
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  switchWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  tipsWrap: {
    lineHeight: pTd(20),
    color: defaultColors.font3,
  },
});

export default PaymentSecurityEdit;
