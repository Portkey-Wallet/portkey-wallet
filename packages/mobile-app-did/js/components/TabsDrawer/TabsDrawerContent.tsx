import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { TextS } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca/index';
import { pTd } from 'utils/unit';
import { darkColors, defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import Card from './components/Card';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import {
  changeDrawerOpenStatus,
  closeAllTabs,
  setActiveTab,
  updateTab,
} from '@portkey-wallet/store/store-ca/discover/slice';
import { showBrowserModal } from './components/TabsOverlay';

import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { BrowserContext, IBrowserTab } from './context';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';
import Svg from 'components/Svg';
import ActionSheet from 'components/ActionSheet';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { useCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { getHost, getOrigin } from '@portkey-wallet/utils/dapp/browser';
import Touchable from 'components/Touchable';
import { ITabContext } from './tools';
import TabsDom from './components/TabsDom';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import DiscoverSearchContent from 'pages/Discover/DiscoverSearch/components/DiscoverSearchContent';
import { makeStyles } from '@rneui/themed';

export const TabsDrawerContent = forwardRef(function (_, drawerRef) {
  const styles = getStyles();
  const { t } = useLanguage();
  const { networkType } = useCurrentNetworkInfo();
  const nav = useNavigation();
  const dappList = useCurrentDappList();
  const dispatch = useAppCommonDispatch();
  const { isDrawerOpen, discoverMap = {}, activeTabId } = useAppCASelector(state => state.discover);
  const { tabs } = discoverMap[networkType] ?? {};
  const activeItem = useMemo(() => tabs?.find(ele => ele.id === activeTabId) as ITabItem, [activeTabId, tabs]);
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const tabRef = useRef<IBrowserTab | null>(null);
  const [preActiveTabId, setPreActiveTabId] = useState<number | undefined>(activeTabId);

  const activeWebviewScreenShot = useCallback(async () => {
    if (!activeTabId) {
      return;
    }

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
      const routes = nav?.getState?.()?.routes;
      const currentRoute = routes?.[routes?.length - 1];

      if (
        currentRoute?.name === 'DappDetail' &&
        !dappList?.find(ele => ele.origin === getOrigin(activeItem?.url || ''))
      ) {
        navigationService.navigate('DappList');
      }
    }

    activeWebviewScreenShot();
    dispatch(changeDrawerOpenStatus(false));
  }, [activeItem?.url, activeWebviewScreenShot, dappList, dispatch, nav]);

  const value = useMemo(
    () => ({
      setTabRef: (ref: IBrowserTab) => {
        tabRef.current = ref;
      },
    }),
    [],
  );

  const closeAll = useCallback(() => {
    if (tabs?.length === 0) {
      return;
    }

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
          style: { backgroundColor: darkColors.textBrand2 },
          titleStyle: { color: darkColors.iconBrand4 },
          onPress: () => {
            dispatch(closeAllTabs({ networkType }));
            dispatch(changeDrawerOpenStatus(false));
          },
        },
      ],
    });
  }, [dispatch, networkType, t, tabs?.length]);

  const onDone = useCallback(() => {
    if (tabs?.length === 0) {
      return dispatch(changeDrawerOpenStatus(false));
    }
    if (!preActiveTabId) {
      return dispatch(changeDrawerOpenStatus(false));
    }

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

  const [isSearchShow, setIsSearchShow] = useState(false);

  const clickBottomActionBtn = useCallback(
    (type: 'back' | 'forward' | 'showTab' | 'home' | 'more' | 'search') => {
      switch (type) {
        case 'back':
          tabRef.current?.goBack?.();
          break;

        case 'forward':
          tabRef.current?.goForward?.();
          break;

        case 'showTab':
          if (!activeTabId) {
            return;
          }
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

        case 'search':
          setIsSearchShow(true);
          break;

        default:
          break;
      }
    },
    [activeItem, activeTabId, activeWebviewScreenShot],
  );

  const provider = useMemo<ITabContext>(() => {
    return {
      currentTabLength: (tabs ?? []).length,
      showAllTabs: () => {
        clickBottomActionBtn('showTab');
      },
    };
  }, [clickBottomActionBtn, tabs]);

  useImperativeHandle(drawerRef, () => provider, [provider]);

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
            <TextS style={[FontStyles.fontBase1, fonts.SGMediumFont, tabs?.length === 0 && handleButtonStyle.noTap]}>
              {t('Close all')}
            </TextS>
          </Touchable>

          <Touchable
            style={[handleButtonStyle.handleItem, handleButtonStyle.add]}
            onPress={() => dispatch(changeDrawerOpenStatus(false))}>
            <Svg icon="add-tab" size={pTd(24)} color={defaultColors.iconBrand1} />
          </Touchable>
          <Touchable style={handleButtonStyle.handleItem} onPress={onDone}>
            <TextS style={[handleButtonStyle.done, fonts.SGMediumFont, FontStyles.fontBase1]}>{t('Done')}</TextS>
          </Touchable>
        </View>
      </>
    );
  }, [closeAll, dispatch, onDone, styles.cardsContainer, t, tabs]);

  const safeAreaColor: any = useMemo(() => {
    if (!activeTabId) {
      return ['black', 'black'];
    }
    if (isSearchShow) {
      return ['black', 'lightBlack'];
    }
    return ['lightBlack', 'lightBlack'];
  }, [activeTabId, isSearchShow]);

  return (
    <BrowserContext.Provider value={value}>
      <PageContainer
        hideTouchable
        type="leftBack"
        hideHeader={!activeTabId || isSearchShow}
        noCenterDom={!activeTabId || isSearchShow}
        leftDom={
          <View style={styles.leftWrap}>
            <Touchable onPress={backToSearchPage} style={styles.backIcon}>
              <Svg icon="left-arrow-v2" size={pTd(20)} color={darkColors.iconBase1} />
            </Touchable>
          </View>
        }
        notHandleHardwareBackPress
        safeAreaColor={safeAreaColor}
        containerStyles={styles.container}
        scrollViewProps={{ disabled: true }}
        titleDom={
          activeTabId ? (
            <View style={styles.headerWrap}>
              <DiscoverWebsiteImage size={pTd(24)} imageUrl={getCmsWebsiteInfoImageUrl(activeItem.url)} />
              <TextS numberOfLines={1} ellipsizeMode="tail" style={styles.header}>
                {getCmsWebsiteInfoName(activeItem.url) || activeItem?.name || getHost(activeItem?.url)}
              </TextS>
            </View>
          ) : (
            ''
          )
        }>
        <TabsDom activeWebViewRef={tabRef} clickBottomActionBtn={clickBottomActionBtn} />
        {!activeTabId && isDrawerOpen && CardGroupDom}
        {isSearchShow && (
          <View style={styles.searchContainer}>
            <DiscoverSearchContent isInner={true} onBack={() => setIsSearchShow(false)} />
          </View>
        )}
      </PageContainer>
    </BrowserContext.Provider>
  );
});

