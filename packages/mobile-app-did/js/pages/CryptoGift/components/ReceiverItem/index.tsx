import { DisplayType, RedPackageGrabInfoItem } from '@portkey-wallet/im';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { getEllipsisTokenShow } from 'pages/Chat/utils/format';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatTimeToHmStr, formatTransferTime } from '@portkey-wallet/utils/time';
import { pTd } from 'utils/unit';

interface IReceiverItemProps {
  item: RedPackageGrabInfoItem;
  symbol: string;
  decimals?: string | number;
  isLuckyKing: boolean;
}

const ReceiverItem: React.FC<IReceiverItemProps> = props => {
  const { item, symbol, decimals, isLuckyKing } = props;
  console.log('wfs=--- props', props);
  return (
    <View style={itemStyle.wrap}>
      {item?.displayType === DisplayType.Pending ? (
        <View style={itemStyle.pendingIconBG}>
          <Svg icon={'lock-gift'} size={pTd(20)} />
        </View>
      ) : (
        <CommonAvatar
          hasBorder
          resizeMode="cover"
          style={itemStyle.left}
          title={item?.username}
          avatarSize={pTd(48)}
          imageUrl={item?.avatar}
        />
      )}
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <View style={itemStyle.userNameWrapper}>
            <TextL numberOfLines={1} style={itemStyle.name}>
              {item?.displayType === DisplayType.Pending ? 'Awaiting Claim' : item?.username || ''}
            </TextL>
            {item?.isMe && (
              <View style={itemStyle.meBg}>
                <TextS style={[GStyles.fontSize(pTd(10)), FontStyles.neutralDefaultBG, fonts.mediumFont]}>Me</TextS>
              </View>
            )}
          </View>
          <View style={itemStyle.blank} />
          <TextM numberOfLines={1} style={[FontStyles.font3, itemStyle.time]}>
            {formatTransferTime(item?.grabTime)}
          </TextM>
        </View>

        <View style={itemStyle.balanceWrap}>
          <TextL style={itemStyle.amount} numberOfLines={1} ellipsizeMode={'tail'}>
            {getEllipsisTokenShow(formatTokenAmountShowWithDecimals(item?.amount, decimals), symbol)}
          </TextL>
          <View style={itemStyle.blank} />
          {item?.isLuckyKing || isLuckyKing ? (
            <View style={[GStyles.flexRow, GStyles.itemCenter, itemStyle.luckiestWrap]}>
              <Svg icon="luckiest" size={pTd(16)} />
              <TextM style={itemStyle.luckiest}>Luckiest Draw</TextM>
            </View>
          ) : item?.displayType === DisplayType.Pending ? (
            <View style={[GStyles.flexRow, GStyles.itemCenter, itemStyle.luckiestWrap]}>
              <TextM style={itemStyle.expirationTime}>{`Expiration ${formatTimeToHmStr(item?.expirationTime)}`}</TextM>
            </View>
          ) : (
            <View style={itemStyle.luckiestWrap} />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(ReceiverItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(48),
    paddingHorizontal: pTd(12),
    marginTop: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingIconBG: {
    backgroundColor: defaultColors.neutralDivider,
    height: pTd(48),
    width: pTd(48),
    borderRadius: pTd(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {},
  right: {
    height: pTd(48),
    marginLeft: pTd(12),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blank: {
    height: pTd(4),
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  userNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: pTd(10),
  },
  name: {
    lineHeight: pTd(22),
    ...fonts.mediumFont,
  },
  meBg: {
    backgroundColor: defaultColors.brandNormal,
    width: pTd(23),
    height: pTd(14),
    borderRadius: pTd(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    lineHeight: pTd(16),
    width: pTd(150),
    color: defaultColors.font7,
  },
  balanceWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: pTd(10),
  },
  amount: {
    color: defaultColors.primaryTextColor,
    ...fonts.mediumFont,
  },
  luckiest: {
    marginLeft: pTd(4),
    color: defaultColors.functionalYellowDefault,
  },
  luckiestWrap: {
    height: pTd(16),
  },
  expirationTime: {
    color: defaultColors.neutralTertiaryText,
  },
});
