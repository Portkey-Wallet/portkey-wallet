import React, { useMemo } from 'react';
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
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';

const MyWalletModal = () => {
  const { t } = useLanguage();
  const caInfo = useCurrentCaInfo();
  const { walletName, currentNetwork } = useWallet();

  const {
    accountToken: { accountTokenList },
  } = useAppCASelector(state => state.assets);

  const caInfoList = useMemo(() => {
    return Object.entries(caInfo || {})
      .map(([key, value]) => {
        const info = value as CAInfo;
        return info?.caAddress
          ? {
              chaiId: key,
              caAddress: info.caAddress,
              ...accountTokenList.find(token => token.chainId === key && token.symbol === ELF_SYMBOL),
            }
          : undefined;
      })
      .filter(item => !!item);
  }, [accountTokenList, caInfo]);

  return (
    <ModalBody modalBodyType="bottom" title={t('My Wallet')}>
      <View style={styles.contentWrap}>
        <TextM style={[styles.walletTitle, FontStyles.font3]}>{t('Wallet')}</TextM>
        <View style={styles.group}>
          <TextL style={(FontStyles.font5, fonts.mediumFont)}>{walletName}</TextL>
          {caInfoList?.map((item, index) => (
            <View key={item?.chaiId} style={[styles.itemWrap, !!index && styles.itemBorderTop]}>
              <View>
                <TextM>{formatStr2EllipsisStr(addressFormat(item?.caAddress, item?.chaiId as ChainId), 10)}</TextM>
                <TextS style={[styles.itemChainInfo, FontStyles.font3]}>
                  {formatChainInfoToShow(item?.chaiId as ChainId, currentNetwork)}
                </TextS>
              </View>
              <View>
                <TextS style={styles.itemBalance}>
                  {`${formatAmountShow(divDecimals(item?.balance, item?.decimals))} ${item?.symbol || '0'}`}
                </TextS>
                <TextS style={styles.itemChainInfo} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ModalBody>
  );
};

export const showWalletInfo = () => {
  OverlayModal.show(<MyWalletModal />, {
    position: 'bottom',
    containerStyle: { backgroundColor: defaultColors.bg6 },
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
  itemBalance: {},
});
