import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { getHost } from '@portkey-wallet/utils/dapp/browser';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import TextWithProtocolIcon from 'components/TextWithProtocolIcon';
import Svg from 'components/Svg';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { UNKNOWN } from '@portkey-wallet/constants/constants-ca/allowance';

interface ITokenAllowanceItem {
  type?: 'home' | 'detail';
  item?: ITokenAllowance;
  onPress?: (item?: any) => void;
}

const TokenAllowanceItem: React.FC<ITokenAllowanceItem> = ({ item, type = 'home', onPress }) => {
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  if (type === 'detail') {
    return (
      <View key={item?.contractAddress} style={itemStyles.itemWrap}>
        <DiscoverWebsiteImage
          size={pTd(32)}
          imageUrl={item?.icon || getCmsWebsiteInfoImageUrl(item?.url || '')}
          style={itemStyles.itemImage}
        />
        <View style={itemStyles.itemCenter}>
          <TextWithProtocolIcon
            textFontSize={pTd(16)}
            title={item?.name || getCmsWebsiteInfoName(item?.name || '') || getHost(item?.url || '') || UNKNOWN}
            url={item?.url || ''}
          />
          <Touchable onPress={() => onPress?.(item)}>
            <TextM numberOfLines={1} style={[FontStyles.font4, itemStyles.itemDappUrl]}>
              {item?.url}
            </TextM>
          </Touchable>
        </View>
      </View>
    );
  }

  return (
    <Touchable key={item?.name} style={itemStyles.itemWrap} onPress={() => onPress?.(item)}>
      <DiscoverWebsiteImage
        size={pTd(32)}
        imageUrl={item?.icon || getCmsWebsiteInfoImageUrl(item?.url || '')}
        style={itemStyles.itemImage}
      />
      <View style={itemStyles.itemCenter}>
        <TextWithProtocolIcon
          textFontSize={pTd(16)}
          title={item?.name || getCmsWebsiteInfoName(item?.name || '') || getHost(item?.url || '') || UNKNOWN}
          url={item?.url || ''}
        />
        <TextM numberOfLines={1} style={[FontStyles.font7, itemStyles.itemDappUrl]}>
          {`Contract Address: ${formatStr2EllipsisStr(item?.contractAddress, 4)}`}
        </TextM>
      </View>
      <Svg icon="right-arrow" size={pTd(20)} />
    </Touchable>
  );
};

export default TokenAllowanceItem;

const itemStyles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    height: pTd(72),
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
