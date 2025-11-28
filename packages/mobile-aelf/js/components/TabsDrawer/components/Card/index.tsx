import { TextS } from 'components/CommonText';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { pTd } from 'utils/unit';
import Svg from 'components/Svg';

import { getHost } from '@portkey-wallet/utils/dapp/browser';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-eoa/discover/type';
import { closeExistingTab, setActiveTab } from '@portkey-wallet/store/store-eoa/discover/slice';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { darkColors } from 'assets/theme';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-eoa/cms';
import Touchable from 'components/Touchable';

interface ICardsProps {
  item: ITabItem;
}

const Card: React.FC<ICardsProps> = (props: ICardsProps) => {
  const { item } = props;
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  return (
    <View style={tabShowItemStyle.cardWrap}>
      <View style={tabShowItemStyle.header}>
        <DiscoverWebsiteImage size={pTd(20)} imageUrl={getCmsWebsiteInfoImageUrl(item.url)} />
        <TextS numberOfLines={1} ellipsizeMode="tail" style={tabShowItemStyle.title}>
          {getCmsWebsiteInfoName(item.url) || item?.name || getHost(item?.url)}
        </TextS>
        <Touchable onPress={() => dispatch(closeExistingTab({ id: item?.id, networkType }))}>
          <Svg icon="close" size={12} />
        </Touchable>
      </View>
      <Touchable onPress={() => dispatch(setActiveTab({ id: item.id, networkType }))}>
        <Image
          resizeMode="cover"
          style={tabShowItemStyle.screenshot}
          source={{
            uri: item?.screenShotUrl,
          }}
        />
      </Touchable>
    </View>
  );
};

export default Card;

const tabShowItemStyle = StyleSheet.create({
  cardWrap: {
    borderRadius: pTd(16),
    width: pTd(172.5),
    height: pTd(214),
    marginTop: pTd(16),
    shadowOffset: { width: 2, height: 10 },
    backgroundColor: darkColors.bgBase2,
    borderWidth: 1,
    borderColor: darkColors.borderBase1,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    padding: pTd(8),
    height: pTd(36),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginLeft: pTd(8),
    marginRight: pTd(8),
  },
  screenshot: {
    width: pTd(172.5),
    height: pTd(182),
    overflow: 'hidden',
    borderBottomLeftRadius: pTd(16),
    borderBottomRightRadius: pTd(16),
  },
});
