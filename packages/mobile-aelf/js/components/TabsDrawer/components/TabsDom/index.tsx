import React from 'react';
import { useAppCommonDispatch, useAppEOASelector, useLatestRef } from '@portkey-wallet/hooks';
import { removeAutoApproveItem, addBookmarkList, deleteBookmark } from '@portkey-wallet/store/store-eoa/discover/slice';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils-mobile/device';
import { darkColors } from 'assets/theme';
import BrowserTab from 'components/BrowserTab';
import CommonAvatar from 'components/CommonAvatar';
import { TextS } from 'components/CommonText';
import { useCheckAndUpDateRecordItemName, useCheckAndUpDateTabItemName } from 'hooks/discover';
import { useCallback, useMemo, useRef, useState } from 'react';
import Touchable from 'components/Touchable';
import { View, GestureResponderEvent, Share, Text } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import { IBookmarkItem, ITabItem } from '@portkey-wallet/store/store-eoa/discover/type';
import FloatOverlay from 'components/FloatOverlay';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-eoa/discover';
// import { request } from '@portkey-wallet/api/api-did';
import CommonToast from 'components/CommonToast';
import { showWalletInfo } from '../WalletInfoOverlay';
import { getHost } from '@portkey-wallet/utils/dapp/browser';
import { WebViewNavigation } from 'react-native-webview';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';

enum HANDLE_TYPE {
  REFRESH = 'Refresh',
  SHARE = 'Share',
  FORWARD = 'Forward',
  BACK = 'Back',
  BOOKMARK = 'Bookmark',
  UN_BOOKMARK = 'Remove bookmark',
}

type IProps = {
  activeWebViewRef: any;
  clickBottomActionBtn: (type: 'back' | 'forward' | 'showTab' | 'home' | 'more' | 'search') => void;
  onNavigationChange: (navState: WebViewNavigation) => void;
};

