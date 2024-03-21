import React, { useMemo, useState } from 'react';
import { defaultColors } from 'assets/theme';
import { Image, StyleSheet, View, Text } from 'react-native';
import { ViewStyleType } from 'types/styles';
import { pTd } from 'utils/unit';

export function VerifierImage({
  size = 36,
  uri,
  label = '',
  style,
}: {
  size?: number;
  uri?: string;
  label?: string;
  style?: ViewStyleType;
}) {
  const iconStyle = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: defaultColors.bg4,
    };
  }, [size]);
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <View style={[styles.iconBox, iconStyle, style]}>
      {imgLoading && !!label ? <Text style={{ fontSize: pTd(18) }}>{label.charAt(0)}</Text> : null}
      <Image
        onLoad={() => {
          setImgLoading(false);
        }}
        source={{ uri }}
        style={[iconStyle, imgLoading && styles.hiddenStyle]}
        loadingIndicatorSource={require('../../../../assets/image/pngs/phone.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderColor: defaultColors.border2,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
  },
});
