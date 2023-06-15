import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
type RecordListItemType = {
  item: IRecordsItemType;
  onPress?: () => void;
};

const RecordItem: React.FC<RecordListItemType> = props => {
  const { item, onPress } = props;

  return (
    <TouchableOpacity style={itemStyle.wrap} onPress={() => onPress?.()}>
      <DiscoverWebsiteImage imageUrl={getFaviconUrl(item?.url || '')} />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextM numberOfLines={1} ellipsizeMode={'tail'} style={itemStyle.gameName}>
            {item?.title || item?.url}
          </TextM>
          <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.gameInfo]}>
            {item?.url || ''}
          </TextS>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RecordItem);

const itemStyle = StyleSheet.create({
  wrap: {
    height: pTd(70),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(70),
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
