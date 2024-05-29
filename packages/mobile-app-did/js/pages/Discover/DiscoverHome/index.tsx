import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, GestureResponderEvent } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import SimulatedInputBox from 'components/SimulatedInputBox';
import { DiscoverCmsListSection } from '../components/DiscoverCmsListSection';
import { defaultColors } from 'assets/theme';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { useQrScanPermissionAndToast } from 'hooks/useQrScan';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import { useCheckAndInitNetworkDiscoverMap } from 'hooks/discover';
import { useFetchCurrentRememberMeBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useFocusEffect } from '@react-navigation/native';
import Touchable from 'components/Touchable';
import { TextM } from 'components/CommonText';
import { DiscoverShowOptions, useTabDrawer } from 'utils/discover';
import fonts from 'assets/theme/fonts';
import { useOnTouchAndPopUp } from 'components/FloatOverlay/touch';
import { ListItemType } from 'components/FloatOverlay/Popover';
import { ArchivedTabEnum } from '../types';

export default function DiscoverHome() {
  useCheckAndInitNetworkDiscoverMap();
  const fetchCurrentRememberMeBlackList = useFetchCurrentRememberMeBlackList();
  const qrScanPermissionAndToast = useQrScanPermissionAndToast();
  const { currentTabLength = 0, showTabDrawer } = useTabDrawer();
  const jumpToHistory = useCallback(
    (num: ArchivedTabEnum) => navigationService.navigate('Bookmark', { type: num }),
    [],
  );
  const popUpList = useMemo<ListItemType[]>(() => {
    return [
      {
        title: 'Bookmarks',
        iconName: 'star',
        iconColor: defaultColors.icon5,
        onPress: () => jumpToHistory(ArchivedTabEnum.Bookmarks),
      },
      {
        title: 'Records',
        iconName: 'history',
        iconColor: defaultColors.icon5,
        onPress: () => jumpToHistory(ArchivedTabEnum.History),
      },
    ];
  }, [jumpToHistory]);
  const onTouch = useOnTouchAndPopUp({ list: popUpList });

  const scanQRIcon = useMemo(
    () => <TouchableIcon icon="scan" onPress={qrScanPermissionAndToast} />,
    [qrScanPermissionAndToast],
  );

  const showAllTabsIcon = useMemo(() => {
    return (
      <Touchable onPress={() => showTabDrawer(DiscoverShowOptions.SHOW_TABS)} style={styles.svgWrap}>
        <TextM style={[styles.switchButton, fonts.mediumFont]}>{currentTabLength}</TextM>
      </Touchable>
    );
  }, [currentTabLength, showTabDrawer]);

  const showToolsIcon = useMemo(() => {
    return <TouchableIcon icon="more-vertical" onPress={onTouch} size={22} />;
  }, [onTouch]);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentRememberMeBlackList();
    }, [fetchCurrentRememberMeBlackList]),
  );

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={BGStyles.white}>
      <View style={styles.functionalLine}>
        <SimulatedInputBox onClickInput={() => navigationService.navigate('DiscoverSearch')} rightDom={scanQRIcon} />
        {showAllTabsIcon}
        {showToolsIcon}
      </View>
      <ScrollView style={styles.container}>
        <DiscoverCmsListSection />
      </ScrollView>
    </SafeAreaBox>
  );
}

function TouchableIcon({
  icon,
  onPress,
  size = 20,
}: {
  icon: IconName;
  onPress: (event: GestureResponderEvent) => Promise<any>;
  size?: number;
}) {
  return (
    <Touchable style={styles.svgWrap} onPress={onPress}>
      <Svg icon={icon} size={pTd(size)} color={defaultColors.bg34} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultColors.white,
    paddingTop: pTd(24),
    flex: 1,
  },
  functionalLine: {
    height: pTd(56),
    flexDirection: 'row',
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagesBtn: {
    paddingHorizontal: pTd(16),
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  switchButton: {
    width: pTd(21),
    height: pTd(21),
    borderRadius: pTd(4),
    borderWidth: pTd(1.5),
    borderColor: defaultColors.font19,
    color: defaultColors.font19,
    textAlign: 'center',
    lineHeight: pTd(18),
    marginHorizontal: pTd(16),
  },
  svgWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
