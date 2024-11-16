import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, GestureResponderEvent, Animated, FlatList } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { darkColors, defaultColors } from 'assets/theme';
import { TextL, TextM, TextXXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import SafeAreaBox from 'components/SafeAreaBox';
import Svg from 'components/Svg';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ScreenWidth, Skeleton } from '@rneui/base';
import { bottomBarHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';
import { copyText } from 'utils';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import Touchable from 'components/Touchable';
import NFTAvatar from 'components/NFTAvatar';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { SeedTypeEnum, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useNFTItemDetail } from '@portkey-wallet/hooks/hooks-ca/assets';
import FloatOverlay from 'components/FloatOverlay';
import { ListItemType } from 'components/FloatOverlay/Popover';
import { measurePageY } from 'utils/measure';
import { useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { makeStyles, useTheme } from '@rneui/themed';
import OutlinedTextButton from 'components/OutlinedTextButton';
import CommonAvatar from 'components/CommonAvatar';
import Divider from 'components/Divider';
import TraitsItem from './TraitsItem';
import { ChainId } from '@portkey-wallet/types';
import { PortkeyLinearGradientV2 } from 'components/PortkeyLinearGradient';
import { Text } from 'react-native';

export interface TokenDetailProps {
  route?: any;
}

interface INftDetailPage extends NFTItemBaseType {
  collectionInfo?: {
    imageUrl: string;
    collectionName: string;
    itemCount: number;
    symbol: string;
    chainId: ChainId;
  };
}

const NFTDetail: React.FC<TokenDetailProps> = () => {
  const { t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout>();
  const nftItem = useRouterParams<INftDetailPage>();
  const fetchNftDetail = useNFTItemDetail();
  const setUserInfo = useSetUserInfo();
  const [scrollY] = useState(new Animated.Value(0));
  const styles = getStyles();
  const [nftDetailInfo, setNftDetailInfo] = useState<INftDetailPage>(nftItem);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  const {
    alias,
    balance,
    isSeed,
    seedType,
    chainId,
    imageUrl,
    imageLargeUrl,
    symbol,
    tokenContractAddress,
    tokenId,
    decimals,
    totalSupply,
    inscriptionName,
    limitPerMint,
    expires,
    seedOwnedSymbol,
    recommendedRefreshSeconds,
    generation,
    collectionInfo,
    traitsPercentages,
    chainImageUrl,
    displayChainName,
    description,
  } = nftDetailInfo;
  const { theme } = useTheme();

  const isFetchingTraits = useMemo(() => traitsPercentages && traitsPercentages?.length === 0, [traitsPercentages]);

  const fetchDetail = useLockCallback(async () => {
    try {
      const result = await fetchNftDetail({
        symbol,
        chainId,
      });
      setNftDetailInfo(pre => ({ ...pre, ...result }));
    } catch (error) {
      console.log('fetchDetail error', error);
      CommonToast.failError(error);
    }
  }, [fetchNftDetail, chainId, symbol]);

  const handleList = useMemo((): ListItemType[] => {
    return [
      {
        title: 'Set as Profile Photo',
        iconName: 'profile',
        iconColor: theme.colors.iconBase1,
        onPress: async () => {
          try {
            Loading.show();
            await setUserInfo({
              avatar: imageUrl,
            });
            CommonToast.success('Profile photo is set.');
          } catch (error) {
            CommonToast.fail('Failed to set profile photo. Please try again.');
            console.log('error', error);
          } finally {
            Loading.hide();
          }
        },
      },
    ];
  }, [imageUrl, setUserInfo]);

  const onPressMore = useCallback(
    async (event: GestureResponderEvent) => {
      const { pageY } = event.nativeEvent;

      const top = await measurePageY(event.target);
      FloatOverlay.showFloatPopover({
        list: handleList,
        formatType: 'fixedWidth',
        customPosition: { right: pTd(8), top: (top || pageY) + 30 },
        customBounds: {
          x: screenWidth - pTd(20),
          y: pageY,
          width: 0,
          height: 0,
        },
        contentStyle: { color: darkColors.textBase1 },
        containerStyle: { backgroundColor: darkColors.bgBase1, borderColor: darkColors.borderBase1, borderWidth: 1 },
      });
    },
    [handleList],
  );

  useEffect(() => {
    if (traitsPercentages && recommendedRefreshSeconds) {
      fetchDetail();
      timerRef.current = setInterval(async () => {
        await fetchDetail();
      }, recommendedRefreshSeconds * 1000);
    }
    return () => timerRef.current && clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 424, 425], // Adjust the range as needed
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  return (
    <SafeAreaBox style={styles.pageWrap}>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, GStyles.itemCenter]}>
        <Touchable style={styles.iconWrap} onPress={() => navigationService.goBack()}>
          <Svg icon="left-arrow-v2" size={pTd(20)} />
        </Touchable>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>{alias}</Animated.Text>
        <Touchable onPress={onPressMore}>
          <Svg icon="more_verti" size={pTd(24)} color={defaultColors.icon2} />
        </Touchable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}>
        <NFTAvatar
          disabled
          isSeed={isSeed}
          seedType={seedType}
          nftSize={pTd(361)}
          badgeSizeType="large"
          data={{
            alias,
            imageUrl: imageLargeUrl || imageUrl,
            tokenId,
          }}
          style={styles.image}
        />
        <TextM
          style={[
            styles.balance,
            FontStyles.fontBase1,
            fonts.SGRegularFont,
          ]}>{`You own: ${formatTokenAmountShowWithDecimals(balance, decimals)}`}</TextM>
        <OutlinedTextButton
          title={t('Send')}
          textStyle={styles.sendButtonText}
          iconName="send-small"
          onPress={() => {
            navigationService.navigate('SendHome', {
              sendType: 'nft',
              assetInfo: nftItem,
              toInfo: { name: '', address: '' },
            } as unknown as IToSendHomeParamsType);
          }}
        />
        <TextXXL style={styles.tokenId}>{`${alias} #${tokenId}`}</TextXXL>
        <Touchable
          onPress={() => {
            navigationService.goBack();
            navigationService.navigate('CollectionDetail', {
              imageUrl: collectionInfo?.imageUrl,
              collectionName: collectionInfo?.collectionName,
              itemCount: collectionInfo?.itemCount,
              symbol: collectionInfo?.symbol,
              chainId: collectionInfo?.chainId,
            });
          }}>
          <View style={[styles.collection, GStyles.flexRow, GStyles.itemCenter]}>
            <NFTAvatar
              disabled
              nftSize={pTd(24)}
              badgeSizeType="large"
              data={{
                alias: collectionInfo?.collectionName,
                imageUrl: collectionInfo?.imageUrl || '',
              }}
              style={styles.collectionAvatar}
            />
            <TextM style={[FontStyles.fontBase1, styles.textCollectionName, fonts.SGRegularFont]}>
              {collectionInfo?.collectionName}
            </TextM>
            <Svg icon="vector-right" size={11} />
          </View>
        </Touchable>
        <View style={styles.infoWrap}>
          {/* description */}
          {description && (
            <View style={GStyles.paddingBottom(16)}>
              <Touchable
                activeOpacity={1}
                onPress={() => {
                  setCollapsed(prev => !prev);
                }}>
                <Text
                  ref={textRef}
                  style={styles.description}
                  numberOfLines={collapsed ? 2 : 0}
                  onLayout={() => {
                    if (textRef.current) {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      textRef.current.measure((_x, _y, _width, height, _pageX, _pageY) => {
                        if (Math.round(height) > pTd(48)) {
                          // Assuming 24px per line, adjust as needed
                          setShowButton(true);
                        }
                      });
                    }
                  }}>
                  {description}
                </Text>
              </Touchable>
              {showButton && (
                <Touchable
                  activeOpacity={1}
                  style={styles.touchCollapse}
                  onPress={() => {
                    setCollapsed(prev => !prev);
                  }}>
                  <TextL style={styles.descriptionCollapseButton}>{collapsed ? 'Show more' : 'Show less'}</TextL>
                </Touchable>
              )}
            </View>
          )}
          {/* Basic Info */}
          <View style={GStyles.marginTop(pTd(12))}>
            <TextL style={[styles.basicInfoTitle, fonts.SGMediumFont]}>{t('Basic Info')}</TextL>
            <View style={[GStyles.flexRow, styles.paddingVertical16]}>
              <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGRegularFont]}>
                {t('Contract address')}
              </TextL>
              <View style={GStyles.flex(1)} />
              <TextM style={[styles.rightValue, FontStyles.fontBase1, fonts.SGMediumFont]}>
                {formatStr2EllipsisStr(addressFormat(tokenContractAddress, chainId))}
              </TextM>
              <Touchable
                style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]}
                onPress={async () => await copyText(addressFormat(tokenContractAddress, chainId))}>
                <Svg icon="copy" size={pTd(16)} />
              </Touchable>
            </View>
            <View style={[GStyles.flexRow, styles.paddingVertical16]}>
              <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGRegularFont]}>{t('Network')}</TextL>
              <View style={[styles.blank, GStyles.flex(1)]} />
              <CommonAvatar
                hasBorder={true}
                title={displayChainName}
                avatarSize={pTd(20)}
                imageUrl={chainImageUrl}
                borderStyle={styles.tokenIconBorder}
              />
              <TextL style={[styles.rightValue, GStyles.marginLeft(4), FontStyles.fontBase1, fonts.SGMediumFont]}>
                {formatChainInfoToShow(chainId)}
              </TextL>
            </View>
            <View style={[GStyles.flexRow, styles.paddingVertical16]}>
              <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2), fonts.SGRegularFont]}>
                {t('Symbol')}
              </TextL>
              <View style={styles.blank} />
              <TextL style={[styles.rightValue, FontStyles.fontBase1, GStyles.flex(3), fonts.SGMediumFont]}>
                {symbol}
              </TextL>
            </View>
            <View style={[GStyles.flexRow, styles.paddingVertical16, GStyles.marginBottom(0)]}>
              <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2), fonts.SGRegularFont]}>
                {t('Total supply')}
              </TextL>
              <View style={styles.blank} />
              <TextL style={[styles.rightValue, FontStyles.fontBase1, GStyles.flex(3), fonts.SGMediumFont]}>
                {formatTokenAmountShowWithDecimals(totalSupply, decimals)}
              </TextL>
            </View>
          </View>
          {/* Token Creation via This Seed */}
          {isSeed && (
            <>
              <Divider style={GStyles.marginArg(12, 0)} />
              <View style={GStyles.marginTop(pTd(24))}>
                <TextL style={[styles.basicInfoTitle, fonts.SGMediumFont]}>{t('Token Creation via This Seed')}</TextL>
                <View style={[GStyles.flexRow, styles.paddingVertical16]}>
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGRegularFont]}>{t('Type')}</TextL>
                  <View style={GStyles.flex1} />
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGMediumFont]}>
                    {SeedTypeEnum[seedType || SeedTypeEnum.None]}
                  </TextL>
                </View>
                <View style={[GStyles.flexRow, styles.paddingVertical16]}>
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGRegularFont]}>
                    {t('Token Symbol')}
                  </TextL>
                  <View style={GStyles.flex1} />
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGMediumFont]}>{seedOwnedSymbol}</TextL>
                </View>
                <View style={[GStyles.flexRow, styles.paddingVertical16, GStyles.marginBottom(0)]}>
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGRegularFont]}>{t('Expires')}</TextL>
                  <View style={GStyles.flex1} />
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, fonts.SGMediumFont]}>
                    {formatTransferTime(expires)}
                  </TextL>
                </View>
              </View>
            </>
          )}

          {/* Traits */}
          {traitsPercentages && (
            <>
              <Divider style={[GStyles.marginArg(12, 0)]} />
              <View style={GStyles.marginTop(pTd(12))}>
                <TextL style={[styles.basicInfoTitle, fonts.SGMediumFont]}>{t('Traits')}</TextL>
                <>
                  {isFetchingTraits ? (
                    <>
                      {[1, 2].map((ele, idx) => (
                        <View key={idx} style={[GStyles.paddingArg(16, 0), GStyles.flexRow]}>
                          <Skeleton
                            width={pTd(173)}
                            height={pTd(116)}
                            style={GStyles.radiusArg(16)}
                            LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
                          />
                          <View style={styles.verticalBlank} />
                          <Skeleton
                            width={pTd(173)}
                            height={pTd(116)}
                            style={GStyles.radiusArg(16)}
                            LinearGradientComponent={() => <PortkeyLinearGradientV2 />}
                          />
                        </View>
                      ))}
                    </>
                  ) : (
                    <>
                      <FlatList
                        data={traitsPercentages}
                        numColumns={2}
                        style={GStyles.paddingArg(16, 0)}
                        columnWrapperStyle={styles.columnWrapperStyle}
                        ItemSeparatorComponent={() => <View style={GStyles.height(16)} />}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <TraitsItem traitType={item.traitType} value={item.value} percent={item.percent} />
                        )}
                      />
                    </>
                  )}
                </>
              </View>
            </>
          )}

          {/* Generation Info */}
          {generation && (
            <>
              <Divider style={[GStyles.marginArg(12, 0)]} />
              <View style={GStyles.marginTop(pTd(24))}>
                <TextL style={[styles.basicInfoTitle, fonts.SGMediumFont]}>{t('Generation Info')}</TextL>
                <View style={[GStyles.flexRow, styles.paddingVertical16, GStyles.marginBottom(0)]}>
                  <TextM style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2), fonts.SGRegularFont]}>
                    {t('Generation')}
                  </TextM>
                  <View style={GStyles.flex1} />
                  <TextM style={[styles.rightValue, FontStyles.fontBase1, GStyles.flex(3), fonts.SGMediumFont]}>
                    {generation}
                  </TextM>
                </View>
              </View>
            </>
          )}

          {/* Inscription Info */}
          {inscriptionName && (
            <>
              <Divider style={[GStyles.marginArg(12, 0)]} />
              <View style={GStyles.marginTop(pTd(24))}>
                <TextL style={[styles.basicInfoTitle, fonts.SGMediumFont]}>{t('Inscription Info')}</TextL>
                <View style={[GStyles.flexRow, styles.paddingVertical16]}>
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2), fonts.SGRegularFont]}>
                    {t('Inscription Name')}
                  </TextL>
                  <View style={styles.blank} />
                  <TextL style={[styles.rightValue, FontStyles.fontBase1, GStyles.flex(3), fonts.SGMediumFont]}>
                    {inscriptionName}
                  </TextL>
                </View>
                <View style={[GStyles.flexRow, styles.paddingVertical16, GStyles.marginBottom(0)]}>
                  <TextL style={[styles.leftTitle, FontStyles.fontBase1, GStyles.flex(2), fonts.SGRegularFont]}>
                    {t('Limit Per Mint')}
                  </TextL>
                  <View style={styles.blank} />
                  <TextL style={[styles.rightValue, FontStyles.fontBase1, GStyles.flex(3), fonts.SGMediumFont]}>
                    {limitPerMint}
                  </TextL>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaBox>
  );
};

