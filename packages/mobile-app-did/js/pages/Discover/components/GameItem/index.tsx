import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { IGameListItemType } from '@portkey-wallet/types/types-ca/discover';
import GameImage from '../GameImage';
import { GameImgMapKeyType } from '../GameImage/index';
interface TokenListItemType {
  item: IGameListItemType;
  onPress?: () => void;
}

const GameItem: React.FC<TokenListItemType> = props => {
  const { item, onPress } = props;

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.()}>
      <GameImage size={pTd(40)} pngName={item?.pngName as GameImgMapKeyType} />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextL numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.gameName}>
            {item?.label}
          </TextL>
          <TextS numberOfLines={1} ellipsizeMode={'tail'} style={[FontStyles.font3, itemStyle.gameInfo]}>
            {item?.introduction}
          </TextS>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(GameItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(80),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(80),
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
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gameName: {
    lineHeight: pTd(22),
  },
  gameInfo: {
    lineHeight: pTd(16),
    marginTop: pTd(2),
  },
});
