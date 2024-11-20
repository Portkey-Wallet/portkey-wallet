import { darkColors } from 'assets/theme';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { SHOW_FROM_TRANSACTION_TYPES, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import {
  AmountSign,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
  formatWithCommas,
} from '@portkey-wallet/utils/converter';
import { addressFormat } from '@portkey-wallet/utils';
import CommonAvatar from 'components/CommonAvatar';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ZERO } from '@portkey-wallet/constants/misc';
import Touchable from 'components/Touchable';
import { formatActivityTimeRevamp, isSameDay } from '@portkey-wallet/utils/time';
import dayjs from 'dayjs';
import NFTAvatar from 'components/NFTAvatar';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import DoubleAvatar from 'components/DoubleAvatar';
import { TextL, TextM, TextS } from 'components/CommonText';
import { contractStatusEnum } from '@portkey-wallet/constants/constants-ca/common';
import Lottie from 'lottie-react-native';
import { makeStyles } from '@rneui/themed';

interface ActivityItemPropsType {
  preItem?: ActivityItemType;
  item?: ActivityItemType;
  index?: number;
  onPress?: (item: any) => void;
  style?: ViewStyle;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ preItem, item, onPress, style }) => {
  const isMainnet = useIsMainnet();
  const [rotation] = useState(new Animated.Value(0));
  const itemStyle = getStyles();
  const isDaySame = useMemo(() => {
    const preTime = dayjs.unix(Number(preItem?.timestamp || 0));
    const curTime = dayjs.unix(Number(item?.timestamp || 0));
    return isSameDay(preTime, curTime);
  }, [item?.timestamp, preItem?.timestamp]);

  const dayStr = useMemo(() => {
    if (isDaySame) {
      return '';
    }
    return formatActivityTimeRevamp(dayjs.unix(Number(item?.timestamp || 0)));
  }, [isDaySame, item?.timestamp]);

  const AddressDom = useMemo(() => {
    if (!item) {
      return null;
    }
    const address = item.isReceived ? item.fromAddress : item.toAddress;
    const chainId = item.isReceived ? item.fromChainId : item.toChainId;
    if (!address || !chainId) {
      return null;
    }

    // Issue
    if (address === '_') {
      return null;
    }

    return (
      <TextM style={itemStyle.centerStatus}>
        {`${item?.isReceived ? 'From' : 'To'} ${formatStr2EllipsisStr(addressFormat(address, chainId), 7)}`}
      </TextM>
    );
  }, [item, itemStyle.centerStatus]);

  const AmountDom = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol, nftInfo } = item || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) {
      prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    }
    const suffix = nftInfo?.alias || symbol || '';

    return (
      <TextM
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          fonts.SGMediumFont,
          itemStyle.tokenBalance,
          { color: isReceived ? darkColors.textSuccess1 : darkColors.textBase1 },
        ]}>
        {`${prefix}${formatTokenAmountShowWithDecimals(item?.amount, decimals)} ${suffix}`}
      </TextM>
    );
  }, [item, itemStyle.tokenBalance]);

  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 360,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    rotationAnimation.start();
    return () => {
      rotationAnimation.stop();
    };
  }, [rotation]);

  const loadingStatus = useMemo(() => {
    return (
      <View style={itemStyle.loadingWrap}>
        <Lottie style={itemStyle.loadingIcon} source={require('assets/lottieFiles/spinnerDark.json')} autoPlay loop />
      </View>
    );
  }, [itemStyle]);

  const statusFontColor = useMemo(() => {
    if (item?.status === contractStatusEnum.FAILED) {
      return darkColors.textDanger2;
    }
    return darkColors.textBase1;
  }, [item?.status]);

  const ExtraDom = useMemo(() => {
    if (!item?.currentTxPriceInUsd) {
      return null;
    }
    return (
      <TextS numberOfLines={1} ellipsizeMode="tail" style={itemStyle.usdtBalance}>
        {formatAmountUSDShow(isMainnet ? item?.currentTxPriceInUsd : '')}
      </TextS>
    );
  }, [isMainnet, item?.currentTxPriceInUsd, itemStyle.usdtBalance]);

  // new rules
  const isEmptyToken = useMemo(
    () => !(item?.nftInfo || item?.symbol || item?.operations?.length),
    [item?.nftInfo, item?.operations?.length, item?.symbol],
  );
  const isDappTx = useMemo(() => !!item?.dappName, [item?.dappName]);
  const isShowEmptyTokenForDapp = useMemo(() => isEmptyToken && isDappTx, [isDappTx, isEmptyToken]);
  const isShowSystemForDefault = useMemo(() => isEmptyToken && !isDappTx, [isDappTx, isEmptyToken]);
  const isShowTx = useMemo(() => !isEmptyToken, [isEmptyToken]);

  const SystemActivityItem = useMemo(() => {
    return (
      <View style={itemStyle.contentWrap}>
        <View style={itemStyle.left}>
          {item?.status === contractStatusEnum.PENDING ? (
            loadingStatus
          ) : item?.sourceIcon ? (
            <View style={itemStyle.cornerMarkWrap}>
              <CommonAvatar
                title={item?.transactionName}
                svgName={item?.listIcon ? undefined : 'transfer'}
                imageUrl={item?.listIcon || ''}
                avatarSize={pTd(42)}
                hasBorder
                titleStyle={itemStyle.avatarTitleStyle}
                borderStyle={GStyles.hairlineBorder}
              />
              <View style={itemStyle.cornerMark}>
                <CommonAvatar
                  title={item?.transactionName}
                  imageUrl={item?.sourceIcon || ''}
                  avatarSize={pTd(18)}
                  titleStyle={itemStyle.avatarTitleStyle}
                />
              </View>
            </View>
          ) : (
            <CommonAvatar
              title={item?.transactionName}
              svgName={item?.listIcon ? undefined : 'transfer'}
              imageUrl={item?.listIcon || ''}
              avatarSize={pTd(42)}
              hasBorder
              titleStyle={itemStyle.avatarTitleStyle}
              borderStyle={GStyles.hairlineBorder}
            />
          )}
        </View>

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <View style={itemStyle.textAndStatusWrapCenter}>
            <TextL style={[itemStyle.centerType, { color: statusFontColor }]}>{item?.transactionName}</TextL>
          </View>
        </View>
      </View>
    );
  }, [item, itemStyle, loadingStatus, statusFontColor]);

  const TxActivityItem = useMemo(() => {
    if (item?.operations?.length !== 0) {
      const { operations = [] } = item || {};
      if (operations.length < 2) {
        return null;
      }
      let [tokenTop, tokenBottom] = operations.map(_token => ({
        symbol: _token.nftInfo ? _token.nftInfo.alias : _token.symbol,
        url: _token.nftInfo ? _token.nftInfo.imageUrl : _token.icon,
        isReceived: _token.isReceived,
        amount: _token.amount,
        decimals: _token.decimals,
      }));
      const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;
      if (!sameDirection && !tokenTop.isReceived) {
        [tokenBottom, tokenTop] = [tokenTop, tokenBottom];
      }
      let renderTopIconInfo = { imageUrl: tokenTop.url, title: tokenTop.symbol };
      let renderBottomIconInfo = { imageUrl: tokenBottom.url, title: tokenBottom.symbol };
      if (!sameDirection) {
        [renderTopIconInfo, renderBottomIconInfo] = [renderBottomIconInfo, renderTopIconInfo];
      }

      return (
        <View style={itemStyle.contentWrap}>
          {item?.status === contractStatusEnum.PENDING ? (
            <View style={itemStyle.doubleAvatarLoadingWrap}>{loadingStatus}</View>
          ) : (
            <DoubleAvatar firstAvatar={renderTopIconInfo} secondAvatar={renderBottomIconInfo} />
          )}
          <View style={[itemStyle.center, itemStyle.systemCenter]}>
            <View style={itemStyle.textAndStatusWrapCenter}>
              <TextL numberOfLines={1} style={[itemStyle.centerType, { color: statusFontColor }]}>
                {item?.transactionName}
              </TextL>
            </View>

            <TextM style={itemStyle.centerStatus}>{item?.dappName}</TextM>
          </View>
          <View style={itemStyle.right}>
            <TextM
              numberOfLines={1}
              style={[
                fonts.SGMediumFont,
                { color: tokenTop.isReceived ? darkColors.textSuccess1 : darkColors.textBase1 },
              ]}>
              {`${formatWithCommas({
                sign: tokenTop.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                amount: tokenTop.amount,
                decimals: tokenTop.decimals,
                digits: Number(tokenTop.decimals),
              })} ${tokenTop.symbol}`}
            </TextM>
            {sameDirection ? (
              <TextS
                numberOfLines={1}
                style={[
                  fonts.SGMediumFont,
                  { color: tokenBottom.isReceived ? darkColors.textSuccess1 : darkColors.textBase1 },
                ]}>
                {`${formatWithCommas({
                  sign: tokenBottom.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                  amount: tokenBottom.amount,
                  decimals: tokenBottom.decimals,
                  digits: Number(tokenBottom.decimals),
                })} ${tokenBottom.symbol}`}
              </TextS>
            ) : (
              <TextS numberOfLines={1} style={[{ color: darkColors.textBase2 }]}>
                {`${formatWithCommas({
                  sign: tokenBottom.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                  amount: tokenBottom.amount,
                  decimals: tokenBottom.decimals,
                  digits: Number(tokenBottom.decimals),
                })} ${tokenBottom.symbol}`}
              </TextS>
            )}
          </View>
        </View>
      );
    }

    const isTransferType = SHOW_FROM_TRANSACTION_TYPES.includes(item.transactionType);

    if (item?.dappName) {
      return (
        <View style={itemStyle.contentWrap}>
          <View style={itemStyle.left}>
            {item.status === contractStatusEnum.PENDING ? (
              loadingStatus
            ) : item?.nftInfo ? (
              <NFTAvatar
                disabled
                isSeed={item.nftInfo.isSeed}
                seedType={item.nftInfo.seedType}
                nftSize={pTd(42)}
                badgeSizeType="small"
                data={item.nftInfo}
                style={[itemStyle.nftAvatarWrap]}
              />
            ) : isTransferType ? (
              <View style={itemStyle.cornerMarkWrap}>
                <CommonAvatar
                  svgName={item?.listIcon ? undefined : 'transfer'}
                  imageUrl={item?.listIcon || ''}
                  title={item.transactionName}
                  style={itemStyle.symbolIcon}
                  avatarSize={pTd(42)}
                  hasBorder
                  titleStyle={itemStyle.avatarTitleStyle}
                  borderStyle={GStyles.hairlineBorder}
                />
                <View style={itemStyle.cornerMark}>
                  <CommonAvatar
                    svgName={item.isReceived ? 'arrow-down-thin' : 'send-thin'}
                    style={itemStyle.cornerMarkIcon}
                    avatarSize={pTd(14)}
                    titleStyle={itemStyle.avatarTitleStyle}
                  />
                </View>
              </View>
            ) : (
              <CommonAvatar
                svgName={item?.listIcon ? undefined : 'transfer'}
                imageUrl={item?.listIcon || ''}
                title={item.transactionName}
                avatarSize={pTd(42)}
                hasBorder
                titleStyle={itemStyle.avatarTitleStyle}
                borderStyle={GStyles.hairlineBorder}
              />
            )}
          </View>

          <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
            <View style={itemStyle.textAndStatusWrapCenter}>
              <TextL numberOfLines={1} style={[itemStyle.centerType, { color: statusFontColor }]}>
                {item?.transactionName}
              </TextL>
            </View>

            <TextM style={itemStyle.centerStatus}>{item?.dappName}</TextM>
          </View>
          <View style={itemStyle.right}>
            {AmountDom}
            {ExtraDom}
          </View>
        </View>
      );
    }

    return (
      <View style={itemStyle.contentWrap}>
        <View style={itemStyle.left}>
          {item.status === contractStatusEnum.PENDING ? (
            loadingStatus
          ) : item?.nftInfo ? (
            <NFTAvatar
              disabled
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              nftSize={pTd(42)}
              badgeSizeType="small"
              data={item.nftInfo}
              style={[itemStyle.nftAvatarWrap]}
            />
          ) : isTransferType ? (
            <View style={itemStyle.cornerMarkWrap}>
              <CommonAvatar
                svgName={item?.listIcon ? undefined : 'transfer'}
                imageUrl={item?.listIcon || ''}
                title={item.symbol}
                style={itemStyle.symbolIcon}
                avatarSize={pTd(42)}
                hasBorder
                titleStyle={itemStyle.avatarTitleStyle}
                borderStyle={GStyles.hairlineBorder}
              />
              <View style={itemStyle.cornerMark}>
                <CommonAvatar
                  svgName={item.isReceived ? 'arrow-down-thin' : 'send-thin'}
                  style={itemStyle.cornerMarkIcon}
                  avatarSize={pTd(14)}
                  titleStyle={itemStyle.avatarTitleStyle}
                />
              </View>
            </View>
          ) : (
            <CommonAvatar
              svgName={item?.listIcon ? undefined : 'transfer'}
              imageUrl={item?.listIcon || ''}
              title={item.transactionName}
              avatarSize={pTd(42)}
              hasBorder
              titleStyle={itemStyle.avatarTitleStyle}
              borderStyle={GStyles.hairlineBorder}
            />
          )}
        </View>

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <View style={itemStyle.textAndStatusWrapCenter}>
            <TextL numberOfLines={1} style={[itemStyle.centerType, { color: statusFontColor }]}>
              {item?.transactionName}
            </TextL>
          </View>

          {!item?.isSystem && (
            <>
              {AddressDom}
              {item?.transactionType === TransactionTypes.CROSS_CHAIN_TRANSFER && (
                <TextM style={itemStyle.centerStatus}>Cross-Chain Transfer</TextM>
              )}
            </>
          )}
        </View>

        <View style={itemStyle.right}>
          {AmountDom}
          {ExtraDom}
        </View>
      </View>
    );
  }, [AddressDom, AmountDom, ExtraDom, item, itemStyle, loadingStatus, statusFontColor]);

  const EmptyTokenForDapp = useMemo(() => {
    return (
      <View style={itemStyle.contentWrap}>
        <View style={itemStyle.left}>
          {item?.status === contractStatusEnum.PENDING ? (
            loadingStatus
          ) : (
            <CommonAvatar
              title={item?.dappName || 'Unknown'}
              svgName={item?.dappName ? undefined : 'transfer'}
              imageUrl={item?.dappIcon || ''}
              avatarSize={pTd(42)}
              hasBorder
              titleStyle={itemStyle.avatarTitleStyle}
              borderStyle={GStyles.hairlineBorder}
            />
          )}
        </View>

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <View style={itemStyle.textAndStatusWrapCenter}>
            <TextL numberOfLines={1} style={[itemStyle.centerType, { color: statusFontColor }]}>
              {item?.transactionName}
            </TextL>
          </View>
          <TextM style={itemStyle.centerStatus}>{item?.dappName}</TextM>
        </View>
      </View>
    );
  }, [item, itemStyle, statusFontColor, loadingStatus]);

  return (
    <Touchable style={[itemStyle.itemWrap, style]} onPress={() => onPress?.(item)}>
      {!isDaySame && <TextM style={itemStyle.time}>{dayStr}</TextM>}
      <View style={itemStyle.containerWrap}>
        {isShowEmptyTokenForDapp && EmptyTokenForDapp}
        {isShowSystemForDefault && SystemActivityItem}
        {isShowTx && TxActivityItem}
      </View>
    </Touchable>
  );
};