function TabsDom({ activeWebViewRef, clickBottomActionBtn, onNavigationChange }: IProps) {
  const styles = getStyles();
  const rightDomStyle = getRightDomStyles();

  const currentAccount = useCurrentAccount();
  const networkType = useCurrentNetwork();

  const { discoverMap = {}, initializedList, activeTabId, autoApproveMap } = useAppEOASelector(state => state.discover);
  const { tabs } = discoverMap[networkType] ?? {};

  const checkAndUpDateRecordItemName = useCheckAndUpDateRecordItemName();
  const checkAndUpDateTabItemName = useCheckAndUpDateTabItemName();
  const latestCheckAndUpDateRecordItemName = useLatestRef(checkAndUpDateRecordItemName);
  const latestCheckAndUpDateTabItemName = useLatestRef(checkAndUpDateTabItemName);
  const dispatch = useAppCommonDispatch();
  const activeItem = useMemo(() => tabs?.find(ele => ele.id === activeTabId) as ITabItem, [activeTabId, tabs]);
  const { bookmarkList, refresh } = useBookmarkList();
  const isBookmarkLoading = useRef(false);
  const [tabStateMap, setTabStateMap] = useState<{
    url: string;
    canGoBack: Record<string, boolean>;
    canGoForward: Record<string, boolean>;
  }>({
    url: activeItem?.url || '',
    canGoBack: {},
    canGoForward: {},
  });

  const handleSearch = useCallback(() => {
    clickBottomActionBtn('search');
  }, [clickBottomActionBtn]);

  const handleMark = useCallback(
    async (browserInfo: ITabItem) => {
      if (!isBookmarkLoading.current) {
        isBookmarkLoading.current = true;
        try {
          // await request.discover.addBookmark({
          //   params: {
          //     name: browserInfo?.name || browserInfo?.url || '',
          //     url: browserInfo?.url || '',
          //   },
          // });
          dispatch(
            addBookmarkList({
              networkType,
              list: [
                {
                  name: browserInfo?.name || browserInfo?.url || '',
                  url: browserInfo?.url || '',
                  id: 'LOCAL STORE. time:' + Date.now() + ' random:' + Math.random(),
                  index: -1,
                },
              ],
            }),
          );
          CommonToast.success('Bookmark added');
          refresh();
        } catch (error) {
          console.log(error, 'handleMark failed, TabsDom/index.tsx');
          CommonToast.failError('Added failed');
        }
        isBookmarkLoading.current = false;
      }
    },
    [dispatch, networkType, refresh],
  );

  const removeMark = useCallback(
    async (mark: IBookmarkItem) => {
      if (!isBookmarkLoading.current) {
        isBookmarkLoading.current = true;
        try {
          // await request.discover.deleteBookmark({
          //   params: {
          //     deleteInfos: [
          //       {
          //         id: mark?.id,
          //         index: mark?.index,
          //       },
          //     ],
          //   },
          // });
          dispatch(
            deleteBookmark({
              networkType,
              id: mark?.id,
            }),
          );
          CommonToast.success('Bookmark removed');
          refresh();
        } catch (error) {
          console.log(error, mark, 'removeMark failed, TabsDom/index.tsx');
          CommonToast.failError('Remove failed');
        }
        isBookmarkLoading.current = false;
      }
    },
    [dispatch, networkType, refresh],
  );

  const onTouch = useCallback(
    async (event: GestureResponderEvent, browserInfo: ITabItem, canGoBack: boolean, canGoForward: boolean) => {
      const bookmark = bookmarkList.find(item => item.url === browserInfo?.url);
      const { pageY, pageX } = event.nativeEvent;
      FloatOverlay.showFloatPopover({
        list: [
          {
            title: HANDLE_TYPE.SHARE,
            iconName: 'share-thin',
            onPress: async () => {
              await Share.share({
                message: isIOS ? browserInfo?.name ?? browserInfo?.url : browserInfo?.url,
                url: browserInfo?.url ?? browserInfo?.name ?? '',
                title: browserInfo?.name ?? browserInfo?.url,
              }).catch(shareError => {
                console.log(shareError);
              });
            },
          },
          {
            title: bookmark ? HANDLE_TYPE.UN_BOOKMARK : HANDLE_TYPE.BOOKMARK,
            iconName: !bookmark ? 'book-mark-fill' : 'book-mark',
            onPress: () => (bookmark ? removeMark(bookmark) : handleMark(browserInfo)),
          },
          {
            title: 'Forward',
            iconName: 'arrow-right',
            textStyle: { color: canGoForward ? darkColors.iconBase1 : darkColors.iconDisabled },
            iconColor: canGoForward ? darkColors.iconBase1 : darkColors.iconDisabled,
            onPress: () => canGoForward && clickBottomActionBtn('forward'),
          },
          {
            title: 'Back',
            iconName: 'arrow-left',
            textStyle: { color: canGoBack ? darkColors.iconBase1 : darkColors.iconDisabled },
            iconColor: canGoBack ? darkColors.iconBase1 : darkColors.iconDisabled,
            onPress: () => canGoBack && clickBottomActionBtn('back'),
          },
        ],
        formatType: 'fixedWidth',
        customPosition: { left: pageX - pTd(26), bottom: screenHeight - pageY + pTd(40) },
        customBounds: { x: pageX - pTd(16), y: pageY - pTd(40), width: 0, height: 0 },
        contentStyle: { color: darkColors.textBase1 },
        containerStyle: { backgroundColor: darkColors.bgBase1, borderColor: darkColors.borderBase1, borderWidth: 1 },
      });
    },
    [bookmarkList, clickBottomActionBtn, handleMark, removeMark],
  );

  const tabNumber = useMemo(() => Math.min(tabs?.length || 0, 99), [tabs?.length]);

  return tabs?.map(ele => {
    const isHidden = activeTabId !== ele.id;
    const initialized = initializedList?.has(ele.id);
    if (isHidden && !initialized) {
      return;
    }
    const autoApprove = autoApproveMap?.[ele.id];

    const canGoBack: boolean = tabStateMap?.canGoBack?.[ele.id];
    const canGoForward: boolean = tabStateMap?.canGoForward?.[String(ele?.id)];

    const onNavigationStateChange = (navState: WebViewNavigation) => {
      if (ele.id === activeTabId) {
        setTabStateMap(pre => ({
          url: navState?.url,
          canGoBack: {
            ...pre.canGoBack,
            [ele.id]: navState?.canGoBack,
          },
          canGoForward: {
            ...pre.canGoForward,
            [ele.id]: navState?.canGoForward,
          },
        }));
        onNavigationChange(navState);
      }
    };

    if (isHidden) {
      return null;
    }

    return (
      <View key={ele.id} style={[styles.webViewContainer]}>
        <BrowserTab
          id={ele.id}
          uri={ele.url}
          isHidden={isHidden}
          autoApprove={autoApprove}
          onLoadEnd={nativeEvent => {
            if (autoApprove) {
              dispatch(removeAutoApproveItem(ele.id));
            }
            latestCheckAndUpDateRecordItemName.current({ id: ele.id, name: nativeEvent.title });
            latestCheckAndUpDateTabItemName.current({ id: ele.id, name: nativeEvent.title });
            onNavigationStateChange(nativeEvent);
          }}
          // onNavigationStateChange={onNavigationStateChange}
        />
        <View style={styles.wrap}>
          <Touchable style={{ paddingHorizontal: pTd(12) }} onPress={() => showWalletInfo({ tabInfo: activeItem })}>
            <CommonAvatar
              hasBorder={!currentAccount?.icon}
              title={currentAccount?.name}
              avatarSize={pTd(32)}
              imageUrl={currentAccount?.icon || ''}
              resizeMode="cover"
              titleStyle={{ fontSize: pTd(14) }}
            />
          </Touchable>
          <View style={rightDomStyle.contentWrap}>
            <Touchable onPress={event => onTouch(event, ele, canGoBack, canGoForward)}>
              <Svg icon="more-circle" size={16} color={darkColors.iconBase1} />
            </Touchable>
            <Touchable style={rightDomStyle.inputContent} onPress={handleSearch}>
              {!tabStateMap?.url?.includes('https://') && (
                <View style={rightDomStyle.iconGroupWrap}>
                  <Svg icon="warning-fill" size={12} iconStyle={{ marginRight: pTd(10) }} />
                </View>
              )}
              <TextS style={[rightDomStyle.domain, fonts.mediumFont]} numberOfLines={1}>
                {getHost(tabStateMap?.url)}
              </TextS>
            </Touchable>
            <Touchable onPress={() => activeWebViewRef.current?.reload?.()}>
              <Svg icon="accessory" size={16} color={darkColors.iconBase1} />
            </Touchable>
          </View>
          <Touchable onPress={() => clickBottomActionBtn('showTab')} style={[styles.switchButtonWrap]}>
            <Text style={styles.switchButton}>{tabNumber}</Text>
          </Touchable>
        </View>
      </View>
    );
  });
}

export default TabsDom;

const getStyles = makeStyles(theme => ({
  webViewContainer: {
    flex: 1,
    position: 'relative',
    paddingBottom: pTd(72),
  },
  switchButtonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(2),
    borderWidth: pTd(2),
    borderColor: theme.colors.iconBase1,
    width: pTd(20),
    height: pTd(20),
    marginLeft: pTd(12),
    marginRight: pTd(16),
    marginHorizontal: pTd(2),
  },
  switchButton: {
    color: darkColors.textBase1,
    textAlign: 'center',
    fontSize: pTd(12),
    lineHeight: pTd(15),
    ...fonts.mediumFont,
  },
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pTd(16),
    width: screenWidth,
    backgroundColor: theme.colors.bgBase2,
    height: pTd(72),
    zIndex: 10,
  },
}));

const getRightDomStyles = makeStyles(theme => ({
  contentWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pTd(12),
    flex: 1,
    height: pTd(40),
    borderRadius: pTd(20),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: pTd(30),
    marginHorizontal: pTd(8),
  },
  domain: {
    color: theme.colors.textBase1,
    textAlign: 'center',
    lineHeight: pTd(14),
  },
  iconGroupWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
