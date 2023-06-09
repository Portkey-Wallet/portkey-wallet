import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { pTd } from 'utils/unit';

import Svg from 'components/Svg';

import { useLanguage } from 'i18n/hooks';
import { getFaviconUrl, getHost } from '@portkey-wallet/utils/dapp/browser';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ITabItem } from '@portkey-wallet/store/store-ca/discover/type';
import { closeExistingTab, setActiveTab } from '@portkey-wallet/store/store-ca/discover/slice';

interface ICardsProps {
  item: ITabItem;
}

const Card: React.FC<ICardsProps> = (props: ICardsProps) => {
  const { item } = props;
  const { t } = useLanguage();
  const dispatch = useAppCommonDispatch();

  return (
    <View style={tabShowItemStyle.cardWrap}>
      <View style={tabShowItemStyle.header}>
        <Image style={tabShowItemStyle.icon} source={{ uri: getFaviconUrl(item.url) }} />
        <TextM numberOfLines={1} ellipsizeMode="tail" style={tabShowItemStyle.title}>
          {item?.name ?? getHost(item?.url)}
        </TextM>
        <TouchableOpacity onPress={() => dispatch(closeExistingTab(item.id))}>
          <Svg icon="close" size={12} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => dispatch(setActiveTab(item.id))}>
        <Image
          resizeMode="cover"
          style={tabShowItemStyle.screenshot}
          source={{
            uri: item?.screenShotUrl,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const tabShowItemStyle = StyleSheet.create({
  cardWrap: {
    borderRadius: pTd(8),
    width: pTd(160),
    height: pTd(214),
    marginTop: pTd(24),
    borderColor: 'green',
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    ...GStyles.paddingArg(6, 8),
    height: pTd(32),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: pTd(20),
    height: pTd(20),
  },
  title: {
    flex: 1,
    marginLeft: pTd(8),
    marginRight: pTd(8),
  },
  screenshot: {
    width: pTd(160),
    height: pTd(182),
  },
});