TabsDrawerContent.displayName = 'TabsDrawerContent';

const getStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    backgroundColor: darkColors.bgBase1,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    marginLeft: pTd(8),
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  leftWrap: {
    paddingHorizontal: pTd(16),
    alignItems: 'center',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    paddingBottom: pTd(80),
  },
  switchButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: pTd(44),
  },
  switchButton: {
    width: pTd(21),
    height: pTd(21),
    borderRadius: pTd(4),
    borderWidth: pTd(1.5),
    borderColor: darkColors.textBase1,
    color: defaultColors.textBase1,
    textAlign: 'center',
    lineHeight: pTd(18),
  },
  searchContainer: {
    position: 'absolute',
    backgroundColor: theme.colors.bgBase1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

const handleButtonStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: pTd(12),
    paddingBottom: pTd(26),
    width: screenWidth,
    height: pTd(62),
    position: 'absolute',
    bottom: 0,
    backgroundColor: darkColors.bgBase1,
  },
  handleItem: {
    flex: 1,
    lineHeight: pTd(30),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  close: {
    textAlign: 'left',
    // fontWeight: '600',
  },
  add: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    textAlign: 'right',
    // fontWeight: '600',
  },
  noTap: {
    opacity: 0.3,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pTd(12),
    width: screenWidth,
  },
});
