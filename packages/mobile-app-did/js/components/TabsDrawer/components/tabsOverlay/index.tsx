import React, { useCallback } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, TouchableOpacity, View, Share } from 'react-native';
import { TextL, TextS } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import CommonAvatar from 'components/CommonAvatar';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { FontStyles } from 'assets/theme/styles';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { getFaviconUrl } from 'utils';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';

import { isIOS } from '@rneui/base';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { setActiveTab } from '@portkey-wallet/store/store-ca/discover/slice';

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
  handleReload,
}: {
  browserInfo: IRecordsItemType;
  setBrowserInfo: any;
  handleReload: any;
}) => {
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();

  const handleUrl = useCallback(
    async (type: HANDLE_TYPE) => {
      let isCopy = false;

      switch (type) {
        case HANDLE_TYPE.REFRESH:
          handleReload?.();
          OverlayModal.hide();
          break;

        case HANDLE_TYPE.COPY:
          isCopy = await setStringAsync(browserInfo?.url || '');
          isCopy && CommonToast.success(t('Copy Success'));
          break;

        case HANDLE_TYPE.SHARE:
          await Share.share({
            message: isIOS ? browserInfo?.title ?? browserInfo.url : browserInfo?.url,
            url: browserInfo?.url ?? browserInfo?.title ?? '',
            title: browserInfo?.title ?? browserInfo.url,
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
          OverlayModal.hide();
          dispatch(setActiveTab(undefined));
          break;

        default:
          break;
      }
    },
    [handleReload, browserInfo.url, browserInfo?.title, t, dispatch],
  );

  return (
    <View style={styles.modalStyle}>
      <View style={[GStyles.flexRow, GStyles.center, styles.headerWrap]}>
        <CommonAvatar avatarSize={pTd(32)} imageUrl={getFaviconUrl(browserInfo?.url || '')} />
        <TextL ellipsizeMode="tail" style={[GStyles.flex1, styles.title]}>
          {browserInfo?.title}
        </TextL>

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

export const showBrowserModal = (props: { browserInfo: IRecordsItemType; setBrowserInfo: any; handleReload: any }) => {
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
  headerWrap: {},
  title: {
    textAlign: 'left',
    height: pTd(22),
    lineHeight: pTd(22),
    marginVertical: pTd(13),
    paddingLeft: pTd(8),
    ...fonts.mediumFont,
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
    borderRadius: pTd(6),
    overflow: 'hidden',
  },
  listItemNoMarginRight: {
    marginRight: 0,
  },
  svgWrap: {
    backgroundColor: defaultColors.bg1,
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
