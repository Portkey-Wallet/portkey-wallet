import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import React from 'react';
import { TextL, TextS } from 'components/CommonText';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';
import CommonSwitch from 'components/CommonSwitch';
import CommonAvatar from 'components/CommonAvatar';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import { FontStyles } from 'assets/theme/styles';
import { NetworkType } from '@portkey-wallet/types';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';

type TokenItemProps = {
  networkType: NetworkType;
  item: TokenItemShowType;
  onHandleToken: (item: TokenItemShowType, isDisplay: boolean) => void;
  onEditToken?: (item: TokenItemShowType) => void;
};

const TokenItem = ({ networkType, item, onHandleToken, onEditToken }: TokenItemProps) => {
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
            {item.label || item.symbol}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3]}>
            {`${formatChainInfoToShow(item.chainId, networkType)}`}
          </TextS>
        </View>

        {item.isDefault ? (
          <Svg icon="lock" size={pTd(20)} iconStyle={itemStyle.addedStyle} />
        ) : (
          <View style={itemStyle.switchWrap}>
            <Touchable
              onPress={() => {
                onEditToken && onEditToken(item);
              }}>
              <Svg icon="edit_token" size={pTd(16)} iconStyle={itemStyle.editStyle} />
            </Touchable>
            <Touchable
              onPress={() => {
                onHandleToken(item, !!item.isAdded);
              }}>
              <View pointerEvents="none">
                <CommonSwitch value={!!item.isAdded} />
              </View>
            </Touchable>
          </View>
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
  switchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editStyle: {
    marginRight: pTd(12),
  },
  addedStyle: {
    marginRight: pTd(14),
  },
});
