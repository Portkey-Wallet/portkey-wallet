import React from 'react';
import { View, ViewStyle } from 'react-native';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import DiscoverWebsiteImage from 'pages/Discover/components/DiscoverWebsiteImage';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import Svg, { IconName } from 'components/Svg';
import { useTheme } from '@rneui/themed';

type TitleInfoSectionType = {
  title?: string;
  dappInfo: DappStoreItem;
  viewStyle?: ViewStyle;
};

export const TitleInfoSection = (props: TitleInfoSectionType) => {
  const {
    title,
    dappInfo: { origin, name, icon, svgIcon },
    viewStyle,
  } = props;
  const { theme } = useTheme();

  return (
    <View style={[GStyles.flexRow, fonts.BGMediumFont, viewStyle]}>
      {svgIcon ? (
        <Svg icon={svgIcon as IconName} size={pTd(48)} />
      ) : (
        <DiscoverWebsiteImage size={pTd(48)} imageUrl={icon || getFaviconUrl(origin)} />
      )}
      <View style={{ marginLeft: pTd(8) }}>
        <TextXXL style={[fonts.BGMediumFont, { lineHeight: pTd(24) }]}>{title || name}</TextXXL>
        <TextM style={{ color: theme.colors.textBase2, lineHeight: pTd(20), marginTop: pTd(4) }}>{origin}</TextM>
      </View>
    </View>
  );
};

export default TitleInfoSection;
