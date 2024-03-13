import React, { useMemo, useState } from 'react';
import { defaultColors } from 'assets/theme';
import { Image, StyleSheet, View, Text } from 'react-native';
import { ViewStyleType } from 'types/styles';
import { pTd } from 'utils/unit';
import { isIOS } from 'packages/utils/mobile/device';

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

  const source = useMemo(() => {
    if (isIOS) {
      return { uri: 'portkeyBlueBackground' };
    } else {
      return require('../../../../assets/image/pngs/portkeyBlueBackground.png');
    }
  }, []);

  const loadingIndicatorSource = useMemo(() => {
    if (isIOS) {
      return { uri: 'phone' };
    } else {
      return require('../../../../assets/image/pngs/phone.png');
    }
  }, []);

  return (
    <View style={[styles.iconBox, iconStyle, style]}>
      {imgLoading && !!label ? <Text style={{ fontSize: pTd(18) }}>{label.charAt(0)}</Text> : null}
      <Image
        onLoad={() => {
          setImgLoading(false);
        }}
        source={uri ? { uri } : source}
        style={[iconStyle, imgLoading && styles.hiddenStyle]}
        loadingIndicatorSource={loadingIndicatorSource}
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
