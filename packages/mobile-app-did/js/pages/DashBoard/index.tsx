import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView, FlatList, ScrollTabView } from 'react-native-scroll-head-tab-view-fixed';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useReportAnalyticsEvent from 'hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useReportingSignalR } from 'hooks/FCM';
import { useManagerExceedTipModal } from 'hooks/managerCheck';
import { useReferral } from '@portkey-wallet/hooks/hooks-ca/referral';
import Touchable from 'components/Touchable';
import CustomHeader from 'components/CustomHeader';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

function TabView1(props) {
  const data = new Array(200).fill({});
  const renderItem = ({ item, index }) => {
    return (
      <View style={{ marginVertical: 2, padding: 10, borderWidth: 1 }}>
        <Text>{'tab1 => ' + index}</Text>
      </View>
    );
  };
  return <FlatList {...props} data={data} renderItem={renderItem} {...props} />;
}

function TabView2(props) {
  const data = new Array(100).fill({});
  const renderItem = ({ item, index }) => {
    return (
      <View style={{ marginVertical: 2, padding: 10, borderWidth: 1 }}>
        <Text>{'tab2 => ' + index}</Text>
      </View>
    );
  };
  return <FlatList data={data} renderItem={renderItem} {...props} />;
}

function TabView3(props) {
  const data = new Array(20).fill({});
  return (
    <ScrollView {...props}>
      {data.map((o, i) => (
        <View style={{ marginVertical: 2, padding: 10, borderWidth: 1 }}>
          <Text>{'tab3 => ' + i}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const DashBoard: React.FC<any> = ({ navigation }) => {
  const [headerHeight, setHeaderHeight] = useState(200);
  const headerOnLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  }, []);

  const _renderScrollHeader = useCallback(() => {
    return <Card onLayout={headerOnLayout} />;
  }, [headerOnLayout]);

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg1]}>
      <CustomHeader
        rightDom={
          <Touchable
            style={styles.svgWrap}
            onPress={async () => {
              //
            }}>
            <Svg icon="scan" size={22} color={defaultColors.font8} />
          </Touchable>
        }
      />
      <ScrollTabView headerHeight={headerHeight} renderScrollHeader={_renderScrollHeader}>
        <TabView1 tabLabel="tab1" />
        <TabView2 tabLabel="tab2" />
        <TabView3 tabLabel="tab3" />
      </ScrollTabView>
    </SafeAreaBox>
  );
  // const reportAnalyticsEvent = useReportAnalyticsEvent();
  // const { getViewReferralStatusStatus, getReferralLink } = useReferral();
  // const managerExceedTipModalCheck = useManagerExceedTipModal();
  // useReportingSignalR();

  // const navToChat = useCallback(
  //   (tabName: RootStackName) => {
  //     if (navigation && navigation.jumpTo) {
  //       navigation.jumpTo(tabName);
  //     }
  //   },
  //   [navigation],
  // );

  // useEffectOnce(() => {
  //   reportAnalyticsEvent({ message: 'DashBoard' });
  //   managerExceedTipModalCheck();
  //   getViewReferralStatusStatus();
  //   getReferralLink();
  // });

  // // nav's to chat tab
  // useEffect(() => {
  //   const listener = myEvents.navToBottomTab.addListener(({ tabName }) => navToChat(tabName));
  //   return () => listener.remove();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // return (
  //   <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
  //     <Card />
  //     <DashBoardTab />
  //   </SafeAreaBox>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgWrap: {
    padding: pTd(16),
  },
});

export default DashBoard;
