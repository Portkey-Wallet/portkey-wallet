import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextL, TextS } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { getHost } from '@portkey-wallet/utils/dapp/browser';

type DappInfoSectionType = {
  dappInfo: DappStoreItem;
};

export const DappInfoSection = (props: DappInfoSectionType) => {
  const {
    dappInfo: { origin, name, icon },
  } = props;

  return (
    <View style={GStyles.center}>
      <DiscoverWebsiteImage size={pTd(48)} imageUrl={icon} style={styles.favIcon} />
      <TextL numberOfLines={1} ellipsizeMode="tail" style={[fonts.mediumFont, styles.title]}>
        {name || getHost(origin)}
      </TextL>
      <TextS numberOfLines={1} ellipsizeMode="tail" style={FontStyles.font7}>
        {origin}
      </TextS>
    </View>
  );
};

export default DappInfoSection;

const styles = StyleSheet.create({
  contentWrap: {
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  favIcon: {
    width: pTd(48),
    height: pTd(48),
    marginBottom: pTd(8),
    marginTop: pTd(24),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
  },
  title: {
    marginBottom: pTd(2),
  },
});
