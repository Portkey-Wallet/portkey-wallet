import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { View } from 'react-native';
import React from 'react';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { darkColors } from 'assets/theme';
import { makeStyles } from '@rneui/themed';
import CustomSwitch from 'components/CustomSwitch';
// import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

type TokenItemProps = {
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
};

const TokenItem = ({ item, onHandleToken }: TokenItemProps) => {
  // const isMainnet = useIsMainnet();
  const itemStyle = getStyles();
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
          titleStyle={{ fontSize: pTd(16) }}
          borderStyle={itemStyle.chainIconBorder}
        />
      </View>

      <View style={itemStyle.right}>
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'}>
            {item.label || item.symbol}
          </TextL>
          <TextM numberOfLines={1} ellipsizeMode={'tail'} style={{ color: darkColors.textBase2 }}>
            {/*{`${item.displayChainName || ''} ${isMainnet ? '' : 'Testnet'}`}*/}
            {`${item.displayChainName || ''}`}
          </TextM>
        </View>

        <View style={itemStyle.rightIcon}>
          {item.isDefault ? (
            <Svg icon="lock" size={pTd(20)} />
          ) : (
            <CustomSwitch
              value={!!item.isAdded}
              onToggle={() => {
                onHandleToken(item, !!item.isAdded);
              }}
            />
          )}
        </View>
      </View>
    </Touchable>
  );
};

export default TokenItem;

const getStyles = makeStyles(theme => ({
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    marginLeft: pTd(16),
    width: pTd(45),
    height: pTd(42),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  chainIconBorder: {
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
  right: {
    height: pTd(72),
    marginLeft: pTd(8),
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
}));
