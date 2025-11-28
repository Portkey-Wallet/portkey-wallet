import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import CommonButton from 'components/CommonButton';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import React, { useCallback } from 'react';
import ActionSheet from 'components/ActionSheet';
import { CrossChainTransferParamsType, intervalCrossChainTransfer } from 'utils/transfer/crossChainTransfer';
import Loading from 'components/Loading';
import { useGetTokenContract } from 'hooks/contract';
import { useAppDispatch } from 'store/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import CommonToast from 'components/CommonToast';

interface IResendProps {
  item?: ActivityItemType;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
}

export const Resend = ({ item, containerStyle, buttonStyle, titleStyle }: IResendProps) => {
  const activity = useAppCASelector(state => state.activity);
  const getTokenContract = useGetTokenContract();
  const dispatch = useAppDispatch();

  const showRetry = useCallback((retryFunc: () => void) => {
    ActionSheet.alert({
      title: 'Transaction failed !',
      buttons: [
        {
          title: 'Resend',
          type: 'solid',
          onPress: () => {
            retryFunc();
          },
        },
      ],
    });
  }, []);

  const retryCrossChain = useCallback(
    async (managerTransferTxId: string, data: CrossChainTransferParamsType & { issueChainId: number }) => {
      Loading.show();
      try {
        const tokenContract = await getTokenContract(data.tokenInfo.chainId);
        await intervalCrossChainTransfer(tokenContract, data);
        dispatch(removeFailedActivity(managerTransferTxId));
        CommonToast.success('success');
      } catch (error) {
        showRetry(() => {
          retryCrossChain(managerTransferTxId, data);
        });
      }
      Loading.hide();
    },
    [dispatch, getTokenContract, showRetry],
  );

  const onResend = useCallback(() => {
    const { params } = activity.failedActivityMap[item?.transactionId || ''];
    retryCrossChain(item?.transactionId || '', params);
  }, [activity.failedActivityMap, item?.transactionId, retryCrossChain]);

  return activity.failedActivityMap[item?.transactionId || ''] ? (
    <View style={[itemStyle.btnWrap, containerStyle]}>
      <CommonButton
        title="Resend"
        type="primary"
        buttonStyle={[itemStyle.resendWrap, buttonStyle]}
        titleStyle={[itemStyle.resendTitle, titleStyle]}
        onPress={onResend}
      />
    </View>
  ) : null;
};

const itemStyle = StyleSheet.create({
  btnWrap: {
    marginLeft: pTd(40),
  },
  resendWrap: {
    height: pTd(24),
    width: pTd(65),
    padding: 0,
  },
  resendTitle: {
    fontSize: pTd(12),
  },
});
