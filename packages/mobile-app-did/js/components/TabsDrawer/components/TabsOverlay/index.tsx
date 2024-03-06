import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View, Share } from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Svg, { IconName } from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { FontStyles } from 'assets/theme/styles';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { isIOS } from '@rneui/base';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { request } from '@portkey-wallet/api/api-did';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';

enum HANDLE_TYPE {
  REFRESH = 'Refresh',
  COPY = 'Copy URL',
  SHARE = 'Share',
  CLOSE = 'Close',
  CANCEL = 'Cancel',
  SWITCH = 'Switch',
  BOOKMARK = 'Bookmark',
  UN_BOOKMARK = 'Delete Bookmark',
}

const BrowserEditModal = ({
  browserInfo,
  activeWebViewRef,
  activeWebviewScreenShot,
  setPreActiveTabId,
}: {
  browserInfo: ITabItem;
  activeWebViewRef: any;
  activeWebviewScreenShot: () => void;
  setPreActiveTabId: Dispatch<SetStateAction<number | undefined>>;
}) => {
  const { t } = useLanguage();
  const { activeTabId } = useAppCASelector(state => state.discover);
  const { bookmarkList, refresh } = useBookmarkList();
  const isBookmarkLoading = useRef(false);
  const [bookmark, setBookmark] = useState(bookmarkList.find(item => item.url === browserInfo?.url));
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const handleUrl = useCallback(
    async (type: HANDLE_TYPE) => {
      let isCopy = false;

      switch (type) {
        case HANDLE_TYPE.REFRESH:
          activeWebViewRef?.current?.reload?.();
          OverlayModal.hide();
          break;

        case HANDLE_TYPE.COPY:
          isCopy = await setStringAsync(browserInfo?.url || '');
          isCopy && CommonToast.success(t('Copy Success'));
          break;

        case HANDLE_TYPE.SHARE:
          await Share.share({
            message: isIOS ? browserInfo?.name ?? browserInfo.url : browserInfo?.url,
            url: browserInfo?.url ?? browserInfo?.name ?? '',
            title: browserInfo?.name ?? browserInfo.url,
          }).catch(shareError => {
            console.log(shareError);
          });
          break;

        case HANDLE_TYPE.CLOSE:
          OverlayModal.hide();
          break;

        case HANDLE_TYPE.CANCEL:
          OverlayModal.hide();
          break;

        case HANDLE_TYPE.SWITCH:
          if (!activeTabId) return;
          activeWebviewScreenShot();
          OverlayModal.hide();
          setPreActiveTabId(Number(browserInfo?.id));
          break;

        case HANDLE_TYPE.BOOKMARK:
          if (!isBookmarkLoading.current) {
            isBookmarkLoading.current = true;
            try {
              const result = await request.discover.addBookmark({
                params: {
                  name: browserInfo?.name || browserInfo?.url || '',
                  url: browserInfo?.url || '',
                },
              });
              setBookmark(result);
              CommonToast.success('Added successfully');
              refresh();
            } catch (error) {
              CommonToast.failError('Added failed');
            }
            isBookmarkLoading.current = false;
          }
          break;

        case HANDLE_TYPE.UN_BOOKMARK:
          if (!isBookmarkLoading.current) {
            isBookmarkLoading.current = true;
            try {
              await request.discover.deleteBookmark({
                params: {
                  deleteInfos: [
                    {
                      id: bookmark?.id,
                      index: bookmark?.index,
                    },
                  ],
                },
              });
              CommonToast.success('Deleted successfully');
              refresh();
              setBookmark(undefined);
            } catch (error) {
              CommonToast.failError('Deleted failed');
            }
            isBookmarkLoading.current = false;
          }
          break;
        default:
          break;
      }
    },
    [
      activeWebViewRef,
      browserInfo.url,
      browserInfo?.name,
      browserInfo?.id,
      t,
      activeTabId,
      activeWebviewScreenShot,
      setPreActiveTabId,
      refresh,
      bookmark?.id,
      bookmark?.index,
    ],
  );

  const handleArray: Array<{
    title: HANDLE_TYPE;
    icon: IconName;
  }> = useMemo(() => {
    return [
      { title: HANDLE_TYPE.REFRESH, icon: 'refresh1' },
      { title: HANDLE_TYPE.COPY, icon: 'copy1' },
      { title: HANDLE_TYPE.SHARE, icon: 'share' },
      {
        title: bookmark ? HANDLE_TYPE.UN_BOOKMARK : HANDLE_TYPE.BOOKMARK,
        icon: bookmark ? 'bookmarked' : 'bookmark',
      },
    ];
  }, [bookmark]);

  return (
    <View style={styles.modalStyle}>
      <View style={[GStyles.flexRow, GStyles.center]}>
        <DiscoverWebsiteImage size={pTd(32)} imageUrl={getCmsWebsiteInfoImageUrl(browserInfo?.url || '')} />
        <View style={styles.headerCenter}>
          <TextWithProtocolIcon title={browserInfo?.name} url={browserInfo.url} />
          <TextS numberOfLines={1} ellipsizeMode="tail" style={styles.url}>
            {getCmsWebsiteInfoName(browserInfo?.url) || browserInfo?.url}
          </TextS>
        </View>
        <Touchable onPress={() => handleUrl(HANDLE_TYPE.CANCEL)}>
          <Svg icon="close" size={pTd(12)} />
        </Touchable>
      </View>
      <View style={styles.listWrap}>
        {handleArray.map((ele, index) => (
          <Touchable key={index} style={styles.listItem} onPress={() => handleUrl(ele.title)}>
            <View style={[styles.svgWrap]}>
              <Svg icon={ele.icon} size={pTd(52)} />
            </View>
            <TextS key={index} style={[FontStyles.font3, styles.itemTitle]}>
              {ele.title}
            </TextS>
          </Touchable>
        ))}
      </View>
      <View style={styles.divider} />
      <Touchable style={[GStyles.center, styles.cancelButton]} onPress={() => handleUrl(HANDLE_TYPE.CANCEL)}>
        <TextL style={[GStyles.alignCenter, FontStyles.font3]}>{t('Cancel')}</TextL>
      </Touchable>
    </View>
  );
};

export const showBrowserModal = (props: {
  browserInfo: ITabItem;
  activeWebViewRef: any;
  activeWebviewScreenShot: () => void;
  setPreActiveTabId: Dispatch<SetStateAction<number | undefined>>;
}) => {
  OverlayModal.show(<BrowserEditModal {...props} />, {
    position: 'bottom',
    containerStyle: { backgroundColor: defaultColors.bg6 },
  });
};

export default {
  showBrowserModal,
};

const styles = StyleSheet.create({
  modalStyle: {
    ...GStyles.paddingArg(16, 20),
    backgroundColor: defaultColors.bg6,
    width: screenWidth,
  },
  headerCenter: {
    paddingLeft: pTd(8),
    paddingRight: pTd(16),
    flex: 1,
  },
  title: {
    textAlign: 'left',
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  url: {
    color: defaultColors.font7,
  },
  listWrap: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    marginHorizontal: pTd(12),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItem: {
    width: pTd(60),
    height: pTd(92),
    overflow: 'hidden',
    alignItems: 'center',
  },
  svgWrap: {
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    overflow: 'hidden',
    width: pTd(52),
  },
  itemTitle: {
    textAlign: 'center',
    marginTop: pTd(8),
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: defaultColors.bg7,
  },
  cancelButton: {
    height: pTd(44),
    fontSize: pTd(16),
  },
});
