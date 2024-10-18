import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TextL, TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';

type TokenItemProps = {
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
};

const TokenItem = ({ item, onHandleToken }: TokenItemProps) => {
  const symbolImages = useSymbolImages();
  const defaultToken = useDefaultToken();
  const { currentNetwork } = useWallet();
  console.log('🌹🌹🌹item', item);

  return (
    // if not touchable, can not scroll

    <Touchable style={itemStyle.wrap} key={`${item.symbol}${item.address}${item.chainId}}`}>
      <CommonAvatar
        hasBorder
        shapeType="circular"
        title={item.symbol}
        svgName={item.symbol === defaultToken.symbol ? 'testnet' : undefined}
        imageUrl={item.imageUrl || symbolImages[item.symbol]}
        avatarSize={pTd(40)}
        style={itemStyle.left}
        titleStyle={FontStyles.font11}
        borderStyle={GStyles.hairlineBorder}
      />

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
