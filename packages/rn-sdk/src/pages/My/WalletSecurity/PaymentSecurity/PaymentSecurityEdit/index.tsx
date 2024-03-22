import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonInput from '@portkey-wallet/rn-components/components/CommonInput';
import CommonSwitch from '@portkey-wallet/rn-components/components/CommonSwitch';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { ITransferLimitItem } from 'model/security';
import { handleGuardiansApproval } from 'model/verify/entry/hooks';
import { GuardianVerifyType } from 'model/verify/social-recovery';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { getBottomSpace } from 'utils/screen';

export interface PaymentSecurityEditProps {
  transferLimitDetail?: ITransferLimitItem;
}

type EditInfoType = {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
};
const MAX_LENGTH = 18;

const PaymentSecurityEdit: React.FC = (props: PaymentSecurityEditProps) => {
  const { transferLimitDetail: detail } = props;
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

    if (isError || !detail) return;

    handleGuardiansApproval({
      guardianVerifyType: GuardianVerifyType.EDIT_PAYMENT_SECURITY,
      guardians: [],
      paymentSecurityConfig: {
        chainId: detail.chainId,
        symbol: detail.symbol,
        singleLimit: editInfo.restricted ? timesDecimals(editInfo.singleLimit, detail?.decimals).toFixed(0) : '-1',
        dailyLimit: editInfo.restricted ? timesDecimals(editInfo.dailyLimit, detail?.decimals).toFixed(0) : '-1',
        restricted: editInfo.restricted,
        decimals: detail.decimals,
      },
      failHandler: option => {
        const { errorMessage } = option || {};
        CommonToast.fail(errorMessage ?? 'edit failed');
      },
    });
  }, [detail, editInfo]);

  return (
    <PageContainer
      titleDom={'Transfer Settings'}
      safeAreaColor={['blue', 'gray']}
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
            <TextM style={FontStyles.font3}>
              {
                'Transfers exceeding the limits cannot be conducted unless you modify the limit settings first, which needs guardian approval.'
              }
            </TextM>
          </>
        ) : (
          <TextM style={FontStyles.font3}>No limit for transfer</TextM>
        )}
      </View>
      <CommonButton style={pageStyles.bottomButton} disabled={isButtonDisabled} type="solid" onPress={save}>
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
    ...GStyles.paddingArg(24, 20, 22),
    display: 'flex',
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
  bottomButton: {
    marginBottom: getBottomSpace(),
  },
});

export default PaymentSecurityEdit;
