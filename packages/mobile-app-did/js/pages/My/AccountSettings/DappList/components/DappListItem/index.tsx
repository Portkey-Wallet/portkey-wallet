import React from 'react';
import { View } from 'react-native';
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
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import { makeStyles } from '@rneui/themed';

interface DappListItemProps {
  type?: 'home' | 'detail';
  item?: DappStoreItem;
  onPress?: (item?: DappStoreItem) => void;
}

const DappListItem: React.FC<DappListItemProps> = ({ item, type = 'home', onPress }) => {
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const styles = getStyles();

  if (type === 'detail') {
    return (
      <View key={item?.name} style={styles.itemDetailWrap}>
        <View style={styles.detailImageWarp}>
          <DiscoverWebsiteImage
            style={styles.websiteImg}
            size={pTd(80)}
            imageUrl={item?.icon || getCmsWebsiteInfoImageUrl(item?.origin || '')}
          />
        </View>
        <View style={styles.detailTitleWrap}>
          <TextWithProtocolIcon
            showProtocolIcon={false}
            title={getCmsWebsiteInfoName(item?.origin || '') || item?.name || getHost(item?.origin || '')}
            url={item?.origin || ''}
            textFontSize={pTd(16)}
            wrapStyle={styles.textWithPro}
          />
          <Touchable onPress={() => onPress?.(item)}>
            <TextM numberOfLines={1} style={[FontStyles.font7, styles.itemDappUrl]}>
              {item?.origin}
            </TextM>
          </Touchable>
        </View>
      </View>
    );
  }

  return (
    <Touchable key={item?.name} style={styles.itemWrap} onPress={() => onPress?.(item)}>
      <DiscoverWebsiteImage
        size={pTd(42)}
        imageUrl={getCmsWebsiteInfoImageUrl(item?.origin || '')}
        style={styles.itemImage}
      />
      <View style={styles.itemCenter}>
        <TextWithProtocolIcon
          textFontSize={pTd(16)}
          showProtocolIcon={false}
          title={getCmsWebsiteInfoName(item?.origin || '') || item?.name || getHost(item?.origin || '')}
          url={item?.origin || ''}
        />
        <TextM numberOfLines={1} style={[FontStyles.font7, styles.itemDappUrl]}>
          {item?.origin}
        </TextM>
      </View>
      <Svg icon="right-arrow" size={pTd(20)} />
    </Touchable>
  );
};

export default DappListItem;

const getStyles = makeStyles(theme => ({
  itemDetailWrap: {
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(16),
  },
  itemWrap: {
    width: '100%',
    height: pTd(74),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(16),
  },
  detailImageWarp: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  websiteImg: {
    borderWidth: pTd(0),
  },
  itemImage: {
    marginRight: pTd(8),
  },
  detailTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: pTd(8),
  },
  textWithPro: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: pTd(0),
  },
  itemCenter: {
    flex: 1,
    paddingRight: pTd(16),
  },
  title: {
    textAlign: 'center',
  },
  itemDappTitle: {
    marginBottom: pTd(1),
  },
  itemDappUrl: {
    marginTop: pTd(1),
  },
  itemDappUrlDetail: {
    textAlign: 'center',
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
}));
