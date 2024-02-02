import React, { useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL, TextM, TextS } from 'components/CommonText';
import { useCurrentCaInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { useAppDispatch } from 'store/hooks';
import { useIsInCurrentDappList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import CommonButton from 'components/CommonButton';
import Svg from 'components/Svg';
import { copyText } from 'utils';
import Touchable from 'components/Touchable';

type MyWalletModalType = {
  tabInfo: ITabItem;
};

const MyWalletModal = ({ tabInfo }: MyWalletModalType) => {
  const { t } = useLanguage();
  const checkDapp = useIsInCurrentDappList();
  const dispatch = useAppDispatch();
  const caInfo = useCurrentCaInfo();
  const { userInfo, currentNetwork } = useWallet();
  const defaultToken = useDefaultToken();

  const {
    accountToken: { accountTokenList },
  } = useAppCASelector(state => state.assets);

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
        <TextM style={[styles.walletTitle, FontStyles.font3]}>{t('Wallet')}</TextM>
        <View style={styles.group}>
          <TextL style={(FontStyles.font5, fonts.mediumFont)}>{userInfo?.nickName}</TextL>
          {caInfoList?.map((item, index) => (
            <View key={item?.chainId} style={[styles.itemWrap, !!index && styles.itemBorderTop]}>
              <View>
                <TextM>{formatStr2EllipsisStr(addressFormat(item?.caAddress, item?.chainId as ChainId), 8)}</TextM>
                <TextS style={[styles.itemChainInfo, FontStyles.font3]}>
                  {formatChainInfoToShow(item?.chainId as ChainId, currentNetwork)}
                </TextS>
              </View>
              <View style={styles.copyBtnWrap}>
                <Touchable onPress={() => copyText(addressFormat(item?.caAddress, item?.chainId as ChainId))}>
                  <Svg icon="copy" size={pTd(16)} />
                </Touchable>
              </View>

              <View>
                <TextS>
                  {`${formatAmountShow(divDecimals(item?.balance, item?.decimals))} ${item?.symbol || '0'}`}
                </TextS>
                <TextS style={styles.itemChainInfo} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {showDisconnect && (
        <View style={[GStyles.center, GStyles.paddingArg(10, 20, 18), styles.buttonContainer]}>
          <CommonButton
            buttonStyle={BGStyles.bg1}
            titleStyle={FontStyles.font12}
            type="clear"
            title="Disconnect"
            onPress={disconnectDapp}
          />
        </View>
      )}
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
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginTop: pTd(8),
    borderRadius: pTd(6),
    ...GStyles.paddingArg(16, 16, 0),
  },
  walletTitle: {
    marginTop: pTd(24),
    paddingLeft: pTd(10),
  },
  itemWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: pTd(16),
    paddingBottom: pTd(16),
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
    flex: 1,
    height: '100%',
    paddingTop: pTd(2),
    paddingLeft: pTd(8),
  },
});
