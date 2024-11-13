import { DisplayType, RedPackageGrabInfoItem } from '@portkey-wallet/im';
import { formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import { getEllipsisTokenShow } from 'pages/Chat/utils/format';
import React, { memo } from 'react';
import { View } from 'react-native';
import { formatTimeMinDxStr, formatTransferTime } from '@portkey-wallet/utils/time';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

interface IReceiverItemProps {
  item: RedPackageGrabInfoItem;
  symbol: string;
  decimals?: string | number;
  isLuckyKing: boolean;
}

const ReceiverItem: React.FC<IReceiverItemProps> = props => {
  const { item, symbol, decimals, isLuckyKing } = props;
  const itemStyle = getStyles();
  console.log('wfs=--- props', props);
  return (
    <View style={itemStyle.wrap}>
      {item?.displayType === DisplayType.Pending ? (
        <View style={itemStyle.pendingIconBG}>
          <Svg icon={'lock-gift'} size={pTd(21)} />
        </View>
      ) : (
        <CommonAvatar
          hasBorder
          resizeMode="cover"
          style={itemStyle.left}
          title={item?.username}
          avatarSize={pTd(42)}
          imageUrl={item?.avatar}
        />
      )}
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <View style={itemStyle.userNameWrapper}>
            <TextL numberOfLines={1} style={itemStyle.name}>
              {item?.displayType === DisplayType.Pending ? 'Pending Claim' : item?.username || ''}
            </TextL>
            {item?.isMe && (
              <View style={itemStyle.meBg}>
                <TextS style={itemStyle.meText}>Me</TextS>
              </View>
            )}
          </View>
          <View style={itemStyle.blank} />
          <TextM numberOfLines={1} style={itemStyle.time}>
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
              {/* <Svg icon="luckiest" size={pTd(16)} /> */}
              <TextM style={itemStyle.luckiest}>Luckiest Draw</TextM>
            </View>
          ) : item?.displayType === DisplayType.Pending ? (
            <View style={[GStyles.flexRow, GStyles.itemCenter, itemStyle.luckiestWrap]}>
              <TextM style={itemStyle.expirationTime}>{`Expiration in ${formatTimeMinDxStr(
                item?.expirationTime,
              )}min`}</TextM>
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

const getStyles = makeStyles(theme => ({
  wrap: {
    height: pTd(48),
    paddingHorizontal: pTd(16),
    marginTop: pTd(32),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingIconBG: {
    backgroundColor: theme.colors.bgBase3,
    height: pTd(42),
    width: pTd(42),
    borderRadius: pTd(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {},
  right: {
    height: pTd(48),
    marginLeft: pTd(8),
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
    ...fonts.SGRegularFont,
  },
  meBg: {
    backgroundColor: theme.colors.bgBrand1,
    width: pTd(30),
    height: pTd(20),
    borderRadius: pTd(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: pTd(4),
  },
  meText: {
    color: theme.colors.textBrand4,
    ...fonts.SGRegularFont,
  },
  time: {
    lineHeight: pTd(23),
    width: pTd(150),
    color: theme.colors.textBase2,
  },
  balanceWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: pTd(10),
  },
  amount: {
    color: theme.colors.textBase1,
    ...fonts.SGMediumFont,
  },
  luckiest: {
    color: theme.colors.textSuccess1,
    ...fonts.SGRegularFont,
  },
  luckiestWrap: {
    height: pTd(20),
  },
  expirationTime: {
    color: theme.colors.textBase2,
    ...fonts.SGRegularFont,
  },
}));
