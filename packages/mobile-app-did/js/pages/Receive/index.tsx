import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { TextM, TextS } from 'components/CommonText';
import AccountCard from 'pages/Receive/components/AccountCard';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import fonts from 'assets/theme/fonts';
import { RichText } from 'components/RichText';
import CommonTouchableTabs, { TabItemType } from 'components/CommonTouchableTabs';
import BuyForm from 'pages/Ramp/components/BuyForm';
import DepositCard, { DepositMode } from './components/DepositCard';
import { checkEnabledFunctionalTypes } from '@portkey-wallet/utils/compass';
import { ETransTokenList } from '@portkey-wallet/constants/constants-ca/dapp';
import { useAppETransShow } from 'hooks/cms';
import { SHOW_RAMP_SYMBOL_LIST } from '@portkey-wallet/constants/constants-ca/ramp';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { TokenTitle } from 'components/TokenTitle';
import navigationService from 'utils/navigationService';
import { ReceivePageTabType } from './types';
import { CopyButton } from 'components/CopyButton';

export default function Receive() {
  const { t } = useLanguage();
  const tokenItem = useRouterParams<TokenItemShowType & { targetScene: ReceivePageTabType }>();
  const { chainId, symbol, targetScene } = tokenItem;
  const currentWallet = useCurrentWalletInfo();
  const [selectTab, setSelectTab] = useState<ReceivePageTabType>(targetScene || ReceivePageTabType.QR_CODE);
  const { buy, deposit } = checkEnabledFunctionalTypes(symbol, chainId === 'AELF');
  const isETransToken = useMemo(() => ETransTokenList.includes(symbol), [symbol]);
  const isMainnet = useIsMainnet();
  const { isETransDepositShow } = useAppETransShow();
  const { isRampShow } = useAppRampEntryShow();
  const isDepositShow = useMemo(
    () => isETransToken && isETransDepositShow && deposit,
    [isETransToken, isETransDepositShow, deposit],
  );
  const isBuyButtonShow = useMemo(
    () => SHOW_RAMP_SYMBOL_LIST.includes(symbol) && chainId === 'AELF' && isRampShow && isMainnet && buy,
    [buy, isMainnet, isRampShow, chainId, symbol],
  );

  const tabs: TabItemType<ReceivePageTabType>[] = useMemo(() => {
    const tabList: TabItemType<ReceivePageTabType>[] = [{ name: t('QR Code'), type: ReceivePageTabType.QR_CODE }];
    if (isDepositShow || targetScene === ReceivePageTabType.DEPOSIT) {
      tabList.push({ name: t('Deposit'), type: ReceivePageTabType.DEPOSIT });
    } else {
      tabList.push({ name: t('Exchanges'), type: ReceivePageTabType.EXCHANGES });
    }
    if (isBuyButtonShow || targetScene === ReceivePageTabType.BUY) {
      tabList.push({ name: t('Buy'), type: ReceivePageTabType.BUY });
    }
    return tabList;
  }, [isBuyButtonShow, isDepositShow, t, targetScene]);

  const currentCaAddress = currentWallet?.[chainId]?.caAddress;

  const onClickDepositButton = useCallback(() => {
    navigationService.navigate('Deposit', tokenItem);
  }, [tokenItem]);

  const toCaAddress = useMemo(() => `ELF_${currentCaAddress}_${chainId}`, [currentCaAddress, chainId]);

  const OriginalQrCodePage = useCallback(() => {
    return (
      <View>
        <AccountCard toCaAddress={toCaAddress} tokenInfo={tokenItem} style={styles.accountCardStyle} />

        <View style={[GStyles.flexCol, GStyles.itemStart, GStyles.spaceBetween, styles.addressWrap]}>
          <TextS style={styles.aelfAddressTitle}>{'Your aelf address'}</TextS>
          <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween]}>
            <TextM style={styles.address}>
              {formatStr2EllipsisStr(addressFormat(currentCaAddress, chainId, 'aelf'), 32)}
            </TextM>
            <CopyButton copyContent={toCaAddress} />
          </View>
        </View>

        <View style={[infoStyle.wrap, infoStyle.flex]}>
          <Svg icon="more-info" size={pTd(16)} iconStyle={infoStyle.icon} color={defaultColors.bg30} />
          <RichText
            text={`Please use this address for receiving assets on the $aelf network$ only.${
              tabs.some(it => it.type === ReceivePageTabType.EXCHANGES)
                ? ' If you wish to receive assets from exchanges, please switch to the "Exchanges" tab on the right.'
                : ''
            }`}
            commonTextStyle={infoStyle.commonText}
            wrapperStyle={infoStyle.wrapperText}
            textDivider={'$'}
          />
        </View>
      </View>
    );
  }, [toCaAddress, tokenItem, currentCaAddress, chainId, tabs]);

  return (
    <PageContainer
      titleDom={<TokenTitle tokenInfo={tokenItem} />}
      safeAreaColor={['white']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <CommonTouchableTabs
        tabList={tabs}
        selectTab={selectTab}
        onTabPress={(type: ReceivePageTabType) => setSelectTab(type)}
        tabHeaderStyle={styles.tabHeader}
      />
      {selectTab === ReceivePageTabType.QR_CODE && <OriginalQrCodePage />}
      {(selectTab === ReceivePageTabType.EXCHANGES || selectTab === ReceivePageTabType.DEPOSIT) && (
        <DepositCard
          mode={selectTab === ReceivePageTabType.EXCHANGES ? DepositMode.EXCHANGE : DepositMode.DEPOSIT}
          token={tokenItem}
          onClickDepositButton={onClickDepositButton}
        />
      )}
      {selectTab === ReceivePageTabType.BUY && (
        <View style={GStyles.flex1}>
          <BuyForm symbol={symbol} />
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: defaultColors.bg1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: pTd(16),
  },
  aelfAddressTitle: {
    color: defaultColors.font11,
    lineHeight: pTd(16),
    marginBottom: pTd(8),
  },
  tabHeader: {
    marginTop: pTd(16),
  },
  accountCardStyle: {
    marginTop: pTd(0),
    marginBottom: 0,
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tips: {
    marginTop: pTd(16),
    width: '100%',
    color: defaultColors.font3,
    textAlign: 'center',
  },
  addressWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: pTd(6),
    paddingHorizontal: pTd(12),
    paddingVertical: pTd(12),
    marginTop: pTd(32),
    borderColor: defaultColors.border6,
  },
  copyIcon: {
    borderRadius: 6,
    marginLeft: pTd(12),
  },
  address: {
    lineHeight: pTd(20),
    width: pTd(270),
    color: defaultColors.font5,
    ...fonts.mediumFont,
    paddingRight: pTd(12),
  },
});

const infoStyle = StyleSheet.create({
  wrap: {
    marginTop: pTd(24),
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  wrapperText: {
    flex: 22,
    paddingLeft: pTd(6),
  },
  commonText: {
    fontSize: pTd(12),
    lineHeight: pTd(16),
    color: defaultColors.font11,
  },
  specialText: {
    fontSize: pTd(12),
    lineHeight: pTd(16),
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  icon: {
    marginTop: pTd(2),
  },
});
