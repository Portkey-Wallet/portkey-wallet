import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, GestureResponderEvent, TouchableWithoutFeedback } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from 'components/SimulatedInputBoxV2';
import { darkColors } from 'assets/theme';

import SafeAreaBox from 'components/SafeAreaBox';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { useCheckAndInitNetworkDiscoverMap } from 'hooks/discover';
import { useFetchCurrentRememberMeBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useFocusEffect } from '@react-navigation/native';
import Touchable from 'components/Touchable';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import { useDiscoverData } from '@portkey-wallet/hooks/hooks-ca/cms/discover';
import { TextM } from 'components/CommonText';
import { DiscoverShowOptions, useTabDrawer } from 'utils/discover';
import fonts from 'assets/theme/fonts';
import { useOnTouchAndPopUp } from 'components/FloatOverlay/touch';
import { ListItemType } from 'components/FloatOverlay/Popover';
import { ArchivedTabEnum } from '../types';
import DiscoverTab from '../components/DiscoverTopTab';
import { PullToRefresh } from '@sdcx/pull-to-refresh';
import { NestedScrollView, NestedScrollViewHeader } from '@sdcx/nested-scroll';
import CustomPullToRefreshHeader from 'pages/DashBoard/PullToRefresh';

export default function DiscoverHome() {
  useCheckAndInitNetworkDiscoverMap();
  const fetchCurrentRememberMeBlackList = useFetchCurrentRememberMeBlackList();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const { fetchDiscoverLearnBannerAsync } = useCmsBanner();
  const { fetchDiscoverEarnAsync, fetchDiscoverLearnAsync } = useDiscoverData();
  const { currentTabLength = 0, showTabDrawer } = useTabDrawer();
  const [refreshing, setRefreshing] = useState(false);
  const tabRef = useRef<any>();
  const jumpToHistory = useCallback(
    (num: ArchivedTabEnum) => navigationService.navigate('Bookmark', { type: num }),
    [],
  );
  const popUpList = useMemo<ListItemType[]>(() => {
    return [
      {
        title: 'Bookmarks',
        iconName: 'book-mark',
        iconColor: darkColors.iconBase1,
        onPress: () => jumpToHistory(ArchivedTabEnum.Bookmarks),
      },
      {
        title: 'History',
        iconName: 'clock',
        iconColor: darkColors.iconBase1,
        onPress: () => jumpToHistory(ArchivedTabEnum.History),
      },
    ];
  }, [jumpToHistory]);
  const onTouch = useOnTouchAndPopUp({
    list: popUpList,
    formatType: 'fixedWidth',
    contentStyle: { color: darkColors.textBase1 },
    containerStyle: { backgroundColor: darkColors.bgBase1, borderColor: darkColors.borderBase1, borderWidth: 1 },
  });

  const scanQRIcon = useMemo(
    () => (
      <TouchableIcon
        icon="scan"
        onPress={async () => {
          if (!(await qrScanPermissionAndToast())) {
            return;
          }
          navigationService.navigate('QrScanner');
        }}
      />
    ),
    [qrScanPermissionAndToast],
  );

  const showAllTabsIcon = useMemo(() => {
    return (
      <Touchable onPress={() => showTabDrawer(DiscoverShowOptions.SHOW_TABS)} style={styles.showAllTabsWrap}>
        <TextM style={[styles.showAllTabsText, fonts.mediumFont]}>{currentTabLength}</TextM>
      </Touchable>
    );
  }, [currentTabLength, showTabDrawer]);

  const showToolsIcon = useMemo(() => {
    return <TouchableIcon icon="more_verti" onPress={onTouch} size={22} color={darkColors.iconBase1} />;
  }, [onTouch]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      tabRef.current?.onRefresh(() => {
        setRefreshing(false);
      });
    } catch (error) {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCurrentRememberMeBlackList();
    }, [fetchCurrentRememberMeBlackList]),
  );

  useEffectOnce(() => {
    fetchDiscoverLearnBannerAsync();
    fetchDiscoverEarnAsync();
    fetchDiscoverLearnAsync();
  });

  const onTouchCleanAll = () => {
    tabRef.current?.hideAll?.();
  };

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={{ backgroundColor: darkColors.bgBase1 }}>
      <TouchableWithoutFeedback onPressIn={onTouchCleanAll}>
        <View style={styles.containerWrap}>
          {React.cloneElement(
            <PullToRefresh header={<CustomPullToRefreshHeader refreshing={refreshing} onRefresh={handleRefresh} />} />,
            {
              children: (
                <NestedScrollView>
                  {React.cloneElement(<NestedScrollViewHeader />, {
                    children: (
                      <View style={styles.header}>
                        <TextM style={styles.headerTitle}>Discover</TextM>
                        {showToolsIcon}
                      </View>
                    ),
                  })}
                  <View style={styles.container}>
                    <DiscoverTab ref={(ref: any) => (tabRef.current = ref)} />
                  </View>
                </NestedScrollView>
              ),
            },
          )}
          <View style={styles.functionalLine}>
            <SimulatedInputBox
              onClickInput={() => navigationService.navigate('DiscoverSearch')}
              rightDom={scanQRIcon}
            />
            {showAllTabsIcon}
            {/* {showToolsIcon} */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaBox>
  );
}

function TouchableIcon({
  icon,
  onPress,
  size = 20,
  color,
}: {
  icon: IconName;
  onPress: (event: GestureResponderEvent) => Promise<any> | void;
  size?: number;
  color?: string;
}) {
  return (
    <Touchable style={styles.svgWrap} onPress={onPress}>
      <Svg icon={icon} size={pTd(size)} color={color || darkColors.iconBase1} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  containerWrap: {
    position: 'relative',
    flex: 1,
  },
  container: {
    paddingBottom: pTd(56),
    flex: 1,
    backgroundColor: darkColors.bgBase1,
  },
  header: {
    height: pTd(56),
    flexDirection: 'row',
    backgroundColor: darkColors.bgBase1,
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(8),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(38),
    height: pTd(38),
    color: darkColors.textBase1,
  },
  functionalLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: pTd(56),
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: pTd(32),
    backgroundColor: darkColors.bgBase2,
    // color: defaultColors.white,
  },
  pagesBtn: {
    paddingHorizontal: pTd(16),
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  showAllTabsWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(4),
    borderWidth: 1.5,
    borderColor: darkColors.borderBase1,
    width: pTd(19),
    height: pTd(19),
    marginHorizontal: pTd(16),
  },
  showAllTabsText: {
    color: darkColors.textBase1,
    textAlign: 'center',
  },
  svgWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
