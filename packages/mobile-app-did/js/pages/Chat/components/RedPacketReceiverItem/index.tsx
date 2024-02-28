import { RedPackageGrabInfoItem } from '@portkey-wallet/im';
import { divDecimalsStr } from '@portkey-wallet/utils/converter';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonAvatar from 'components/CommonAvatar';
import { TextL, TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import { getEllipsisTokenShow } from 'pages/Chat/utils/format';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatTransferTime } from 'utils';
import { pTd } from 'utils/unit';

interface IReceiverItemProps {
  item: RedPackageGrabInfoItem;
  symbol: string;
  decimals?: string | number;
  isLuckyKing: boolean;
}

const RedPacketReceiverItem: React.FC<IReceiverItemProps> = props => {
  const { item, symbol, decimals, isLuckyKing } = props;

  return (
    <View style={itemStyle.wrap}>
      <CommonAvatar
        hasBorder
        resizeMode="cover"
        style={itemStyle.left}
        title={item.username}
        avatarSize={pTd(48)}
        imageUrl={item.avatar}
      />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} style={itemStyle.name}>
            {item?.username || ''}
          </TextL>
          <View style={itemStyle.blank} />
          <TextM numberOfLines={1} style={[FontStyles.font3, itemStyle.time]}>
            {formatTransferTime(item.grabTime)}
          </TextM>
        </View>

        <View style={itemStyle.balanceWrap}>
          <TextL style={itemStyle.amount} numberOfLines={1} ellipsizeMode={'tail'}>
            {getEllipsisTokenShow(divDecimalsStr(item.amount, decimals), symbol)}
          </TextL>
          <View style={itemStyle.blank} />
          {item.isLuckyKing || isLuckyKing ? (
            <View style={[GStyles.flexRow, GStyles.itemCenter, itemStyle.luckiestWrap]}>
              <Svg icon="luckiest" size={pTd(16)} />
              <TextM style={itemStyle.luckiest}>Luckiest Draw</TextM>
            </View>
          ) : (
            <View style={itemStyle.luckiestWrap} />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(RedPacketReceiverItem);

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
  name: {
    lineHeight: pTd(22),
    paddingRight: pTd(10),
    ...fonts.mediumFont,
  },
  time: {
    lineHeight: pTd(16),
    width: pTd(150),
    color: defaultColors.font7,
  },
  balanceWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amount: {
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  luckiest: {
    marginLeft: pTd(4),
    color: defaultColors.font6,
  },
  luckiestWrap: {
    height: pTd(16),
  },
});