export default memo(ActivityItem);

const getStyles = makeStyles(theme => ({
  itemWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    marginHorizontal: pTd(16),
  },
  time: {
    lineHeight: pTd(18),
    marginTop: pTd(16),
  },
  containerWrap: {
    paddingVertical: pTd(8),
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(60),
  },
  left: {
    width: pTd(45),
    marginRight: pTd(8),
  },
  nftAvatarWrap: {
    borderRadius: pTd(4),
  },
  avatarTitleStyle: {
    fontSize: pTd(16),
    color: theme.colors.font11,
  },
  cornerMarkWrap: {
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  symbolIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cornerMark: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(19),
    height: pTd(19),
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.bgBrand2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(10),
  },
  cornerMarkIcon: {
    backgroundColor: theme.colors.bgBrand2,
  },
  center: {
    width: pTd(165),
    marginRight: pTd(8),
    justifyContent: 'center',
  },
  systemCenter: {
    flex: 1,
  },
  centerType: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  centerStatus: {
    color: theme.colors.textBase2,
    marginTop: StyleSheet.hairlineWidth,
  },
  right: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tokenBalance: {
    textAlign: 'right',
    lineHeight: pTd(16),
    // fontWeight: '600',
    width: pTd(135),
  },
  usdtBalance: {
    textAlign: 'right',
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
    height: pTd(20),
  },
  tokenName: {
    flex: 1,
  },
  resendContainer: {
    marginBottom: pTd(8),
  },
  textAndStatusWrapCenter: {
    height: pTd(24),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingWrap: {
    width: pTd(42),
    height: pTd(42),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pTd(21),
    backgroundColor: theme.colors.bgBrand1,
  },
  loadingIcon: {
    width: pTd(24),
  },
  doubleAvatarLoadingWrap: {
    width: pTd(45),
    marginRight: pTd(8),
  },
}));
