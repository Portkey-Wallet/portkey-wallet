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
import { useCurrentChain, useGetChainInfo } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { usePin } from 'hooks/store';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getManagerAccount } from 'utils/redux';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import PaymentOverlay from 'components/PaymentOverlay';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCurrentChannelId } from '../context/hooks';
import { useGroupChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';

type TabItemType = {
  name: string;
  type: GroupRedPacketTabEnum;
  component: JSX.Element;
};

export default function SendPacketGroupPage() {
  // TODO: should init
  const currentChannelId = useCurrentChannelId();
  const { groupInfo } = useGroupChannelInfo(currentChannelId || '', true);
  const pin = usePin();
  const onPressBtn = useCallback(async (values: ValuesType) => {
    try {
      const req = await PaymentOverlay.showRedPacket({
        tokenInfo: {
          symbol: 'ELF',
          decimals: 8,
        },
        amount: timesDecimals(values.count, values.decimals).toFixed(),
        chainId: 'AELF',
        calculateTransactionFee: async () => {
          return {} as any;
        },
      });
      console.log(req, '====req');
    } catch (error) {
      console.log(error, '====error');
    }
  }, []);

  const [selectTab, setSelectTab] = useState<GroupRedPacketTabEnum>(GroupRedPacketTabEnum.Random);

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
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: true }}
      hideTouchable={true}
      containerStyles={styles.containerStyles}
      titleDom="Send Red Packet">
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
      <TextM style={styles.tips}>Red Packets not opened within 24 hours will be refunded. </TextM>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: { ...GStyles.paddingArg(16, 20), flex: 1, backgroundColor: defaultColors.bg6 },

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
    textAlign: 'center',
    color: defaultColors.font3,
  },
});
