import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca/index';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Card from './components/Card';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import {
  changeDrawerOpenStatus,
  closeAllTabs,
  removeAutoApproveItem,
  setActiveTab,
  updateTab,
} from '@portkey-wallet/store/store-ca/discover/slice';
import BrowserTab from 'components/BrowserTab';
import { showBrowserModal } from './components/TabsOverlay';

import { showWalletInfo } from './components/WalletInfoOverlay';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { BrowserContext, IBrowserTab } from './context';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import Svg from 'components/Svg';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import ActionSheet from 'components/ActionSheet';
import { useCheckAndUpDateRecordItemName, useCheckAndUpDateTabItemName } from 'hooks/discover';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';

const TabsDrawerContent: React.FC = () => {
  const { t } = useLanguage();
  const { networkType } = useCurrentNetworkInfo();
  const nav = useNavigation();
  const dappList = useCurrentDappList();
  const dispatch = useAppCommonDispatch();
  const {
    isDrawerOpen,
    discoverMap = {},
    initializedList,
    activeTabId,
    autoApproveMap,
  } = useAppCASelector(state => state.discover);
  const { tabs } = discoverMap[networkType] ?? {};
  const activeItem = useMemo(() => tabs?.find(ele => ele.id === activeTabId) as ITabItem, [activeTabId, tabs]);

  const checkAndUpDateRecordItemName = useCheckAndUpDateRecordItemName();
  const checkAndUpDateTabItemName = useCheckAndUpDateTabItemName();
  const { getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const tabRef = useRef<IBrowserTab | null>(null);
  const [preActiveTabId, setPreActiveTabId] = useState<number | undefined>(activeTabId);

  const [tabStateMap, setTabStateMap] = useState<{
    canGoBack: Record<string, boolean>;
    canGoForward: Record<string, boolean>;
  }>({
    canGoBack: {},
    canGoForward: {},
  });

  const activeWebviewScreenShot = useCallback(async () => {
    if (!activeTabId) return;

    try {
      const uri = await tabRef.current?.capture?.();
      dispatch(setActiveTab({ id: undefined, networkType }));
      dispatch(updateTab({ id: activeTabId, screenShotUrl: uri, networkType }));
    } catch (error) {
      console.log(error);
    }
  }, [activeTabId, dispatch, networkType]);

  const backToSearchPage = useCallback(() => {
    if (nav) {
      const routes = nav.getState().routes;
      const currentRoute = routes[routes.length - 1];

      if (
        currentRoute.name === 'DappDetail' &&
        !dappList?.find(ele => ele.origin === getOrigin(activeItem?.url || ''))
      ) {
        navigationService.navigate('DappList');
      }
    }

    activeWebviewScreenShot();
    dispatch(changeDrawerOpenStatus(false));
  }, [activeItem?.url, activeWebviewScreenShot, dappList, dispatch, nav]);

  // header right
  const rightDom = useMemo(() => {
    if (activeTabId)
      return (
        <View style={rightDomStyle.iconGroupWrap}>
          <Touchable style={rightDomStyle.iconWrap} onPress={() => showWalletInfo({ tabInfo: activeItem })}>
            <Svg icon="wallet-white" size={20} />
          </Touchable>
        </View>
      );
    return null;
  }, [activeItem, activeTabId]);

  const value = useMemo(
    () => ({
      setTabRef: (ref: IBrowserTab) => {
        tabRef.current = ref;
      },
    }),
    [],
  );

  const closeAll = useCallback(() => {
    if (tabs?.length === 0) return;

    ActionSheet.alert({
      title: 'Close all tabs?',
      buttons: [
        {
          title: t('Cancel'),
          type: 'outline',
        },
        {
          title: t('Confirm'),
          type: 'solid',
          onPress: () => {
            dispatch(closeAllTabs({ networkType }));
            dispatch(changeDrawerOpenStatus(false));
          },
        },
      ],
    });
  }, [dispatch, networkType, t, tabs?.length]);

  const onDone = useCallback(() => {
    if (tabs?.length === 0) return dispatch(changeDrawerOpenStatus(false));
    if (tabs?.find(ele => ele.id === preActiveTabId)) {
      dispatch(setActiveTab({ id: preActiveTabId, networkType }));
    } else {
      dispatch(setActiveTab({ id: tabs?.[tabs?.length - 1]?.id, networkType }));
    }
  }, [dispatch, networkType, preActiveTabId, tabs]);

  useHardwareBackPress(
    useMemo(() => {
      if (isDrawerOpen) {
        return () => {
          backToSearchPage();
          return true;
        };
      }
    }, [backToSearchPage, isDrawerOpen]),
  );

  const clickBottomActionBtn = useCallback(
    (type: 'back' | 'forward' | 'showTab' | 'home' | 'more') => {
      switch (type) {
        case 'back':
          tabRef.current?.goBack?.();
          break;

        case 'forward':
          tabRef.current?.goForward?.();
          break;

        case 'showTab':
          if (!activeTabId) return;
          activeWebviewScreenShot();
          setPreActiveTabId(Number(activeItem?.id));
          break;

        case 'home':
          tabRef.current?.goBackHome?.();
          break;

        case 'more':
          showBrowserModal({
            browserInfo: activeItem,
            activeWebViewRef: tabRef,
            activeWebviewScreenShot,
            setPreActiveTabId,
          });
          break;

        default:
          break;
      }
    },
    [activeItem, activeTabId, activeWebviewScreenShot],
  );

  const TabsDom = useMemo(() => {
    return tabs?.map(ele => {
      const isHidden = activeTabId !== ele.id;
      const initialized = initializedList?.has(ele.id);
      if (isHidden && !initialized) return;
      const autoApprove = autoApproveMap?.[ele.id];

      const canGoBack: boolean = tabStateMap?.canGoBack?.[ele.id];
      const canGoForward: boolean = tabStateMap?.canGoForward?.[String(ele?.id)];

      const onNavigationStateChange = (navState: any) => {
        console.log('onNavigationStateChange');

        if (ele.id === activeTabId) {
          setTabStateMap(pre => ({
            canGoBack: {
              ...pre.canGoBack,
              [ele.id]: navState?.canGoBack,
            },
            canGoForward: {
              ...pre.canGoForward,
              [ele.id]: navState?.canGoForward,
            },
          }));
        }
      };

      return (
        <>
          <BrowserTab
            key={ele.id}
            id={ele.id}
            uri={ele.url}
            isHidden={isHidden}
            autoApprove={autoApprove}
            onLoadEnd={nativeEvent => {
              if (autoApprove) dispatch(removeAutoApproveItem(ele.id));
              checkAndUpDateRecordItemName({ id: ele.id, name: nativeEvent.title });
              checkAndUpDateTabItemName({ id: ele.id, name: nativeEvent.title });
            }}
            onNavigationStateChange={onNavigationStateChange}
          />
          {!isHidden && (
            <View style={handleButtonStyle.wrap}>
              <Touchable
                disabled={!canGoBack}
                onPress={() => clickBottomActionBtn('back')}
                style={rightDomStyle.iconWrap}>
                <Svg icon="left-arrow" size={pTd(20)} color={canGoBack ? defaultColors.font5 : defaultColors.bg16} />
              </Touchable>
              <Touchable
                disabled={!canGoForward}
                onPress={() => clickBottomActionBtn('forward')}
                style={rightDomStyle.iconWrap}>
                <Svg
                  icon="right-arrow"
                  size={pTd(24)}
                  color={canGoForward ? defaultColors.font5 : defaultColors.bg16}
                />
              </Touchable>
              <Touchable onPress={() => clickBottomActionBtn('showTab')} style={rightDomStyle.iconWrap}>
                <TextM style={styles.switchButton}>{tabs?.length || 0}</TextM>
              </Touchable>
              <Touchable onPress={() => clickBottomActionBtn('home')} style={rightDomStyle.iconWrap}>
                <Svg icon="homepage" size={pTd(24)} color={defaultColors.font5} />
              </Touchable>
              <Touchable onPress={() => clickBottomActionBtn('more')} style={rightDomStyle.iconWrap}>
                <Svg icon="more" size={20} color={defaultColors.font5} />
              </Touchable>
            </View>
          )}
        </>
      );
    });
  }, [
    activeTabId,
    autoApproveMap,
    checkAndUpDateRecordItemName,
    checkAndUpDateTabItemName,
    clickBottomActionBtn,
    dispatch,
    initializedList,
    tabStateMap?.canGoBack,
    tabStateMap?.canGoForward,
    tabs,
  ]);

  // card group
  const CardGroupDom = useMemo(() => {
    return (
      <>
        <ScrollView>
          <View style={styles.cardsContainer}>
            {tabs?.map(ele => (
              <Card key={ele.id} item={ele} />
            ))}
          </View>
        </ScrollView>
        <View style={handleButtonStyle.container}>
          <Touchable style={handleButtonStyle.handleItem} onPress={closeAll}>
            <TextM style={[FontStyles.font4, tabs?.length === 0 && handleButtonStyle.noTap]}>{t('Close All')}</TextM>
          </Touchable>

          <Touchable
            style={[handleButtonStyle.handleItem, handleButtonStyle.add]}
            onPress={() => dispatch(changeDrawerOpenStatus(false))}>
            <Svg icon="add-blue" size={pTd(28)} />
          </Touchable>
          <Touchable style={handleButtonStyle.handleItem} onPress={onDone}>
            <TextM style={[handleButtonStyle.done, FontStyles.font4]}>{t('Done')}</TextM>
          </Touchable>
        </View>
      </>
    );
  }, [closeAll, dispatch, onDone, t, tabs]);

  return (
    <BrowserContext.Provider value={value}>
      <PageContainer
        hideTouchable
        noCenterDom={!!activeTabId}
        noLeftDom={!activeTabId}
        leftDom={
          <View style={styles.leftWrap}>
            <Touchable onPress={backToSearchPage} style={styles.backIcon}>
              <Svg icon="left-arrow" size={pTd(16)} color={defaultColors.bg1} />
            </Touchable>
            <TextWithProtocolIcon
              type="iconLeft"
              location="header"
              title={getCmsWebsiteInfoName(activeItem?.url || '') || activeItem?.name}
              url={activeItem?.url || ''}
            />
          </View>
        }
        rightDom={rightDom}
        notHandleHardwareBackPress
        safeAreaColor={['blue', 'white']}
        containerStyles={styles.container}
        scrollViewProps={{ disabled: true }}
        titleDom={activeTabId ? '' : `${tabs?.length} Tabs`}>
        {TabsDom}
        {!activeTabId && isDrawerOpen && CardGroupDom}
      </PageContainer>
    </BrowserContext.Provider>
  );
};

export default TabsDrawerContent;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    backgroundColor: defaultColors.bg6,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  inputStyle: {
    width: pTd(280),
  },
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
  leftWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: pTd(16),
  },
  backIcon: {
    marginRight: pTd(4),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  cardsContainer: {
    scrollEnabled: true,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    paddingBottom: pTd(50),
  },
  switchButton: {
    width: pTd(21),
    height: pTd(21),
    borderRadius: pTd(4),
    borderWidth: pTd(1.5),
    borderColor: defaultColors.font5,
    color: defaultColors.font5,
    textAlign: 'center',
    lineHeight: pTd(18),
  },
});

const handleButtonStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    height: pTd(44),
    position: 'absolute',
    bottom: 0,
    backgroundColor: defaultColors.bg1,
  },
  handleItem: {
    flex: 1,
    lineHeight: pTd(30),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  close: {
    textAlign: 'left',
  },
  add: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    textAlign: 'right',
  },
  noTap: {
    opacity: 0.3,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    height: pTd(44),
    backgroundColor: defaultColors.bg1,
  },
});

const rightDomStyle = StyleSheet.create({
  iconGroupWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    ...GStyles.paddingArg(pTd(4)),
    marginHorizontal: pTd(20),
  },
});
