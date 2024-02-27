import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection, { CryptoValuesType } from '../components/SendRedPacketGroupSection';
import { TextM } from 'components/CommonText';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import PaymentOverlay from 'components/PaymentOverlay';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCheckAllowanceAndApprove } from 'hooks/wallet';
import { useCalculateRedPacketFee } from 'hooks/useCalculateRedPacketFee';
import { useGetRedPackageConfig, useSendRedPackage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useGetCAContract } from 'hooks/contract';
import { useCurrentChannelId } from '../context/hooks';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import navigationService from 'utils/navigationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { checkIsUserCancel, handleErrorMessage } from '@portkey-wallet/utils';
import myEvents from 'utils/deviceEvent';
import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { createTimeRecorder } from '@portkey-wallet/utils/timeRecorder';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export default function SendPacketP2PPage() {
  const currentChannelId = useCurrentChannelId();
  const calculateRedPacketFee = useCalculateRedPacketFee();
  const sendRedPackage = useSendRedPackage();
  const getCAContract = useGetCAContract();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const checkAllowanceAndApprove = useCheckAllowanceAndApprove();
  const checkManagerSyncState = useCheckManagerSyncState();
  const { getContractAddress } = useGetRedPackageConfig(true);
  const [, resetOverlayCount] = useState(0);
  const reportAnalyticsEvent = useReportAnalyticsEvent();

  const onPressBtn = useLockCallback(
    async (values: CryptoValuesType) => {
      const { token, count } = values;

      Loading.show();
      try {
        const isManagerSynced = await checkManagerSyncState(token.chainId);
        if (!isManagerSynced) {
          CommonToast.warn('Synchronizing on-chain account information...');
          return;
        }
        const isSafe = await securitySafeCheckAndToast(token.chainId);
        if (!isSafe) return;
      } catch (error) {
        CommonToast.failError(error);
        return;
      } finally {
        Loading.hide();
      }

      const totalAmount = timesDecimals(values.count, token.decimals);
      let caContract: ContractBasic;
      try {
        await PaymentOverlay.showRedPacket({
          assetInfo: token,
          amount: values.count,
          chainId: token.chainId,
          calculateTransactionFee: () =>
            calculateRedPacketFee({
              symbol: token.symbol,
              chainId: token.chainId,
              decimals: token.decimals,
              count: count,
            }),
        });

        const redPacketContractAddress = getContractAddress(token.chainId);
        if (!redPacketContractAddress) {
          throw new Error('redPacketContractAddress is not exist');
        }

        caContract = await getCAContract(token.chainId);

        await checkAllowanceAndApprove({
          caContract,
          spender: redPacketContractAddress,
          bigAmount: totalAmount,
          symbol: token.symbol,
          chainId: token.chainId,
          decimals: Number(token.decimals),
          isShowOnceLoading: true,
          alias: token.alias,
        });
      } catch (error) {
        console.log(error, 'send check ====error');
        if (!checkIsUserCancel(error)) {
          CommonToast.failError('Crypto box failed to be sent. Please try again.');
        }
        Loading.hide();
        return;
      }

      Loading.showOnce();
      const timeRecorder = createTimeRecorder();
      try {
        await sendRedPackage({
          totalAmount: totalAmount.toFixed(0),
          memo: values.memo,
          caContract: caContract,
          type: RedPackageTypeEnum.P2P,
          count: 1,
          channelId: currentChannelId || '',
          token,
        });
        reportAnalyticsEvent({ page: 'SendPacketP2PPage', time: timeRecorder.endBySecond() }, 'RecordMessage');
        CommonToast.success('Sent successfully!');
        navigationService.goBack();
      } catch (error) {
        const errorMessage = handleErrorMessage(error);
        if (errorMessage === 'fetch exceed limit') {
          CommonToast.warn('You can view the crypto box you sent later in the chat window.');
          navigationService.navigate('Tab');
          myEvents.navToBottomTab.emit({ tabName: ChatTabName });
        } else {
          CommonToast.failError('Crypto box failed to be sent. Please try again.');
        }
        reportAnalyticsEvent(
          { page: 'SendPacketP2PPage', time: timeRecorder.endBySecond(), errorMessage },
          'RecordMessage',
        );
      } finally {
        Loading.hide();
      }
    },
    [
      calculateRedPacketFee,
      checkAllowanceAndApprove,
      checkManagerSyncState,
      currentChannelId,
      getCAContract,
      getContractAddress,
      reportAnalyticsEvent,
      securitySafeCheckAndToast,
      sendRedPackage,
    ],
  );

  return (
    <PageContainer
      titleDom="Send Crypto Box"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.scrollStyle}>
        <SendRedPacketGroupSection type={RedPackageTypeEnum.P2P} onPressButton={onPressBtn} />
        <View style={GStyles.flex1} onLayout={() => resetOverlayCount(p => p + 1)} />
        <TextM style={styles.tips}>
          {
            'A crypto box is valid for 24 hours. Unclaimed tokens will be automatically returned to you upon expiration.'
          }
        </TextM>
      </KeyboardAwareScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(8, 0, 0),
  },
  scrollStyle: {
    minHeight: '100%',
    ...GStyles.paddingArg(16, 20),
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
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font3,
    marginBottom: isIOS ? 0 : pTd(16),
  },
});
