import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { GroupRedPacketTabEnum } from '../types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import SendRedPacketGroupSection, { CryptoValuesType } from '../components/SendRedPacketGroupSection';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import PaymentOverlay from 'components/PaymentOverlay';
import { useCurrentChannelId } from '../context/hooks';
import { useGetRedPackageConfig, useGroupChannelInfo, useSendRedPackage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCalculateRedPacketFee } from 'hooks/useCalculateRedPacketFee';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useGetCAContract } from 'hooks/contract';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { useCheckAllowanceAndApprove, useCheckManagerSyncState } from 'hooks/wallet';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import navigationService from 'utils/navigationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { checkIsUserCancel, handleErrorMessage } from '@portkey-wallet/utils';
import CommonTouchableTabs, { TabItemType } from 'components/CommonTouchableTabs';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { createTimeRecorder } from '@portkey-wallet/utils/timeRecorder';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { TabRouteNameEnum } from 'types/navigate';
import { useGetCryptoGiftConfig, useSendCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { reportEnterSendCryptoGiftPage, reportSendCryptoGiftSuccess } from 'utils/analysisiReport';
import { useEffectOnce } from '@portkey-wallet/hooks';
export interface ISendPacketGroupPageProps {
  isCryptoGift?: boolean;
}
export default function SendPacketGroupPage() {
  const { isCryptoGift } = useRouterParams<ISendPacketGroupPageProps>();
  const currentChannelId = useCurrentChannelId();
  const calculateRedPacketFee = useCalculateRedPacketFee();
  const { groupInfo } = useGroupChannelInfo(isCryptoGift ? '' : currentChannelId || '', true);
  const [selectTab, setSelectTab] = useState<GroupRedPacketTabEnum>(GroupRedPacketTabEnum.Random);
  const sendRedPackage = useSendRedPackage();
  const getCAContract = useGetCAContract();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const checkAllowanceAndApprove = useCheckAllowanceAndApprove();
  const checkManagerSyncState = useCheckManagerSyncState();
  const { getContractAddress } = useGetRedPackageConfig(true);
  const { getCryptoGiftContractAddress } = useGetCryptoGiftConfig();
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const sendCryptoGift = useSendCryptoGift();

  useEffectOnce(() => {
    if (isCryptoGift) reportEnterSendCryptoGiftPage();
  });

  const onPressBtn = useLockCallback(
    async (values: CryptoValuesType) => {
      const { token } = values;

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
        if (isCryptoGift) {
          await PaymentOverlay.showCryptoGift({
            assetInfo: token,
            amount: values.count,
            chainId: token.chainId,
            calculateTransactionFee: () =>
              calculateRedPacketFee({
                symbol: token.symbol,
                chainId: token.chainId,
                decimals: token.decimals,
                count: values.count,
              }),
          });
        } else {
          await PaymentOverlay.showRedPacket({
            assetInfo: token,
            amount: values.count,
            chainId: token.chainId,
            calculateTransactionFee: () =>
              calculateRedPacketFee({
                symbol: token.symbol,
                chainId: token.chainId,
                decimals: token.decimals,
                count: values.count,
              }),
          });
        }
        let redPacketContractAddress;
        if (isCryptoGift) {
          redPacketContractAddress = getCryptoGiftContractAddress(token.chainId);
        } else {
          redPacketContractAddress = getContractAddress(token.chainId);
        }
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
        if (isCryptoGift) {
          const giftId = await sendCryptoGift({
            totalAmount: totalAmount.toFixed(0),
            memo: values.memo,
            caContract: caContract,
            type: selectTab === GroupRedPacketTabEnum.Fixed ? RedPackageTypeEnum.FIXED : RedPackageTypeEnum.RANDOM,
            count: Number(values.packetNum || 1),
            // channelId: currentChannelId || '',
            token,
            isNewUsersOnly: values.isNewUserOnly,
          });
          reportSendCryptoGiftSuccess();
          navigationService.navigate('GiftResult', {
            giftId,
          });
        } else {
          await sendRedPackage({
            totalAmount: totalAmount.toFixed(0),
            memo: values.memo,
            caContract: caContract,
            type: selectTab === GroupRedPacketTabEnum.Fixed ? RedPackageTypeEnum.FIXED : RedPackageTypeEnum.RANDOM,
            count: Number(values.packetNum || 1),
            channelId: currentChannelId || '',
            token,
          });
          CommonToast.success('Sent successfully!');
          navigationService.goBack();
          reportAnalyticsEvent({ page: 'SendPacketGroupPage', time: timeRecorder.endBySecond() }, 'RecordMessage');
        }
      } catch (error) {
        if (isCryptoGift) {
          CommonToast.failError('Create failed. Please click the button below and try again.');
        } else {
          const errorMessage = handleErrorMessage(error);
          if (errorMessage === 'fetch exceed limit') {
            CommonToast.warn('You can view the crypto box you sent later in the chat window.');
            navigationService.navigate('Tab');
            navigationService.navToBottomTab(TabRouteNameEnum.CHAT);
          } else {
            CommonToast.failError('Crypto box failed to be sent. Please try again.');
          }
          reportAnalyticsEvent(
            { page: 'SendPacketGroupPage', time: timeRecorder.endBySecond(), errorMessage },
            'RecordMessage',
          );
        }
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
      getCryptoGiftContractAddress,
      isCryptoGift,
      reportAnalyticsEvent,
      securitySafeCheckAndToast,
      selectTab,
      sendCryptoGift,
      sendRedPackage,
    ],
  );

  const tabList: TabItemType<GroupRedPacketTabEnum>[] = useMemo(
    () => [
      {
        name: GroupRedPacketTabEnum.Random,
        type: GroupRedPacketTabEnum.Random,
        component: (
          <SendRedPacketGroupSection
            key={GroupRedPacketTabEnum.Random}
            type={RedPackageTypeEnum.RANDOM}
            onPressButton={onPressBtn}
            groupMemberCount={groupInfo?.totalCount}
            isCryptoGift={isCryptoGift}
          />
        ),
      },
      {
        name: GroupRedPacketTabEnum.Fixed,
        type: GroupRedPacketTabEnum.Fixed,
        component: (
          <SendRedPacketGroupSection
            key={GroupRedPacketTabEnum.Fixed}
            type={RedPackageTypeEnum.FIXED}
            onPressButton={onPressBtn}
            groupMemberCount={groupInfo?.totalCount}
            isCryptoGift={isCryptoGift}
          />
        ),
      },
    ],
    [groupInfo?.totalCount, isCryptoGift, onPressBtn],
  );

  const onTabPress = useCallback((tabType: GroupRedPacketTabEnum) => {
    setSelectTab(tabType);
  }, []);

  return (
    <PageContainer
      titleDom={isCryptoGift ? 'Create Crypto Gift' : 'Send Crypto Box'}
      hideTouchable
      safeAreaColor={['white', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyles}>
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.scrollStyle}>
        <View style={[GStyles.flexRow, GStyles.alignCenter]}>
          <CommonTouchableTabs
            tabList={tabList}
            onTabPress={onTabPress}
            selectTab={selectTab}
            tabHeaderStyle={styles.tabHeaderStyle}
          />
        </View>
        <View>{tabList.find(item => item.type === selectTab)?.component}</View>
        <TextM style={styles.tips}>
          {`A crypto ${
            isCryptoGift ? 'gift' : 'box'
          } is valid for 24 hours. Unclaimed tokens/NFTs will be automatically returned to you upon expiration.`}
        </TextM>
      </KeyboardAwareScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    position: 'relative',
    flex: 1,
    backgroundColor: defaultColors.neutralDefaultBG,
    ...GStyles.paddingArg(0, 0),
  },
  scrollStyle: {
    minHeight: '100%',
    ...GStyles.paddingArg(16, 16),
  },
  tips: {
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.font3,
    marginBottom: isIOS ? 0 : pTd(16),
  },
  tabHeaderStyle: {
    width: pTd(190),
    marginBottom: pTd(24),
  },
});
