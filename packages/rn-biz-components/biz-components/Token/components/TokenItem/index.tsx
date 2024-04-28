import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import React from 'react';
import { TextL, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import CommonSwitch from '@portkey-wallet/rn-components/components/CommonSwitch';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { NetworkType } from '@portkey-wallet/types';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import Touchable from '@portkey-wallet/rn-components/components/Touchable';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';

type TokenItemProps = {
  networkType: NetworkType;
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
};

const TokenItem = ({ networkType, item, onHandleToken }: TokenItemProps) => {
  const symbolImages = useSymbolImages();
  const defaultToken = useDefaultToken();

  return (
    // if not touchable, can not scroll

    <Touchable style={itemStyle.wrap} key={`${item.symbol}${item.address}${item.chainId}}`}>
      <CommonAvatar
        hasBorder
        shapeType="circular"
        title={item.symbol}
        svgName={item.symbol === defaultToken.symbol ? 'testnet' : undefined}
        imageUrl={item.imageUrl || symbolImages[item.symbol]}
        avatarSize={pTd(48)}
        style={itemStyle.left}
        titleStyle={FontStyles.font11}
        borderStyle={GStyles.hairlineBorder}
      />

      <View style={itemStyle.right}>
        <View>
          <TextL numberOfLines={1} ellipsizeMode={'tail'}>
            {item.symbol}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3]}>
            {`${formatChainInfoToShow(item.chainId, networkType)}`}
          </TextS>
        </View>

        {item.isDefault ? (
          <Svg icon="lock" size={pTd(20)} iconStyle={itemStyle.addedStyle} />
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
    </Touchable>
  );
};

export default TokenItem;

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(72),
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
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  addedStyle: {
    marginRight: pTd(14),
  },
});
