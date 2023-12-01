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
import { useCalculateRedPacketFee } from 'hooks/useCalculateRedPacketFee';
import { useSendRedPackage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useGetCAContract } from 'hooks/contract';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCurrentChannelId } from '../context/hooks';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';

export default function SendPacketP2PPage() {
  const currentChannelId = useCurrentChannelId();
  const calculateRedPacketFee = useCalculateRedPacketFee();
  const sendRedPackage = useSendRedPackage();
  const getCAContract = useGetCAContract();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const onPressBtn = useCallback(
    async (values: ValuesType) => {
      try {
        Loading.show();
        try {
          const isSafe = await securitySafeCheckAndToast(values.chainId);
          if (!isSafe) return;
        } catch (error) {
          CommonToast.failError(error);
          return;
        } finally {
          Loading.hide();
        }

        await PaymentOverlay.showRedPacket({
          tokenInfo: {
            symbol: values.symbol,
            decimals: values.decimals,
          },
          amount: values.count,
          chainId: values.chainId,
          calculateTransactionFee: () => calculateRedPacketFee(values),
        });

        const caContract = await getCAContract(values.chainId);
        await sendRedPackage({
          chainId: values.chainId,
          symbol: values.symbol,
          totalAmount: timesDecimals(values.count, values.decimals).toFixed(),
          decimal: values.decimals,
          memo: values.memo,
          caContract: caContract,
          type: RedPackageTypeEnum.P2P,
          count: 1,
          channelId: currentChannelId || '',
        });
      } catch (error) {
        console.log(error, '====error');
      }
    },
    [calculateRedPacketFee, currentChannelId, getCAContract, sendRedPackage],
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
}

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
