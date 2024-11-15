import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { View } from 'react-native';
import { GroupRedPacketTabEnum } from '../types';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection, { CryptoValuesType } from '../components/SendRedPacketGroupSection';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import { useCurrentChannelId } from '../context/hooks';
import { useGetRedPackageConfig, useGroupChannelInfo, useSendRedPackage } from '@portkey-wallet/hooks/hooks-ca/im';
import { useCalculateRedPacketFee } from 'hooks/useCalculateRedPacketFee';
import { useGetCAContract } from 'hooks/contract';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { useCheckAllowanceAndApprove, useCheckManagerSyncState } from 'hooks/wallet';
import navigationService from 'utils/navigationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import CommonTouchableTabs, { TabItemType } from 'components/CommonTouchableTabs';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useGetCryptoGiftConfig, useSendCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { reportEnterSendCryptoGiftPage } from 'utils/analysisiReport';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import CommonTooltip from 'components/CommonTooltip';
export interface ISendPacketGroupPageProps {
  isCryptoGift?: boolean;
}
export default function SendPacketGroupPage() {
  const styles = getStyles();
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
    if (isCryptoGift) {
      reportEnterSendCryptoGiftPage();
    }
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
        if (!isSafe) {
          return;
        }
      } catch (error) {
        CommonToast.failError(error);
        return;
      } finally {
        Loading.hide();
      }
      const fee = await calculateRedPacketFee({
        symbol: token.symbol,
        chainId: token.chainId,
        decimals: token.decimals,
        count: values.count,
      });
      navigationService.navigate('SendRedPacketPreview', {
        assetInfo: token,
        fee,
        values,
        selectTab,
      });
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
      titleDom={'Create Crypto Gift'}
      hideTouchable
      scrollViewProps={{ disabled: true }}
      rightDom={
        <CommonTooltip
          iconStyle={{ marginRight: pTd(16) }}
          iconName="help-white"
          iconSize={pTd(24)}
          tooltipProps={{
            title: 'About crypto gift',
            description: `Crypto Gift lets Portkey users send crypto assets as gifts.

To get started, click "Create crypto gift" to choose the asset, quantity, and claim requirements. After sending, share the generated gift link with friends.

To claim, click the link, log in to your Portkey account, and verify eligibility. Gifts are valid for 24 hours, and unclaimed tokens or NFTs are returned to you afterward.`,
          }}
        />
      }
      containerStyles={styles.containerStyles}>
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.scrollStyle}>
        <View style={[GStyles.flexRow, GStyles.alignCenter]}>
          <CommonTouchableTabs
            tabList={tabList}
            onTabPress={onTabPress}
            selectTab={selectTab}
            tabHeaderStyle={styles.tabHeaderStyle}
            tabWrapStyle={styles.tabWrapStyle}
            tabTextStyle={styles.tabTextStyle}
            selectTabTextStyle={styles.selectTabTextStyle}
          />
        </View>
        <View>{tabList.find(item => item.type === selectTab)?.component}</View>
      </KeyboardAwareScrollView>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    position: 'relative',
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(0, 0),
  },
  scrollStyle: {
    minHeight: '100%',
    ...GStyles.paddingArg(16, 16),
  },
  tips: {
    marginTop: pTd(24),
    textAlign: 'center',
    color: theme.colors.textBase3,
    marginBottom: isIOS ? 0 : pTd(16),
  },
  tabHeaderStyle: {
    width: '100%',
    height: pTd(38),
    alignItems: 'center',
    marginBottom: pTd(16),
    borderRadius: pTd(8),
    borderColor: theme.colors.textBase3,
    borderWidth: pTd(1),
  },
  tabWrapStyle: {
    flex: 1,
    marginLeft: pTd(0),
    justifyContent: 'center',
  },
  tabTextStyle: {
    textAlign: 'center',
  },
  selectTabTextStyle: {
    color: theme.colors.textBase1,
    ...fonts.regularFont,
  },
}));
