import React from 'react';
import { useAppCASelector, useAppCommonDispatch, useLatestRef } from '@portkey-wallet/hooks';
import { removeAutoApproveItem } from '@portkey-wallet/store/store-ca/discover/slice';
import { isIOS, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { darkColors, defaultColors } from 'assets/theme';
import BrowserTab from 'components/BrowserTab';
import CommonAvatar from 'components/CommonAvatar';
import { TextM } from 'components/CommonText';
import { useCheckAndUpDateRecordItemName, useCheckAndUpDateTabItemName } from 'hooks/discover';
import { useCallback, useMemo, useRef, useState } from 'react';
import Touchable from 'components/Touchable';
import { View, StyleSheet, GestureResponderEvent, Share } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { IBookmarkItem, ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import FloatOverlay from 'components/FloatOverlay';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { request } from '@portkey-wallet/api/api-did';
import CommonToast from 'components/CommonToast';
import GStyles from 'assets/theme/GStyles';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { showWalletInfo } from '../WalletInfoOverlay';
import { getHost } from '@portkey-wallet/utils/dapp/browser';

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
};

function TabsDom({ activeWebViewRef, clickBottomActionBtn }: IProps) {
  const userInfo = useCurrentUserInfo();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap = {}, initializedList, activeTabId, autoApproveMap } = useAppCASelector(state => state.discover);
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
          await request.discover.addBookmark({
            params: {
              name: browserInfo?.name || browserInfo?.url || '',
              url: browserInfo?.url || '',
            },
          });
          CommonToast.success('Bookmark added');
          refresh();
        } catch (error) {
          CommonToast.failError('Added failed');
        }
        isBookmarkLoading.current = false;
      }
    },
    [refresh],
  );

  const removeMark = useCallback(
    async (mark: IBookmarkItem) => {
      if (!isBookmarkLoading.current) {
        isBookmarkLoading.current = true;
        try {
          await request.discover.deleteBookmark({
            params: {
              deleteInfos: [
                {
                  id: mark?.id,
                  index: mark?.index,
                },
              ],
            },
          });
          CommonToast.success('Bookmark removed');
          refresh();
        } catch (error) {
          CommonToast.failError('Remove failed');
        }
        isBookmarkLoading.current = false;
      }
    },
    [refresh],
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

  return tabs?.map(ele => {
    const isHidden = activeTabId !== ele.id;
    const initialized = initializedList?.has(ele.id);
    if (isHidden && !initialized) {
      return;
    }
    const autoApprove = autoApproveMap?.[ele.id];

    const canGoBack: boolean = tabStateMap?.canGoBack?.[ele.id];
    const canGoForward: boolean = tabStateMap?.canGoForward?.[String(ele?.id)];

    const onNavigationStateChange = (navState: any) => {
      console.log('navState', navState);
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
      }
    };

    if (isHidden) {
      return null;
    }

    return (
      <View key={ele.id} style={styles.webViewContainer}>
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
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
        <View style={styles.wrap}>
          <Touchable style={{ paddingHorizontal: pTd(12) }} onPress={() => showWalletInfo({ tabInfo: activeItem })}>
            <CommonAvatar
              hasBorder={!userInfo?.avatar}
              title={userInfo?.nickName}
              avatarSize={pTd(32)}
              imageUrl={userInfo?.avatar || ''}
              resizeMode="cover"
              titleStyle={{ fontSize: pTd(14) }}
            />
          </Touchable>
          <View style={rightDomStyle.contentWrap}>
            <Touchable onPress={event => onTouch(event, ele, canGoBack, canGoForward)} style={rightDomStyle.iconWrap}>
              <Svg icon="more-circle" size={20} color={darkColors.iconBase1} />
            </Touchable>
            <Touchable style={rightDomStyle.inputContent} onPress={handleSearch}>
              {!tabStateMap?.url?.includes('https://') && (
                <View style={rightDomStyle.iconGroupWrap}>
                  <Svg icon="warning-fill" size={12} iconStyle={{ marginRight: pTd(10) }} />
                </View>
              )}
              <TextM style={rightDomStyle.domain} numberOfLines={1}>
                {getHost(tabStateMap?.url)}
              </TextM>
            </Touchable>
            <Touchable onPress={() => activeWebViewRef.current?.reload?.()} style={rightDomStyle.iconWrap}>
              <Svg icon="accessory" size={20} color={darkColors.iconBase1} />
            </Touchable>
          </View>
          <Touchable
            onPress={() => clickBottomActionBtn('showTab')}
            style={[rightDomStyle.iconWrap, styles.switchButtonWrap]}>
            <TextM style={styles.switchButton}>{tabs?.length || 0}</TextM>
          </Touchable>
        </View>
      </View>
    );
  });
}

export default TabsDom;

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    position: 'relative',
    paddingBottom: pTd(72),
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
    backgroundColor: darkColors.bgBase2,
    height: pTd(72),
    zIndex: 10,
  },
});

const rightDomStyle = StyleSheet.create({
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
    borderColor: darkColors.borderBase1,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: pTd(217),
    height: pTd(30),
  },
  domain: {
    color: darkColors.textBase1,
    textAlign: 'center',
    lineHeight: pTd(14),
  },
  iconGroupWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    ...GStyles.paddingArg(pTd(4)),
  },
});
