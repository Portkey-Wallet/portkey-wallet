import { getOrigin, isDangerousLink } from '@portkey-wallet/utils/dapp/browser';
import { darkColors } from 'assets/theme';

import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

interface ITextWithProtocolIconProps {
  title?: string;
  url: string;
  textFontSize?: number;
  wrapStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  type?: 'iconLeft' | 'iconRight';
  location?: 'header' | 'other';
  showProtocolIcon?: boolean;
}

const TextWithProtocolIcon = ({
  title = '',
  url,
  textFontSize = pTd(14),
  iconSize = pTd(14),
  wrapStyle = {},
  type = 'iconRight',
  location = 'other',
  showProtocolIcon = true,
}: ITextWithProtocolIconProps) => {
  const isDanger = isDangerousLink(url);

  const textStyleObj: any = {
    fontSize: textFontSize,
  };

  const ProtocolIcon = useMemo(() => {
    if (!showProtocolIcon) {
      return null;
    }
    if (isDanger) {
      return <Svg icon="warning-fill" size={iconSize} iconStyle={styles.iconStyle} color={darkColors.iconDanger2} />;
    }
  }, [iconSize, isDanger, showProtocolIcon]);

  return (
    <View style={[styles.wrap, wrapStyle]}>
      {type === 'iconLeft' && ProtocolIcon}
      <TextM
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.text, location === 'header' && styles.headerTextColor, textStyleObj]}>
        {title || getOrigin(url)}
      </TextM>
      {type === 'iconRight' && ProtocolIcon}
    </View>
  );
};

export default memo(TextWithProtocolIcon);

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingRight: pTd(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    paddingRight: pTd(0),
    maxWidth: pTd(240),
    overflow: 'hidden',
  },
  iconStyle: {
    marginRight: pTd(4),
    marginLeft: pTd(4),
  },
  headerTextColor: {
    color: darkColors.textBase1,
  },
});
