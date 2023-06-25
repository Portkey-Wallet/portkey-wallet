import React, { Dispatch, SetStateAction, useCallback } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, TouchableOpacity, View, Share } from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { FontStyles } from 'assets/theme/styles';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { getFaviconUrl, getHost } from '@portkey-wallet/utils/dapp/browser';

import { isIOS } from '@rneui/base';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';

enum HANDLE_TYPE {
  REFRESH = 'Refresh',
  COPY = 'Copy URL',
  SHARE = 'Share',
  CLOSE = 'Close',
  CANCEL = 'Cancel',
  SWITCH = 'Switch',
}

const handleArray = [
  { title: HANDLE_TYPE.REFRESH, icon: 'refresh1' },
  { title: HANDLE_TYPE.COPY, icon: 'copy1' },
  { title: HANDLE_TYPE.SHARE, icon: 'share' },
  { title: HANDLE_TYPE.SWITCH, icon: 'switch' },
] as const;

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
    ],
  );

  return (
    <View style={styles.modalStyle}>
      <View style={[GStyles.flexRow, GStyles.center]}>
        <DiscoverWebsiteImage size={pTd(32)} imageUrl={getFaviconUrl(browserInfo?.url || '')} />
        <View style={styles.headerCenter}>
          <TextL numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {browserInfo?.name || getHost(browserInfo?.url)}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode="tail" style={styles.url}>
            {browserInfo?.url}
          </TextS>
        </View>
        <TouchableOpacity onPress={() => handleUrl(HANDLE_TYPE.CANCEL)}>
          <Svg icon="close" size={pTd(12)} />
        </TouchableOpacity>
      </View>
      <View style={styles.listWrap}>
        {handleArray.map((ele, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.listItem, index % 4 === 3 && styles.listItemNoMarginRight]}
            onPress={() => handleUrl(ele.title)}>
            <View style={[styles.svgWrap]}>
              <Svg icon={ele.icon} size={pTd(52)} />
            </View>
            <TextS key={index} style={[FontStyles.font3, styles.itemTitle]}>
              {ele.title}
            </TextS>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.divider} />
      <TouchableOpacity style={[GStyles.center, styles.cancelButton]} onPress={() => handleUrl(HANDLE_TYPE.CANCEL)}>
        <TextL style={[GStyles.alignCenter, FontStyles.font3]}>{t('Cancel')}</TextL>
      </TouchableOpacity>
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
    paddingLeft: pTd(12),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  listItem: {
    marginRight: pTd(34),
    overflow: 'hidden',
  },
  listItemNoMarginRight: {
    marginRight: 0,
  },
  svgWrap: {
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
    overflow: 'hidden',
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
