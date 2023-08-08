import { FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ImageProps, StyleSheet } from 'react-native';
import { getCacheImage, isURISource } from 'utils/fs/img';
import { pTd } from 'utils/unit';

export default function CacheImage(props: ImageProps) {
  const [source, setSource] = useState<ImageProps['source']>();
  const init = useCallback(async () => {
    // is ImageRequireSource
    if (!isURISource(props.source)) return setSource(props.source);
    const localSource = await getCacheImage(props.source);
    localSource && setSource(localSource);
  }, [props.source]);

  useEffectOnce(() => {
    init();
  });
  if (!source) return <ActivityIndicator size={'small'} color={FontStyles.font4.color} style={styles.indicatorStyle} />;
  return <Image {...props} style={props.style} source={source} />;
}

const styles = StyleSheet.create({
  backgroundStyle: { overflow: 'hidden' },
  indicatorStyle: { marginHorizontal: pTd(5) },
});
