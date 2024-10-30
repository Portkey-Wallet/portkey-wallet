import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TextL, TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { darkColors } from 'assets/theme';

type TokenItemProps = {
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
};

const TokenItem = ({ item, onHandleToken }: TokenItemProps) => {
  const { currentNetwork } = useWallet();

  return (
    // if not touchable, can not scroll

    <Touchable style={itemStyle.wrap}>
      <View style={itemStyle.iconWrap}>
        <CommonAvatar
          hasBorder
          style={itemStyle.tokenIcon}
          title={item?.symbol}
          avatarSize={pTd(40)}
          imageUrl={item?.imageUrl}
          borderStyle={GStyles.hairlineBorder}
        />
        <CommonAvatar
          hasBorder={true}
          style={itemStyle.chainIcon}
          title={item?.displayChainName}
          avatarSize={pTd(20)}
          imageUrl={item?.chainImageUrl}
          borderStyle={itemStyle.tokenIconBorder}
        />
      </View>

      <View style={itemStyle.right}>
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'}>
            {item.label || item.symbol}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'}>
            {`${item.displayChainName || ''} ${currentNetwork === 'TESTNET' && 'Testnet'}`}
          </TextS>
        </View>

        <View style={itemStyle.rightIcon}>
          {item.isDefault ? (
            <Svg icon="lock" size={pTd(20)} />
          ) : (
            <Touchable
              onPress={() => {
                onHandleToken(item, !!item.isAdded);
              }}>
              <View pointerEvents="none">
                <CommonSwitch value={!!item.isAdded} />
              </View>
            </Touchable>
          )}
        </View>
      </View>
    </Touchable>
  );
};

export default TokenItem;

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginLeft: pTd(16),
  },
  iconWrap: {
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tokenIconBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: darkColors.borderBase1,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(16),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightIcon: {
    marginTop: pTd(16),
    alignSelf: 'flex-start',
  },
});
