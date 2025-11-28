import { defaultColors } from 'assets/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextL } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import ActionSheet from 'components/ActionSheet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useReceive } from '../hooks';
import navigationService from 'utils/navigationService';
import CommonToast from 'components/CommonToast';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import ramp, {
  IBuyProviderPrice,
  IRampCryptoItem,
  IRampFiatItem,
  IRampProviderInfo,
  IRampProviderType,
  ISellProviderPrice,
  RampType,
} from '@portkey-wallet/ramp';
import { useEffectOnce } from '@portkey-wallet/hooks';
import CommonAvatar from 'components/CommonAvatar';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useGuardiansInfo } from 'hooks/store';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { RAMP_BUY_URL, RAMP_SELL_URL } from 'constants/common';
import { checkIsSvgUrl } from 'utils';
import { Image } from 'react-native';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { useAppRampEntryShow } from 'hooks/ramp';

interface RouterParams {
  type?: RampType;
  crypto?: IRampCryptoItem;
  fiat?: IRampFiatItem;
  amount?: string;
  rate?: string;
  guardiansApproved?: GuardiansApprovedType[];
}

type ImageSizeType = {
  w?: number;
  h?: number;
  isSvg: boolean;
};

const ProviderImageHeight = pTd(24);
const ProviderSvgWidth = pTd(120);

const ProviderCard: React.FC<{
  crypto: IRampCryptoItem | undefined;
  fiat: IRampFiatItem | undefined;
  item: IBuyProviderPrice | ISellProviderPrice;
  currentProviderKey: string | undefined;
  size?: ImageSizeType;
}> = ({ crypto, fiat, item, currentProviderKey, size }) => {
  const isActive = currentProviderKey === item.providerInfo.key;
  const styles = getStyles();
  console.log('item: ', item);

  return (
    <View style={[styles.providerWrap, isActive && styles.providerActiveStyle]}>
      {isActive && (
        <View style={styles.providerActiveTagWrap}>
          <Svg size={pTd(24)} icon="check-circle" />
        </View>
      )}
      <View style={styles.logoWrap}>
        {size && (
          <CommonAvatar
            width={size.isSvg ? ProviderSvgWidth : size.w}
            height={size.h || ProviderImageHeight}
            shapeType={'square'}
            preserveAspectRatio="xMinYMid meet"
            style={styles.providerImgStyle}
            imageUrl={item.providerInfo.logo}
          />
        )}
      </View>
      <View style={GStyles.flexRow}>
        {item.providerInfo.paymentTags.map((iconUrl, idx) => (
          <View key={idx} style={styles.iconWrap}>
            <CommonAvatar
              width={pTd(32)}
              height={pTd(16)}
              shapeType={'square'}
              style={styles.imgStyle}
              imageUrl={iconUrl || ''}
            />
          </View>
        ))}
      </View>
      <TextM style={styles.exchangeText}>{`1 ${crypto?.symbol || ''} ≈ ${item.exchange} ${fiat?.symbol}`}</TextM>
    </View>
  );
};

