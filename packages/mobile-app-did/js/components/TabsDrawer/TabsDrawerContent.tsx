import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import { TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca/index';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
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
import BrowserTab from 'components/BrowserTab';
import { showBrowserModal } from './components/TabsOverlay';

import { showWalletInfo } from './components/WalletInfoOverlay';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';

import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { BrowserContext, IBrowserTab } from './context';
import { useHardwareBackPress } from '@portkey-wallet/hooks/mobile';

const TabsDrawerContent: React.FC = () => {
  const { t } = useLanguage();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { isDrawerOpen, discoverMap = {}, initializedList, activeTabId } = useAppCASelector(state => state.discover);

  const { tabs } = discoverMap[networkType] ?? {};

  const tabRef = useRef<IBrowserTab | null>(null);

  const [preActiveTabId, setPreActiveTabId] = useState<number | undefined>(activeTabId);

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
    activeWebviewScreenShot();
    dispatch(changeDrawerOpenStatus(false));
  }, [activeWebviewScreenShot, dispatch]);

  // header right
  const rightDom = useMemo(() => {
    const activeItem = tabs?.find(ele => ele.id === activeTabId) as ITabItem;
    if (activeTabId)
      return (
        <View style={rightDomStyle.iconGroupWrap}>
          <TouchableOpacity style={rightDomStyle.iconWrap} onPress={() => showWalletInfo()}>
            <Svg icon="wallet-white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              showBrowserModal({
                browserInfo: activeItem,
                activeWebViewRef: tabRef,
                activeWebviewScreenShot,
                setPreActiveTabId,
              })
            }
            style={rightDomStyle.iconWrap}>
            <Svg icon="more" size={20} />
          </TouchableOpacity>
        </View>
      );
    return null;
  }, [activeTabId, activeWebviewScreenShot, tabs]);

  const tabsDom = useMemo(() => {
    return tabs?.map(ele => {
      const isHidden = activeTabId !== ele.id;
      const initialized = initializedList?.has(ele.id);
      if (isHidden && !initialized) return;
      return <BrowserTab key={ele.id} uri={ele.url} isHidden={isHidden} />;
    });
  }, [activeTabId, initializedList, tabs]);

  const value = useMemo(
    () => ({
      setTabRef: (ref: IBrowserTab) => {
        tabRef.current = ref;
      },
    }),
    [],
  );
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
  return (
    <BrowserContext.Provider value={value}>
      <PageContainer
        hideTouchable
        noLeftDom={!activeTabId}
        rightDom={rightDom}
        leftCallback={backToSearchPage}
        notHandleHardwareBackPress
        safeAreaColor={['blue', 'white']}
        containerStyles={styles.container}
        scrollViewProps={{ disabled: true }}
        titleDom={activeTabId ? '' : `${tabs?.length} Tabs`}>
        {tabsDom}
        {/* card group */}
        {!activeTabId && isDrawerOpen && (
          <>
            <ScrollView>
              <View style={styles.cardsContainer}>
                {tabs?.map(ele => (
                  <Card key={ele.id} item={ele} />
                ))}
              </View>
            </ScrollView>
            <View style={handleButtonStyle.container}>
              <TextM style={FontStyles.font4} onPress={() => dispatch(closeAllTabs({ networkType }))}>
                {t('Close All')}
              </TextM>
              <TouchableOpacity onPress={() => dispatch(changeDrawerOpenStatus(false))}>
                <Svg icon="add-blue" size={pTd(28)} />
              </TouchableOpacity>
              <TextM
                style={FontStyles.font4}
                onPress={() => {
                  if (tabs?.length === 0) return;
                  if (tabs?.find(ele => ele.id === preActiveTabId)) {
                    dispatch(setActiveTab({ id: preActiveTabId, networkType }));
                  } else {
                    dispatch(setActiveTab({ id: tabs?.[tabs?.length - 1]?.id, networkType }));
                  }
                }}>
                {t('Done')}
              </TextM>
            </View>
          </>
        )}
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
});

const handleButtonStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    height: pTd(44),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    position: 'absolute',
    bottom: 0,
    backgroundColor: defaultColors.bg1,
  },
  handleItem: {
    flex: 1,
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
    marginRight: pTd(16),
  },
});
