import React, { useCallback, useMemo, useRef, useState } from 'react';
import PageContainer from '@portkey-wallet/rn-components/components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';

import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useFocusEffect, useRoute, RouteProp } from '@portkey-wallet/rn-inject-sdk';
import { divDecimalsToShow } from '@portkey-wallet/utils/converter';
import { useGetTransferLimit } from '@portkey-wallet/hooks/hooks-ca/security';
import { useLatestRef } from '@portkey-wallet/hooks';
import { useGetCurrentCAContract } from '@portkey-wallet/rn-base/hooks/contract';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';

interface RouterParams {
  transferLimitDetail?: ITransferLimitItem;
}

const PaymentSecurityDetail: React.FC = () => {
  const {
    params: { transferLimitDetail },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
  const [detail, setDetail] = useState<ITransferLimitItem | undefined>(transferLimitDetail);

  const getCurrentCAContract = useGetCurrentCAContract(transferLimitDetail?.chainId);
  const getTransferLimit = useGetTransferLimit();

  const caContractRef = useRef<ContractBasic>();
  const getDetail = useCallback(async () => {
    if (!caContractRef.current) {
      try {
        caContractRef.current = await getCurrentCAContract();
      } catch (error) {
        console.log('PaymentSecurityDetail: caContract error');
        return;
      }
    }

    const caContract = caContractRef.current;
    try {
      const result = await getTransferLimit({
        caContract,
        symbol: transferLimitDetail?.symbol || '',
      });
      if (result) {
        setDetail(pre => {
          if (pre) {
            return {
              ...pre,
              ...result,
            };
          }
          return pre;
        });
      }
    } catch (error) {
      console.log('PaymentSecurityDetail: getTransferLimit error');
    }
  }, [getCurrentCAContract, getTransferLimit, transferLimitDetail?.symbol]);
  const getDetailRef = useLatestRef(getDetail);

  useFocusEffect(
    useCallback(() => {
      getDetailRef.current();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
        type="solid"
        onPress={() => {
          navigationService.navigate('PaymentSecurityEdit', {
            transferLimitDetail: detail,
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
