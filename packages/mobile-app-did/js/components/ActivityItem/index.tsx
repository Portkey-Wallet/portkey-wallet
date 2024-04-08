import { defaultColors } from 'assets/theme';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { AmountSign, divDecimalsStr, formatAmountUSDShow } from '@portkey-wallet/utils/converter';
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

interface ActivityItemPropsType {
  preItem?: ActivityItemType;
  item?: ActivityItemType;
  index?: number;
  onPress?: (item: any) => void;
}

const ActivityItem: React.FC<ActivityItemPropsType> = ({ preItem, item, onPress, index }) => {
  const isMainnet = useIsMainnet();

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

  const AmountDom = useMemo(() => {
    const { amount = '', isReceived, decimals = 8, symbol } = item || {};
    let prefix = ' ';
    if (amount && !ZERO.isEqualTo(amount)) prefix = isReceived ? AmountSign.PLUS : AmountSign.MINUS;

    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={[itemStyle.tokenBalance, isReceived && FontStyles.font10]}>
        {`${prefix} ${divDecimalsStr(item?.amount, decimals)} ${symbol}`}
      </Text>
    );
  }, [item]);

  const ExtraDom = useMemo(() => {
    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={itemStyle.usdtBalance}>
        {item?.nftInfo ? item?.nftInfo?.alias : isMainnet ? formatAmountUSDShow(item?.currentTxPriceInUsd ?? 0) : ''}
      </Text>
    );
  }, [isMainnet, item?.currentTxPriceInUsd, item?.nftInfo]);

  return (
    <Touchable style={[itemStyle.itemWrap, isLineShow && itemStyle.itemBorder]} onPress={() => onPress?.(item)}>
      {!isDaySame && <Text style={itemStyle.time}>{dayStr}</Text>}
      <View style={itemStyle.containerWrap}>
        <View style={itemStyle.contentWrap}>
          {item?.nftInfo ? (
            <NFTAvatar
              disabled
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              nftSize={pTd(32)}
              badgeSizeType="small"
              data={item.nftInfo}
              style={itemStyle.left}
            />
          ) : (
            <CommonAvatar
              style={itemStyle.left}
              svgName={item?.listIcon ? undefined : 'transfer'}
              imageUrl={item?.listIcon || ''}
              avatarSize={pTd(32)}
            />
          )}

          <View style={itemStyle.center}>
            <Text style={itemStyle.centerType}>{item?.transactionName}</Text>
            {!item?.isSystem && (
              <>
                <Text style={itemStyle.centerStatus}>
                  {`${item?.isReceived ? 'From' : 'To'} ${formatStr2EllipsisStr(
                    addressFormat(item?.fromAddress, item?.fromChainId),
                    8,
                  )}`}
                </Text>
                {item?.transactionType === TransactionTypes.CROSS_CHAIN_TRANSFER && (
                  <Text style={itemStyle.centerStatus}>Cross Chain Transfer</Text>
                )}
              </>
            )}
          </View>

          {!item?.isSystem && (
            <View style={itemStyle.right}>
              {AmountDom}
              {ExtraDom}
            </View>
          )}
        </View>
        <Resend containerStyle={itemStyle.resendContainer} item={item} />
      </View>
    </Touchable>
  );
};

export default memo(ActivityItem);

const itemStyle = StyleSheet.create({
  itemWrap: {
    width: '100%',
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: pTd(16),
  },
  itemBorder: {
    marginTop: pTd(4),
    paddingTop: pTd(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.bg7,
  },
  time: {
    fontSize: pTd(12),
    color: defaultColors.font3,
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
    width: pTd(32),
    height: pTd(32),
    borderWidth: 0,
    backgroundColor: defaultColors.bg1,
  },

  center: {
    width: pTd(160),
    marginRight: pTd(8),
    justifyContent: 'center',
  },
  centerType: {
    color: defaultColors.font5,
    fontSize: pTd(16),
    lineHeight: pTd(24),
  },
  centerStatus: {
    color: defaultColors.font3,
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
  },
  usdtBalance: {
    textAlign: 'right',
    fontSize: pTd(12),
    lineHeight: pTd(18),
    color: defaultColors.font3,
    height: pTd(16),
  },
  tokenName: {
    flex: 1,
  },
  resendContainer: {
    marginVertical: pTd(8),
  },
});