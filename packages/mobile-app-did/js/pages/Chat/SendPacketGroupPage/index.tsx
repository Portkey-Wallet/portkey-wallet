import React, { useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import { GroupRedPacketTabEnum } from '../types';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { TextM } from 'components/CommonText';
import SendRedPacketGroupSection from '../components/SendRedPacketGroupSection';

type TabItemType = {
  name: string;
  type: GroupRedPacketTabEnum;
  component: JSX.Element;
};

const tabList: TabItemType[] = [
  {
    name: GroupRedPacketTabEnum.Random,
    type: GroupRedPacketTabEnum.Random,
    component: <SendRedPacketGroupSection key={GroupRedPacketTabEnum.Random} />,
  },
  {
    name: GroupRedPacketTabEnum.Fixed,
    type: GroupRedPacketTabEnum.Fixed,
    component: <SendRedPacketGroupSection key={GroupRedPacketTabEnum.Fixed} />,
  },
];

export default function SendPacketGroupPage() {
  // const {
  //   params: { type = GroupRedPacketTabEnum.Random },
  // } = useRoute<RouteProp<{ params: { type: GroupRedPacketTabEnum } }>>();

  const [selectTab, setSelectTab] = useState<GroupRedPacketTabEnum>(GroupRedPacketTabEnum.Random);

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
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: { ...GStyles.paddingArg(16, 20), flex: 1, backgroundColor: defaultColors.bg6 },

  tabHeader: {
    width: pTd(214),
    backgroundColor: defaultColors.bg18,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
    marginBottom: pTd(32),
  },
  tabWrap: {
    width: pTd(100),
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
});
