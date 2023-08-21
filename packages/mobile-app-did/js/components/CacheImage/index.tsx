import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageProps, StyleSheet, View } from 'react-native';
import { checkExistsImage, getCacheImage, isURISource } from 'utils/fs/img';
import Default_Image from 'assets/image/pngs/default_record.png';

export interface CacheImageProps extends ImageProps {
  thumb?: ImageProps['source'];
  originUri?: string;
}

export default function CacheImage(props: CacheImageProps) {
  const [source, setSource] = useState<CacheImageProps['source']>();
  const [thumb, setThumb] = useState<CacheImageProps['thumb']>();

  const init = useCallback(async () => {
    if (props.originUri) {
      const path = await checkExistsImage(props.originUri);
      if (path) return setSource({ uri: path });
    }
    // is ImageRequireSource
    if (!isURISource(props.source)) return setSource(props.source);
    const localSource = await getCacheImage(props.source);
    localSource && setSource(localSource);
    if (props.thumb) {
      if (!isURISource(props.thumb)) return setThumb(props.thumb);
      const localThumb = await getCacheImage(props.thumb);
      localThumb && setThumb(localThumb);
    }
  }, [props.originUri, props.source, props.thumb]);

  useEffectOnce(() => {
    init();
  });

  const indicator = useMemo(
    () => (
      <View style={styles.indicatorBox}>
        <ActivityIndicator size={'small'} color={FontStyles.font4.color} />
      </View>
    ),
    [],
  );

  return (
    <View style={props.style}>
      {thumb && !source && <Image defaultSource={Default_Image} {...props} style={props.style} source={thumb} />}
      {!source ? indicator : <Image defaultSource={Default_Image} {...props} style={props.style} source={source} />}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: { overflow: 'hidden' },
  indicatorBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...GStyles.center,
    backgroundColor: 'transparent',
  },
});
