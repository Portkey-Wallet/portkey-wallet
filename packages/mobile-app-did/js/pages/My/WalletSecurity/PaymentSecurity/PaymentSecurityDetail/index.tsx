import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';

import { IPaymentSecurityItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import { RouteProp, useRoute } from '@react-navigation/native';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';

interface RouterParams {
  paymentSecurityDetail?: IPaymentSecurityItem;
}

const PaymentSecurityDetail: React.FC = () => {
  const { params } = useRoute<RouteProp<{ params: RouterParams }>>();

  const detail = useMemo(() => {
    const paymentSecurityDetail = params.paymentSecurityDetail;
    if (!paymentSecurityDetail) return undefined;
    return {
      ...paymentSecurityDetail,
      singleLimit: divDecimalsStr(paymentSecurityDetail.singleLimit, paymentSecurityDetail.decimals),
      dailyLimit: divDecimalsStr(paymentSecurityDetail.dailyLimit, paymentSecurityDetail.decimals),
    };
  }, [params.paymentSecurityDetail]);

  return (
    <PageContainer
      titleDom={'Transfer Settings'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        {detail?.restricted ? (
          <>
            <View style={pageStyles.labelWrap}>
              <TextM>Limit per Transaction</TextM>
              <TextM style={FontStyles.font3}>{`${detail?.singleLimit || ''} ${detail?.symbol || ''}`}</TextM>
            </View>
            <View style={pageStyles.labelWrap}>
              <TextM>Daily Limit</TextM>
              <TextM style={FontStyles.font3}>{`${detail?.dailyLimit || ''} ${detail?.symbol || ''}`}</TextM>
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
            <TextM style={FontStyles.font3}>{'No limit for transfer.'}</TextM>
          </>
        )}
      </View>
      <CommonButton
        type="solid"
        onPress={() => {
          navigationService.navigate('PaymentSecurityEdit', {
            paymentSecurityDetail: params.paymentSecurityDetail,
          });
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
    ...GStyles.paddingArg(24, 20, 18),
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
});

export default PaymentSecurityDetail;