export default function RampPreview() {
  const {
    type = RampType.BUY,
    crypto,
    fiat,
    amount,
    rate: rateProps,
    guardiansApproved,
  } = useRouterParams<RouterParams>();
  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);
  const { providerPriceList, refreshReceive } = useReceive({
    type,
    amount: amount || '',
    fiat,
    crypto,
    initialRate: rateProps,
    isProviderShow: true,
  });
  const isBuy = useMemo(() => type === RampType.BUY, [type]);
  const wallet = useCurrentWalletInfo();
  const [providerKey, setProviderKey] = useState<string>();
  const { refreshRampShow } = useAppRampEntryShow();
  const { userGuardiansList } = useGuardiansInfo();
  const styles = getStyles();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffectOnce(() => {
    refreshReceive();
  });

  useEffect(() => {
    if (!providerPriceList.length) {
      setProviderKey(undefined);
      return;
    }
    setProviderKey(pre => {
      if (pre) {
        const preProvider = providerPriceList.find(item => item.providerInfo.key === pre);
        if (preProvider) {
          return pre;
        }
      }
      return providerPriceList[0].providerInfo.key;
    });
  }, [providerPriceList]);

  const onProviderChange = useCallback((provider: IRampProviderInfo) => {
    setProviderKey(provider.key);
  }, []);

  const currentProvider = useMemo(
    () => providerPriceList.find(item => item.providerInfo.key === providerKey),
    [providerKey, providerPriceList],
  );

  const [providerImageSizeMap, setProviderImageSizeMap] = useState<Record<string, ImageSizeType>>({});
  const providerImageSizeMapRef = useRef(providerImageSizeMap);
  providerImageSizeMapRef.current = providerImageSizeMap;
  useEffect(() => {
    const _providerImageSizeMap = providerImageSizeMapRef.current;
    providerPriceList.forEach(item => {
      const key = item?.providerInfo?.key;
      const logo = item?.providerInfo?.logo;
      if (!key || !logo || _providerImageSizeMap[key]) {
        return;
      }
      if (checkIsSvgUrl(logo)) {
        setProviderImageSizeMap(pre => ({
          ...pre,
          [key]: {
            isSvg: true,
          },
        }));
        return;
      }
      Image.getSize(logo, (w, h) => {
        setProviderImageSizeMap(pre => ({
          ...pre,
          [key]: {
            w: (w / h) * ProviderImageHeight,
            h: ProviderImageHeight,
            isSvg: false,
          },
        }));
      });
    });
  }, [providerPriceList]);

  const goPayPage = useCallback(async () => {
    if (!providerKey || !amount || !fiat || !crypto) {
      return;
    }

    try {
      const provider = ramp.getProvider(providerKey as IRampProviderType);
      if (!provider) {
        throw new Error('Failed to get ramp provider');
      }

      const emailGuardian = userGuardiansList?.find(
        item => item.guardianType === LoginType.Email && item.isLoginAccount,
      );

      setButtonLoading(true);
      const showResult = await refreshRampShow();
      const isSectionShow = type === RampType.BUY ? showResult.isBuySectionShow : showResult.isSellSectionShow;
      if (!isSectionShow) {
        CommonToast.fail('Sorry, the service you are using is temporarily unavailable.');
        navigationService.navigate('Tab');
        setButtonLoading(false);
        return;
      }

      const { url, orderId } = await provider.createOrder({
        type,
        address: wallet?.AELF?.caAddress || '',
        email: emailGuardian?.guardianAccount,
        crypto: currentProvider?.providerSymbol || crypto.symbol || '',
        network: currentProvider?.providerNetwork || '',
        country: fiat.country || '',
        fiat: fiat.symbol || '',
        amount: amount,
        withdrawUrl: type === RampType.BUY ? RAMP_BUY_URL : RAMP_SELL_URL,
      });

      navigationService.navigate('ViewOnWebView', {
        title: `${isBuy ? 'Buy' : 'Sell'} ${crypto.symbol}`,
        url: url,
        webViewPageType: type === RampType.BUY ? 'ramp-buy' : 'ramp-sell',
        injectedJavaScript: undefined,
        params:
          type === RampType.BUY
            ? undefined
            : {
                orderId,
                guardiansApproved,
              },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
    }
  }, [
    amount,
    crypto,
    currentProvider?.providerNetwork,
    currentProvider?.providerSymbol,
    fiat,
    guardiansApproved,
    providerKey,
    refreshRampShow,
    type,
    userGuardiansList,
    wallet?.AELF?.caAddress,
    setButtonLoading,
  ]);

  const receiveAmount = useMemo(() => {
    if (!currentProvider) {
      return '';
    }
    return isBuy
      ? (currentProvider as IBuyProviderPrice).cryptoAmount
      : (currentProvider as ISellProviderPrice).fiatAmount;
  }, [currentProvider, isBuy]);

  return (
    <PageContainer
      safeAreaColor={['black']}
      titleDom={`${isBuy ? 'Buy' : 'Sell'} ${defaultToken.symbol} `}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        <View style={styles.amountContainer}>
          <TextM style={styles.primaryUnit}>{`${formatAmountShow(amount || '', 4)} ${
            isBuy ? fiat?.symbol || '' : crypto?.symbol || ''
          }`}</TextM>
          <TextL style={styles.receiveAmount}>
            ≈ {receiveAmount} {isBuy ? crypto?.symbol || '' : fiat?.symbol || ''}
          </TextL>
        </View>

        <TextL style={styles.serviceLabel}>Select provider:</TextL>
        {providerPriceList.map((item, idx) => (
          <Touchable
            onPress={() => {
              onProviderChange(item.providerInfo);
            }}
            key={idx}>
            <ProviderCard
              crypto={crypto}
              fiat={fiat}
              item={item}
              currentProviderKey={providerKey}
              size={providerImageSizeMap[item?.providerInfo?.key || '']}
            />
          </Touchable>
        ))}
      </View>
      <View>
        {currentProvider && (
          <>
            <View style={styles.disclaimerWrap}>
              <Svg icon="info" size={pTd(22)} iconStyle={styles.disclaimerIcon} />
              <TextM style={styles.disclaimerText}>
                By proceeding, you acknowledge that you have read and understood the{' '}
                <TextM
                  style={styles.disclaimerHighlightText}
                  onPress={() => {
                    ActionSheet.alert({
                      title: 'Disclaimer',
                      title2: (
                        <TextM style={[styles.disclaimerContent, GStyles.marginBottom(12)]}>
                          {`${currentProvider.providerInfo.name} operates as an independent fiat-to-crypto platform under a third-party entity. Portkey Wallet assumes no liability for any losses or damages arising from the use of ${currentProvider.providerInfo.name} services.`}
                        </TextM>
                      ),
                      buttons: [{ title: 'Close' }],
                    });
                  }}>
                  Disclaimer
                </TextM>
                .
              </TextM>
            </View>
            <CommonButton
              loading={buttonLoading}
              type="primary"
              disabled={!providerKey}
              onPress={() => {
                goPayPage();
              }}>
              {`${isBuy ? 'Buy' : 'Sell'}`}
            </CommonButton>
          </>
        )}
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: pTd(16),
  },
  amountContainer: {
    marginTop: pTd(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryUnit: {
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  receiveAmount: {
    fontSize: pTd(16),
    color: theme.colors.textBase2,
  },
  serviceLabel: {
    marginTop: pTd(48),
    ...fonts.BGMediumFont,
  },
  providerWrap: {
    marginTop: pTd(16),
    borderRadius: pTd(16),
    borderColor: theme.colors.borderBase1,
    borderWidth: pTd(1),
    overflow: 'hidden',
    ...GStyles.paddingArg(16, 16),
  },
  providerActiveStyle: {
    borderColor: theme.colors.borderBrand1,
  },
  providerActiveTagWrap: {
    width: pTd(24),
    height: pTd(24),
    position: 'absolute',
    right: pTd(16),
    top: pTd(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerImgStyle: {
    borderRadius: pTd(8),
    backgroundColor: 'transparent',
  },
  imgStyle: {
    borderRadius: pTd(8),
    backgroundColor: 'white',
  },
  logoWrap: {
    width: pTd(120),
    height: pTd(24),
    marginBottom: pTd(10),
  },
  iconWrap: {
    width: pTd(36),
    height: pTd(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(4),
    borderWidth: 1,
    borderColor: defaultColors.border6,
    backgroundColor: 'white',
    marginRight: pTd(6),
    marginBottom: pTd(12),
  },
  exchangeText: {
    color: theme.colors.textBase2,
  },
  disclaimerWrap: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(16),
    padding: pTd(16),
    flexDirection: 'row',
    marginBottom: pTd(42),
  },
  disclaimerIcon: {},
  disclaimerText: {
    marginLeft: pTd(12),
    flex: 1,
    color: theme.colors.textBase2,
  },
  disclaimerHighlightText: {
    color: theme.colors.textBrand1,
  },
  disclaimerContent: {
    color: theme.colors.textBase1,
  },
}));
