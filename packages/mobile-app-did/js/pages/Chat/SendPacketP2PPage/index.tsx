import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection, { ValuesType } from '../components/SendRedPacketGroupSection';
import { TextM } from 'components/CommonText';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import PaymentOverlay from 'components/PaymentOverlay';
import { useCalculateRedPackageFee } from 'hooks/useCalculateRedPackageFee';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCheckAllowanceAndApprove } from 'hooks/wallet';
const SendPacketP2PPage = () => {
  const calculateRedPackageFee = useCalculateRedPackageFee();
  const checkAllowanceAndApprove = useCheckAllowanceAndApprove();
  const onPressBtn = useCallback(
    async (values: ValuesType) => {
      try {
        await PaymentOverlay.showRedPacket({
          tokenInfo: {
            symbol: values.symbol,
            decimals: values.decimals,
          },
          amount: values.count,
          chainId: values.chainId,
          calculateTransactionFee: () => calculateRedPackageFee(values),
        });

        const redPacketContractAddress = '2sFCkQs61YKVkHpN3AT7887CLfMvzzXnMkNYYM431RK5tbKQS9';

        const approved = await checkAllowanceAndApprove({
          spender: redPacketContractAddress,
          bigAmount: timesDecimals(values.count, values.decimals),
          ...values,
          decimals: Number(values.decimals),
        });
        console.log(approved, '====approved');
      } catch (error) {
        console.log(error, '====error');
      }
    },
    [calculateRedPackageFee, checkAllowanceAndApprove],
  );

  return (
    <PageContainer
      titleDom="Send Red Packet"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: false }}
      containerStyles={styles.container}>
      <SendRedPacketGroupSection type={RedPackageTypeEnum.P2P} onPressButton={onPressBtn} />
      <View style={GStyles.flex1} />
      <TextM style={styles.tips}>
        Red Packet is valid for 24 hours. Expired Red Packet will be refunded to you within 24 hours after expiration.
      </TextM>
    </PageContainer>
  );
};

export default SendPacketP2PPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    minHeight: '100%',
    ...GStyles.paddingArg(24, 20),
  },
  groupNameWrap: {
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginHorizontal: pTd(20),
    marginVertical: pTd(24),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  selectHeaderWrap: {
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  inputWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(8),
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.paddingArg(10, 20, 16),
    backgroundColor: defaultColors.bg1,
  },
  nameInputStyle: {
    fontSize: pTd(16),
  },
  nameInputContainerStyle: {
    flex: 1,
  },
  nameInputErrorStyle: {
    height: 0,
    padding: 0,
    margin: 0,
  },
  tips: {
    textAlign: 'center',
    color: defaultColors.font3,
  },
});
