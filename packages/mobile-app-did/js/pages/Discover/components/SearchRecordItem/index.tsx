import { TextM } from 'components/CommonText';
import React, { memo } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import DiscoverWebsiteImage from '../DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';
import { makeStyles } from '@rneui/themed';

type RecordListItemType = {
  item: IRecordsItemType;
  onPress?: () => void;
};

const SearchRecordItem: React.FC<RecordListItemType> = props => {
  const { item, onPress } = props;
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();
  const itemStyle = getStyles();

  return (
    <Touchable style={itemStyle.wrap} onPress={() => onPress?.()}>
      <DiscoverWebsiteImage size={pTd(42)} imageUrl={getCmsWebsiteInfoImageUrl(item?.url || '')} />
      <View style={itemStyle.right}>
        <View style={itemStyle.infoWrap}>
          <View style={itemStyle.gameNameWrap}>
            <TextWithProtocolIcon
              textFontSize={pTd(16)}
              title={getCmsWebsiteInfoName(item?.url || '') || item.name || ''}
              url={item.url || ''}
            />
          </View>
          <View style={itemStyle.gameInfoWrap}>
            <TextM numberOfLines={1} style={itemStyle.gameInfo}>
              {item?.url || ''}
            </TextM>
          </View>
        </View>
      </View>
    </Touchable>
  );
};

export default memo(SearchRecordItem);

const getStyles = makeStyles(theme => ({
  wrap: {
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    height: pTd(74),
    marginLeft: pTd(8),
    paddingRight: pTd(16),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  gameNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(22),
  },
  gameInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pTd(20),
  },
  gameInfo: {
    color: theme.colors.textBase2,
    lineHeight: pTd(17.5),
  },
}));
