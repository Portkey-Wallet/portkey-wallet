import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { getFaviconUrl, getHost } from '@portkey-wallet/utils/dapp/browser';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import Svg from 'components/Svg';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';

interface DappListItemProps {
  item?: DappStoreItem;
  isShowArrow?: boolean;
  onPress?: (item?: DappStoreItem) => void;
}

const DappListItem: React.FC<DappListItemProps> = ({ item, isShowArrow, onPress }) => {
  return (
    <Touchable key={item?.name} style={itemStyles.itemWrap} onPress={() => onPress?.(item)}>
      <DiscoverWebsiteImage size={pTd(32)} imageUrl={getFaviconUrl(item?.origin || '')} style={itemStyles.itemImage} />
      <View style={itemStyles.itemCenter}>
        <TextWithProtocolIcon
          textFontSize={pTd(16)}
          title={item?.name || getHost(item?.origin || '')}
          url={item?.origin || ''}
        />
        <TextM numberOfLines={1} ellipsizeMode="tail" style={[FontStyles.font7, itemStyles.itemDappUrl]}>
          {item?.origin || getHost(item?.origin || '')}
        </TextM>
      </View>
      {isShowArrow && <Svg icon="right-arrow" size={pTd(20)} />}
    </Touchable>
  );
};

export default DappListItem;

const itemStyles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...GStyles.paddingArg(13, 16),
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  itemImage: {
    marginRight: pTd(16),
    borderRadius: pTd(16),
  },
  itemCenter: {
    flex: 1,
    paddingRight: pTd(16),
  },
  itemDappTitle: {
    marginBottom: pTd(1),
  },
  itemDappUrl: {
    marginTop: pTd(1),
  },
  itemRight: {
    width: pTd(85),
    height: pTd(24),
    borderWidth: pTd(1),
    borderColor: defaultColors.font12,
    color: defaultColors.font12,
    textAlign: 'center',
    lineHeight: pTd(22),
    borderRadius: pTd(6),
  },
});
