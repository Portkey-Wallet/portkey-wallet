import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import React from 'react';
import { TextL, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from 'utils/unit';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import CommonSwitch from '@portkey-wallet/rn-components/components/CommonSwitch';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import { FontStyles } from 'assets/theme/styles';
import { useSymbolImages } from 'components/TokenOverlay/hooks';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { useDefaultToken } from 'pages/Ramp/RampPreview/hook';
import { NetworkType } from '@portkey-wallet/types';

type TokenItemProps = {
  networkType: NetworkType;
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
};

const TokenItem = ({ networkType, item, onHandleToken }: TokenItemProps) => {
  const symbolImages = useSymbolImages();
  const defaultToken = useDefaultToken();

  return (
    <TouchableOpacity style={itemStyle.wrap} key={`${item.symbol}${item.address}${item.chainId}}`}>
      <CommonAvatar
        hasBorder
        shapeType="circular"
        title={item.symbol}
        svgName={item.symbol === defaultToken.symbol ? 'testnet' : undefined}
        imageUrl={item.imageUrl || symbolImages[item.symbol]}
        avatarSize={pTd(48)}
        style={itemStyle.left}
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
          <TouchableOpacity
            onPress={() => {
              onHandleToken(item, !!item.isAdded);
            }}>
            <View pointerEvents="none">
              <CommonSwitch value={!!item.isAdded} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
