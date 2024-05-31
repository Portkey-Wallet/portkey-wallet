import { defaultColors } from 'assets/theme';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
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
import { formatActivityTime, isSameDay } from '@portkey-wallet/utils/time';
import { Resend } from 'components/Resend';
import dayjs from 'dayjs';
import { FontStyles } from 'assets/theme/styles';
import NFTAvatar from 'components/NFTAvatar';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import DoubleAvatar from 'components/DoubleAvatar';
import { TextM } from 'components/CommonText';
import { contractStatusEnum } from '@portkey-wallet/constants/constants-ca/common';
import Svg from 'components/Svg';

interface ActivityItemPropsType {
  preItem?: ActivityItemType;
  item?: ActivityItemType;
  index?: number;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ preItem, item, onPress, index }) => {
  const isMainnet = useIsMainnet();
  const [rotation] = useState(new Animated.Value(0));

  const isDaySame = useMemo(() => {
    const preTime = dayjs.unix(Number(preItem?.timestamp || 0));
    const curTime = dayjs.unix(Number(item?.timestamp || 0));
    return isSameDay(preTime, curTime);
  }, [item?.timestamp, preItem?.timestamp]);

  const isLineShow = useMemo(() => !isDaySame && index !== 0, [index, isDaySame]);

  const dayStr = useMemo(() => {
    if (isDaySame) return '';
    return formatActivityTime(dayjs.unix(Number(item?.timestamp || 0)));
  }, [isDaySame, item?.timestamp]);

  const AddressDom = useMemo(() => {
    if (!item) return null;
    const address = item.isReceived ? item.fromAddress : item.toAddress;
    const chainId = item.isReceived ? item.fromChainId : item.toChainId;
    if (!address || !chainId) return null;

    return (
      <Text style={itemStyle.centerStatus}>
        {`${item?.isReceived ? 'From' : 'To'} ${formatStr2EllipsisStr(addressFormat(address, chainId), 8)}`}
      </Text>
    );
  }, [item]);

  const AmountDom = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol, nftInfo } = item || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    const suffix = nftInfo?.alias || symbol || '';

    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={[itemStyle.tokenBalance, isReceived && FontStyles.font10]}>
        {`${prefix}${formatTokenAmountShowWithDecimals(item?.amount, decimals)} ${suffix}`}
      </Text>
    );
  }, [item]);

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

  const StatusDom = useMemo(() => {
    if (item?.status === contractStatusEnum.FAIL)
      return (
        <View style={GStyles.paddingBottom(2)}>
          <Svg icon="activity-fail" size={pTd(16)} />;
        </View>
      );
    if (item?.status === contractStatusEnum.MINED)
      return (
        <View style={GStyles.paddingBottom(2)}>
          <Svg icon="activity-mined" size={pTd(16)} />
        </View>
      );

    return (
      <Animated.View
        style={[
          GStyles.paddingBottom(2),
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}>
        <Svg icon="activity-pending" size={pTd(16)} />
      </Animated.View>
    );
  }, [item?.status, rotation]);

  const ExtraDom = useMemo(() => {
    if (!item?.currentTxPriceInUsd) return null;
    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={itemStyle.usdtBalance}>
        {formatAmountUSDShow(isMainnet ? item?.currentTxPriceInUsd : '')}
      </Text>
    );
  }, [isMainnet, item?.currentTxPriceInUsd]);

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
        <CommonAvatar
          title={item?.symbol}
          style={itemStyle.left}
          svgName={item?.listIcon ? undefined : 'transfer'}
          imageUrl={item?.listIcon || ''}
          avatarSize={pTd(32)}
          hasBorder
          titleStyle={itemStyle.avatarTitleStyle}
          borderStyle={GStyles.hairlineBorder}
        />

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <Text style={[itemStyle.centerType, fonts.mediumFont]}>
            {item?.transactionName} {StatusDom}
          </Text>
        </View>
      </View>
    );
  }, [StatusDom, item?.isSystem, item?.listIcon, item?.symbol, item?.transactionName]);

  const TxActivityItem = useMemo(() => {
    if (item?.operations?.length !== 0) {
      const { operations = [] } = item || {};
      if (operations.length < 2) return null;
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
          <DoubleAvatar firstAvatar={renderTopIconInfo} secondAvatar={renderBottomIconInfo} />
          <View style={[itemStyle.center, itemStyle.systemCenter]}>
            <Text numberOfLines={1} style={[itemStyle.centerType, fonts.mediumFont]}>
              {item?.transactionName} {StatusDom}
            </Text>
            <Text style={itemStyle.centerStatus}>{item?.dappName}</Text>
          </View>
          <View style={itemStyle.right}>
            <TextM
              numberOfLines={1}
              style={[!sameDirection && GStyles.fontSize(16), tokenTop.isReceived && FontStyles.font10]}>
              {`${formatWithCommas({
                sign: tokenTop.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                amount: tokenTop.amount,
                decimals: tokenTop.decimals,
                digits: Number(tokenTop.decimals),
              })} ${tokenTop.symbol}`}
            </TextM>
            <TextM
              numberOfLines={1}
              style={[!sameDirection && GStyles.fontSize(12), tokenBottom.isReceived && FontStyles.font10]}>
              {`${formatWithCommas({
                sign: tokenBottom.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                amount: tokenBottom.amount,
                decimals: tokenBottom.decimals,
                digits: Number(tokenBottom.decimals),
              })} ${tokenBottom.symbol}`}
            </TextM>
          </View>
        </View>
      );
    }

    if (item?.dappName)
      return (
        <View style={itemStyle.contentWrap}>
          {item?.nftInfo ? (
            <NFTAvatar
              disabled
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              nftSize={pTd(32)}
              badgeSizeType="small"
              data={item.nftInfo}
              style={[itemStyle.left, itemStyle.nftAvatarWrap]}
            />
          ) : (
            <CommonAvatar
              style={itemStyle.left}
              svgName={item?.listIcon ? undefined : 'transfer'}
              imageUrl={item?.listIcon || ''}
              avatarSize={pTd(32)}
              hasBorder
              titleStyle={itemStyle.avatarTitleStyle}
              borderStyle={GStyles.hairlineBorder}
            />
          )}
          <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
            <Text numberOfLines={1} style={[itemStyle.centerType, fonts.mediumFont]}>
              {item?.transactionName} {StatusDom}
            </Text>
            <Text style={itemStyle.centerStatus}>{item?.dappName}</Text>
          </View>
          <View style={itemStyle.right}>
            {AmountDom}
            {ExtraDom}
          </View>
        </View>
      );

    return (
      <View style={itemStyle.contentWrap}>
        {item?.nftInfo ? (
          <NFTAvatar
            disabled
            isSeed={item.nftInfo.isSeed}
            seedType={item.nftInfo.seedType}
            nftSize={pTd(32)}
            badgeSizeType="small"
            data={item.nftInfo}
            style={[itemStyle.left, itemStyle.nftAvatarWrap]}
          />
        ) : (
          <CommonAvatar
            style={itemStyle.left}
            svgName={item?.listIcon ? undefined : 'transfer'}
            imageUrl={item?.listIcon || ''}
            avatarSize={pTd(32)}
            hasBorder
            titleStyle={itemStyle.avatarTitleStyle}
            borderStyle={GStyles.hairlineBorder}
          />
        )}

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <Text style={[itemStyle.centerType, fonts.mediumFont]}>
            {item?.transactionName} {StatusDom}
          </Text>
          {!item?.isSystem && (
            <>
              {AddressDom}
              {item?.transactionType === TransactionTypes.CROSS_CHAIN_TRANSFER && (
                <Text style={itemStyle.centerStatus}>Cross-Chain Transfer</Text>
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
  }, [AddressDom, AmountDom, ExtraDom, StatusDom, item]);

  const EmptyTokenForDapp = useMemo(() => {
    return (
      <View style={itemStyle.contentWrap}>
        <CommonAvatar
          title={item?.dappName || 'Unknown'}
          style={itemStyle.left}
          svgName={item?.dappName ? undefined : 'transfer'}
          imageUrl={item?.dappIcon || ''}
          avatarSize={pTd(32)}
          hasBorder
          titleStyle={itemStyle.avatarTitleStyle}
          borderStyle={GStyles.hairlineBorder}
        />

        <View style={[itemStyle.center, item?.isSystem && itemStyle.systemCenter]}>
          <Text numberOfLines={1} style={[itemStyle.centerType, fonts.mediumFont]}>
            {item?.transactionName} {StatusDom}
          </Text>
          <Text style={itemStyle.centerStatus}>{item?.dappName}</Text>
        </View>
      </View>
    );
  }, [StatusDom, item?.dappIcon, item?.dappName, item?.isSystem, item?.transactionName]);

  return (
    <Touchable style={[itemStyle.itemWrap, isLineShow && itemStyle.itemBorder]} onPress={() => onPress?.(item)}>
      {!isDaySame && <Text style={itemStyle.time}>{dayStr}</Text>}
      <View style={itemStyle.containerWrap}>
        {isShowEmptyTokenForDapp && EmptyTokenForDapp}
        {isShowSystemForDefault && SystemActivityItem}
        {isShowTx && TxActivityItem}
        <Resend containerStyle={itemStyle.resendContainer} item={item} />
      </View>
    </Touchable>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    marginHorizontal: pTd(16),
  },
  itemBorder: {
    marginTop: pTd(4),
    paddingTop: pTd(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.bg7,
  },
  time: {
    fontSize: pTd(12),
    color: defaultColors.font11,
    lineHeight: pTd(18),
    marginTop: pTd(16),
    marginBottom: pTd(4),
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
    marginRight: pTd(8),
  },
  nftAvatarWrap: {
    borderRadius: pTd(4),
  },
  avatarTitleStyle: {
    fontSize: pTd(16),
    color: defaultColors.font11,
  },
  center: {
    width: pTd(160),
    marginRight: pTd(8),
    justifyContent: 'center',
  },
  systemCenter: {
    flex: 1,
  },
  centerType: {
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  centerStatus: {
    color: defaultColors.font11,
    marginTop: StyleSheet.hairlineWidth,
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
  right: {
    display: 'flex',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tokenBalance: {
    textAlign: 'right',
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(24),
    width: pTd(135),
  },
  usdtBalance: {
    textAlign: 'right',
    fontSize: pTd(12),
    lineHeight: pTd(18),
    color: defaultColors.font11,
    height: pTd(16),
  },
  tokenName: {
    flex: 1,
  },
  resendContainer: {
    marginBottom: pTd(8),
  },
});
