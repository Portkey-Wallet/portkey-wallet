import React, { useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { darkColors, defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextM, TextS } from 'components/CommonText';
import { useCurrentCaInfo, useCurrentUserInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { DarkFontStyles } from 'assets/theme/styles';
import { useCurrentChainList, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { useAppDispatch } from 'store/hooks';
import { useIsInCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import Svg from 'components/Svg';
import { copyText } from 'utils';
import Touchable from 'components/Touchable';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import CommonAvatar from 'components/CommonAvatar';

type MyWalletModalType = {
  tabInfo: ITabItem;
};

const MyWalletModal = ({ tabInfo }: MyWalletModalType) => {
  const { t } = useLanguage();
  const checkDapp = useIsInCurrentDappList();
  const dispatch = useAppDispatch();
  const caInfo = useCurrentCaInfo();
  const { currentNetwork } = useWallet();
  const userInfo = useCurrentUserInfo();
  const defaultToken = useDefaultToken();
  const { accountTokenList } = useAccountTokenInfo();
  const currentChainList = useCurrentChainList();

  const getChainInfoByChainId = useCallback(
    (chainId: string) => {
      if (!currentChainList) {
        return undefined;
      }
      return currentChainList.find(chain => chain.chainId === chainId);
    },
    [currentChainList],
  );

  const caInfoList = useMemo(() => {
    return Object.entries(caInfo || {})
      .map(([key, value]) => {
        const info = value as CAInfo;
        return info?.caAddress
          ? {
              chainId: key,
              caAddress: info.caAddress,
              ...accountTokenList.find(token => token.chainId === key && token.symbol === defaultToken.symbol),
            }
          : undefined;
      })
      .filter(item => !!item);
  }, [accountTokenList, caInfo, defaultToken.symbol]);

  const disconnectDapp = useCallback(() => {
    try {
      dispatch(removeDapp({ networkType: currentNetwork, origin: getOrigin(tabInfo.url) }));
      OverlayModal.hide();
    } catch (error) {
      console.log(error);
    }
  }, [currentNetwork, dispatch, tabInfo.url]);

  const showDisconnect = useMemo(() => checkDapp(getOrigin(tabInfo.url)), [checkDapp, tabInfo.url]);

  return (
    <ModalBody modalBodyType="bottom" title={t('My Wallet')}>
      <View style={styles.contentWrap}>
        <View style={styles.userInfoWrap}>
          <View style={styles.userInfo}>
            <CommonAvatar
              hasBorder={!userInfo?.avatar}
              title={userInfo?.nickName}
              avatarSize={pTd(32)}
              imageUrl={userInfo?.avatar || ''}
              resizeMode="cover"
              titleStyle={{ fontSize: pTd(14) }}
            />
            <View style={[styles.badgeWrap, showDisconnect && { backgroundColor: darkColors.iconSuccess1 }]} />
            <TextS style={(DarkFontStyles.textBase1, fonts.mediumFont)}>{userInfo?.nickName}</TextS>
          </View>
          {showDisconnect ? (
            <Touchable onPress={disconnectDapp}>
              <Svg icon="logout" size={pTd(24)} />
            </Touchable>
          ) : (
            <TextS style={(fonts.mediumFont, DarkFontStyles.textBase3)}>Not connected</TextS>
          )}
        </View>
        <View style={styles.group}>
          {caInfoList?.reverse()?.map(item => (
            <View key={item?.chainId} style={[styles.itemWrap]}>
              <View key={item?.chainId} style={styles.itemContent}>
                <CommonAvatar imageUrl={getChainInfoByChainId(item?.chainId)?.chainImageUrl} avatarSize={pTd(24)} />
                <View style={{ paddingLeft: pTd(12) }}>
                  <TextM>{formatStr2EllipsisStr(addressFormat(item?.caAddress, item?.chainId as ChainId), 8)}</TextM>
                  <TextS style={[styles.itemChainInfo, DarkFontStyles.textBase2]}>
                    {formatChainInfoToShow(item?.chainId as ChainId, currentNetwork)}
                  </TextS>
                </View>
              </View>

              <Touchable onPress={() => copyText(addressFormat(item?.caAddress, item?.chainId as ChainId))}>
                <Svg icon="copy" size={pTd(16)} />
              </Touchable>
            </View>
          ))}
        </View>
      </View>
    </ModalBody>
  );
};

export const showWalletInfo = (props: MyWalletModalType) => {
  OverlayModal.show(<MyWalletModal {...props} />, {
    position: 'bottom',
  });
};

export default {
  showWalletInfo,
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  userInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderBase1,
    marginTop: pTd(8),
    borderRadius: pTd(30),
    paddingHorizontal: pTd(16),
  },
  userInfo: {
    paddingVertical: pTd(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrap: {
    marginHorizontal: pTd(8),
    width: pTd(8),
    height: pTd(8),
    borderRadius: pTd(4),
    backgroundColor: darkColors.iconBase3,
  },
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: pTd(8),
    borderRadius: pTd(6),
  },
  walletTitle: {
    marginTop: pTd(24),
    paddingLeft: pTd(10),
  },
  itemWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemBorderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  itemChainInfo: {
    marginTop: pTd(4),
  },
  btnWrap: {
    height: pTd(48),
    width: '100%',
  },
  buttonContainer: {
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
  },
  copyBtnWrap: {
    height: '100%',
    paddingTop: pTd(2),
    paddingLeft: pTd(8),
  },
});