export default NFTDetail;
export const getStyles = makeStyles(theme => ({
  title: {
    fontSize: pTd(16),
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    flex: 1,
    textAlign: 'center',
  },
  pageWrap: {
    backgroundColor: defaultColors.bgBase1,
    ...GStyles.paddingArg(0, 16, 0),
  },
  iconWrap: {
    width: pTd(20),
    marginBottom: pTd(16),
    marginTop: pTd(16),
  },
  collection: {
    marginTop: pTd(12),
  },
  collectionAvatar: {
    borderRadius: pTd(4),
  },
  tokenId: {
    ...fonts.BGMediumFont,
    lineHeight: pTd(24),
    marginTop: pTd(24),
  },
  amount: {
    marginTop: pTd(8),
  },
  image: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    width: pTd(361),
    height: pTd(361),
    borderRadius: pTd(8),
    lineHeight: pTd(361),
    textAlign: 'center',
    fontSize: pTd(100),
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
  },
  basicInfoTitle: {
    marginBottom: pTd(8),
    opacity: 0.4,
  },
  rowWrap: { marginBottom: pTd(12) },
  paddingVertical16: { paddingVertical: pTd(16) },
  blank: {
    width: pTd(16),
  },
  verticalBlank: {
    width: pTd(16),
  },
  leftTitle: {},
  rightValue: {
    textAlign: 'right',
  },
  copyIconWrap: {},
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  textCollectionName: {
    opacity: 0.7,
    marginLeft: pTd(8),
    marginRight: pTd(5),
  },
  bottomSection: {
    backgroundColor: defaultColors.bgBase2,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.border6,
    width: ScreenWidth,
    height: pTd(110) + bottomBarHeight,
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
    alignItems: 'center',
  },
  balance: {
    width: '100%',
    textAlign: 'center',
    marginBottom: pTd(12),
    opacity: 0.7,
  },
  sendBtn: {
    marginBottom: pTd(16),
  },
  sendButtonText: {
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
  },
  infoWrap: {
    marginTop: pTd(12),
  },
  tokenIconBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  description: {
    fontSize: pTd(16),
    color: theme.colors.textBase2,
    ...fonts.SGRegularFont,
    lineHeight: pTd(23),
  },
  touchCollapse: {
    alignSelf: 'flex-start',
  },
  descriptionCollapseButton: {
    color: theme.colors.textBrand1,
    ...fonts.SGRegularFont,
    marginTop: pTd(4),
    alignSelf: 'flex-start',
  },
}));
