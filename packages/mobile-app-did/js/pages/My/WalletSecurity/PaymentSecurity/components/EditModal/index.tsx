import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import OverlayModal from 'components/OverlayModal';
import { View } from 'react-native';
import CommonInput from 'components/CommonInput';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React, { useCallback, useMemo, useState } from 'react';
import CommonButton from 'components/CommonButton';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import useEffectOnce from 'hooks/useEffectOnce';
import { INIT_HAS_ERROR, INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import navigationService from 'utils/navigationService';
import { isValidInteger } from '@portkey-wallet/utils/reg';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import { makeStyles, useTheme } from '@rneui/themed';

interface IProps {
  detail?: ITransferLimitItem | undefined;
}

type EditInfoType = {
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
};
const MAX_LENGTH = 18;
const EditModal: React.FC<IProps> = ({ detail }: IProps) => {
  const { t } = useLanguage();
  const pageStyles = getStyles();
  const { theme } = useTheme();
  const [editInfo, setEditInfo] = useState<EditInfoType>();
  const [singleLimitError, setSingleLimitError] = useState<ErrorType>({ ...INIT_NONE_ERROR });
  const [dailyLimitError, setDailyLimitError] = useState<ErrorType>({ ...INIT_NONE_ERROR });

  useEffectOnce(() => {
    if (detail) {
      setEditInfo({
        singleLimit: detail.restricted ? divDecimals(detail.singleLimit, detail.decimals).toFixed() : '',
        dailyLimit: detail.restricted ? divDecimals(detail.dailyLimit, detail.decimals).toFixed() : '',
        restricted: detail.restricted,
      });
    }
  });

  const maxLength = useMemo(() => MAX_LENGTH - (Number(detail?.decimals) || 0), [detail?.decimals]);

  const onSingleLimitInput = useCallback((value: string) => {
    setSingleLimitError({
      ...INIT_NONE_ERROR,
    });
    setEditInfo(pre => {
      if (!pre) {
        return undefined;
      }
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
      if (!pre) {
        return undefined;
      }
      return {
        ...pre,
        dailyLimit: value,
      };
    });
  }, []);

  const save = useCallback(() => {
    if (!editInfo) {
      return;
    }
    let isError = false;

    // if (editInfo.restricted) {
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
    // }

    if (isError) {
      return;
    }
    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.modifyTransferLimit,
      transferLimitDetail: {
        chainId: detail?.chainId,
        symbol: detail?.symbol,
        singleLimit: timesDecimals(editInfo.singleLimit, detail?.decimals).toFixed(0),
        dailyLimit: timesDecimals(editInfo.dailyLimit, detail?.decimals).toFixed(0),
        restricted: true,
        decimals: detail?.decimals,
      },
      targetChainId: detail?.chainId,
    });
    OverlayModal.hide();
  }, [detail, editInfo]);

  const [isInputing, setIsInputing] = useState(false);

  return (
    <View>
      <ModalBody
        title={t(`${detail?.restricted ? 'Edit' : 'Set'} transaction limits`)}
        modalBodyType="bottom"
        style={isInputing && { minHeight: pTd(576) }}>
        {/* <KeyboardSafeArea bottomPad={pTd(16)}> */}
        <View style={pageStyles.container}>
          <TextM style={pageStyles.title}>{t('Limit per Transaction')}</TextM>
          <CommonInput
            type="general"
            keyboardType={isIOS ? 'number-pad' : 'numeric'}
            value={editInfo?.singleLimit || ''}
            rightIcon={
              <View style={pageStyles.rightIconContainer}>
                <Touchable onPress={() => onSingleLimitInput('')} style={{ marginRight: pTd(8) }}>
                  <Svg icon="clear4" size={pTd(16)} />
                </Touchable>
                <TextM style={{ color: theme.colors.textBase2 }}>{detail?.symbol}</TextM>
              </View>
            }
            onChangeText={onSingleLimitInput}
            maxLength={maxLength}
            errorMessage={singleLimitError.isError ? singleLimitError.errorMsg : ''}
            onFocus={() => setIsInputing(true)}
            onBlur={() => setIsInputing(false)}
          />
          <TextM style={pageStyles.title}>{t('Daily limit')}</TextM>
          <CommonInput
            type="general"
            rightIcon={
              <View style={pageStyles.rightIconContainer}>
                <Touchable onPress={() => onDailyLimitInput('')} style={{ marginRight: pTd(8) }}>
                  <Svg icon="clear4" size={pTd(16)} />
                </Touchable>
                <TextM style={{ color: theme.colors.textBase2 }}>{detail?.symbol}</TextM>
              </View>
            }
            keyboardType={isIOS ? 'number-pad' : 'numeric'}
            value={editInfo?.dailyLimit || ''}
            onChangeText={onDailyLimitInput}
            maxLength={maxLength}
            errorMessage={dailyLimitError.isError ? dailyLimitError.errorMsg : ''}
            onFocus={() => setIsInputing(true)}
            onBlur={() => setIsInputing(false)}
          />
          <CommonButton type="primary" style={pageStyles.button} onPress={save}>
            Verify with guardian
          </CommonButton>
        </View>
        {/* </KeyboardSafeArea> */}
      </ModalBody>
    </View>
  );
};
const getStyles = makeStyles(() => ({
  container: {
    paddingVertical: pTd(16),
    paddingHorizontal: pTd(16),
  },
  title: {
    marginBottom: pTd(8),
  },
  rightIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {},
}));

export default EditModal;
