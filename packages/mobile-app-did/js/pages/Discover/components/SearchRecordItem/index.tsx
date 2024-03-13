import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';

type RecordListItemType = {
  item: IRecordsItemType;
  onPress?: () => void;
};

const SearchRecordItem: React.FC<RecordListItemType> = props => {
  const { item, onPress } = props;
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  return (
    <Touchable style={itemStyle.wrap} onPress={() => onPress?.()}>
      <DiscoverWebsiteImage imageUrl={getCmsWebsiteInfoImageUrl(item?.url || '')} />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <TextWithProtocolIcon
            title={getCmsWebsiteInfoName(item?.url || '') || item.name || ''}
            url={item.url || ''}
          />
          <TextS numberOfLines={1} style={[FontStyles.font3, itemStyle.gameInfo]}>
            {item?.url || ''}
          </TextS>
        </View>
      </View>
    </Touchable>
  );
};

export default memo(SearchRecordItem);

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
