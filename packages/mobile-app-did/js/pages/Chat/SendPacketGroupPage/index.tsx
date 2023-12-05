import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import { GroupRedPacketTabEnum } from '../types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import SendRedPacketGroupSection, { ValuesType } from '../components/SendRedPacketGroupSection';
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
import { checkIsUserCancel } from '@portkey-wallet/utils';

type TabItemType = {
  name: string;
  type: GroupRedPacketTabEnum;
  component: JSX.Element;
};

export default function SendPacketGroupPage() {
  const currentChannelId = useCurrentChannelId();
  const calculateRedPacketFee = useCalculateRedPacketFee();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', true);
  const [selectTab, setSelectTab] = useState<GroupRedPacketTabEnum>(GroupRedPacketTabEnum.Random);
  const sendRedPackage = useSendRedPackage();
  const getCAContract = useGetCAContract();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();
  const checkAllowanceAndApprove = useCheckAllowanceAndApprove();
  const checkManagerSyncState = useCheckManagerSyncState();
  const { getContractAddress } = useGetRedPackageConfig(true);

  const onPressBtn = useCallback(
    async (values: ValuesType) => {
      Loading.show();
      try {
        const isManagerSynced = await checkManagerSyncState(values.chainId);
        if (!isManagerSynced) {
          CommonToast.warn('Synchronizing on-chain account information...');
          return;
        }
        const isSafe = await securitySafeCheckAndToast(values.chainId);
        if (!isSafe) return;
      } catch (error) {
        CommonToast.failError(error);
        return;
      } finally {
        Loading.hide();
      }

      const totalAmount = timesDecimals(values.count, values.decimals);
      let caContract: ContractBasic;

      try {
        await PaymentOverlay.showRedPacket({
          tokenInfo: {
            symbol: values.symbol,
            decimals: values.decimals,
          },
          amount: values.count,
          chainId: values.chainId,
          calculateTransactionFee: () => calculateRedPacketFee(values),
        });

        const redPacketContractAddress = getContractAddress(values.chainId);
        if (!redPacketContractAddress) {
          throw new Error('redPacketContractAddress is not exist');
        }

        caContract = await getCAContract(values.chainId);

        await checkAllowanceAndApprove({
          caContract,
          spender: redPacketContractAddress,
          bigAmount: totalAmount,
          ...values,
          decimals: Number(values.decimals),
          isShowOnceLoading: true,
        });
      } catch (error) {
        console.log(error, 'send check ====error');
        if (!checkIsUserCancel(error)) {
          CommonToast.failError('Sent failed!');
        }
        Loading.hide();
        return;
      }

      Loading.showOnce();
      try {
        await sendRedPackage({
          chainId: values.chainId,
          symbol: values.symbol,
          totalAmount: totalAmount.toFixed(0),
          decimal: values.decimals,
          memo: values.memo,
          caContract: caContract,
          type: selectTab === GroupRedPacketTabEnum.Fixed ? RedPackageTypeEnum.FIXED : RedPackageTypeEnum.RANDOM,
          count: Number(values.packetNum || 1),
          channelId: currentChannelId || '',
        });
        CommonToast.success('Sent successfully!');
        navigationService.goBack();
      } catch (error) {
        console.log(error, 'sendRedPackage ====error');
        CommonToast.failError('Sent failed!');
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
      securitySafeCheckAndToast,
      selectTab,
      sendRedPackage,
    ],
  );

  const tabList: TabItemType[] = useMemo(
    () => [
      {
        name: GroupRedPacketTabEnum.Random,
        type: GroupRedPacketTabEnum.Random,
        component: (
          <SendRedPacketGroupSection
            key={GroupRedPacketTabEnum.Random}
            type={RedPackageTypeEnum.RANDOM}
            onPressButton={onPressBtn}
            groupMemberCount={groupInfo?.members?.length}
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
            groupMemberCount={groupInfo?.members?.length}
          />
        ),
      },
    ],
    [groupInfo?.members?.length, onPressBtn],
  );

  const onTabPress = useCallback((tabType: GroupRedPacketTabEnum) => {
    setSelectTab(tabType);
  }, []);

  return (
    <PageContainer
      titleDom="Send Crypto Box"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyles}>
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.scrollStyle}>
        <View style={[GStyles.flexRow, GStyles.alignCenter]}>
          <View style={styles.tabHeader}>
            {tabList.map(tabItem => (
              <TouchableOpacity
                key={tabItem.name}
                onPress={() => {
                  onTabPress(tabItem.type);
                }}>
                <View style={[styles.tabWrap, selectTab === tabItem.type && styles.selectTabStyle]}>
                  <TextM style={[FontStyles.font7, selectTab === tabItem.type && styles.selectTabTextStyle]}>
                    {tabItem.name}
                  </TextM>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={GStyles.flex1}>{tabList.find(item => item.type === selectTab)?.component}</View>
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
  containerStyles: {
    position: 'relative',
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(0, 0),
  },
  scrollStyle: {
    minHeight: '100%',
    ...GStyles.paddingArg(16, 20),
  },
  tabHeader: {
    width: pTd(190),
    backgroundColor: defaultColors.bg18,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
    marginBottom: pTd(32),
  },
  tabWrap: {
    width: pTd(88),
    height: pTd(30),
    borderRadius: pTd(6),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectTabStyle: {
    shadowColor: defaultColors.shadow1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: defaultColors.bg1,
  },
  selectTabTextStyle: {
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  tips: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font3,
    marginBottom: isIOS ? 0 : pTd(16),
  },
});
