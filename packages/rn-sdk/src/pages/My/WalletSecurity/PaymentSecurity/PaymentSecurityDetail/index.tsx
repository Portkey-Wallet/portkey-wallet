import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
import { ITransferLimitItem } from 'model/security';
import { callGetTransferLimitMethod } from 'model/contract/handler';
import Loading from 'components/Loading';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { PaymentSecurityEditProps } from '../PaymentSecurityEdit';
import { GuardiansApprovalIntent } from 'pages/GuardianManage/GuardianHome';
import CommonToast from 'components/CommonToast';
import { getBottomSpace } from 'utils/screen';

export interface PaymentSecurityDetailProps {
  transferLimitDetail?: ITransferLimitItem;
  containerId?: string;
}

const PaymentSecurityDetail: React.FC = (props: PaymentSecurityDetailProps) => {
  const { transferLimitDetail, containerId } = props;
  const [detail, setDetail] = useState<ITransferLimitItem | undefined>(transferLimitDetail);
  const { navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.PAYMENT_SECURITY_DETAIL_ENTRY,
    onShow: () => {
      getDetail();
    },
    containerId,
  });
  const getDetail = useCallback(async () => {
    if (!transferLimitDetail) return;
    Loading.show();
    const { symbol, chainId } = transferLimitDetail;
    try {
      const { data } = (await callGetTransferLimitMethod(chainId, symbol)) || {};
      if (data) {
        const { dailyLimit } = data || {};
        const parsedLimitNumber: number = typeof dailyLimit === 'string' ? Number(dailyLimit) : dailyLimit;
        setDetail(pre => {
          if (pre) {
            return {
              ...pre,
              ...data,
              // dailyLimit  <= 0 means the rule is disabled
              restricted: parsedLimitNumber >= 0,
            };
          }
          return pre;
        });
      }
    } catch (error) {
      console.log('PaymentSecurityDetail: getTransferLimit error', error);
    }
    Loading.hide();
  }, [transferLimitDetail]);

  const detailFormatted = useMemo(() => {
    if (!detail) return undefined;
    return {
      ...detail,
      singleLimit: divDecimalsToShow(detail.singleLimit, detail.decimals),
      dailyLimit: divDecimalsToShow(detail.dailyLimit, detail.decimals),
    };
  }, [detail]);

  return (
    <PageContainer
      titleDom={'Transfer Settings'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        {detailFormatted?.restricted ? (
          <>
            <View style={pageStyles.labelWrap}>
              <TextM>Limit per Transaction</TextM>
              <TextM style={FontStyles.font3}>{`${detailFormatted?.singleLimit || ''} ${
                detailFormatted?.symbol || ''
              }`}</TextM>
            </View>
            <View style={pageStyles.labelWrap}>
              <TextM>Daily Limit</TextM>
              <TextM style={FontStyles.font3}>{`${detailFormatted?.dailyLimit || ''} ${
                detailFormatted?.symbol || ''
              }`}</TextM>
            </View>
            <TextM style={FontStyles.font3}>
              {
                'Transfers exceeding the limits cannot be conducted unless you modify the limit settings first, which needs guardian approval.'
              }
            </TextM>
          </>
        ) : (
          <>
            <View style={pageStyles.labelWrap}>
              <TextM>Transfer Settings</TextM>
              <TextM style={FontStyles.font3}>Off</TextM>
            </View>
            <TextM style={FontStyles.font3}>{'No limit for transfer'}</TextM>
          </>
        )}
      </View>
      <CommonButton
        style={pageStyles.editButton}
        type="solid"
        onPress={() => {
          navigateForResult<GuardiansApprovalIntent, PaymentSecurityEditProps>(
            PortkeyEntries.PAYMENT_SECURITY_EDIT_ENTRY,
            {
              params: {
                transferLimitDetail: detail,
              },
            },
            intent => {
              const { status } = intent;
              if (status === 'success') {
                CommonToast.success('edit success');
              }
            },
          );
        }}>
        Edit
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
  labelWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    height: pTd(56),
    alignItems: 'center',
    borderRadius: pTd(6),
  },
  editButton: {
    marginBottom: getBottomSpace(),
  },
});

export default PaymentSecurityDetail;
