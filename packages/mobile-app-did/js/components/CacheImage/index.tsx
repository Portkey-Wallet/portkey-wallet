import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageProps, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Default_Image from 'assets/image/pngs/default_record.png';
import { getLocalSource, initStateSource, getLocalUri } from './utils';
import isEqual from 'lodash/isEqual';
import { DeviceEventEmitter } from 'react-native';
import { isURISource } from 'utils/fs/img';
import { useDeviceEventListener } from 'hooks/useDeviceEvent';

const EVENT_NAME = 'reloadCacheImage';
export interface CacheImageProps extends ImageProps {
  thumb?: ImageProps['source'];
  originUri?: string;
}

export default function CacheImage(props: CacheImageProps) {
  const [source, setSource] = useState<CacheImageProps['source'] | undefined>(() => initStateSource(props.source));
  const [thumb, setThumb] = useState<CacheImageProps['thumb']>(() => initStateSource(props.thumb));

  const diffSetSource: React.Dispatch<React.SetStateAction<ImageSourcePropType | undefined>> = useCallback(
    targetSource => {
      if (!isEqual(targetSource, source)) setSource(targetSource);
    },
    [source],
  );
  const diffSetThumb: React.Dispatch<React.SetStateAction<ImageSourcePropType | undefined>> = useCallback(
    targetSource => {
      if (!isEqual(targetSource, thumb)) setThumb(targetSource);
    },
    [thumb],
  );
  const init = useCallback(async () => {
    if (props.originUri) {
      const localOriginSource = await getLocalUri(props.originUri);
      if (localOriginSource) return diffSetSource(localOriginSource);
    }
    // is ImageRequireSource
    const localSource = await getLocalSource(props.source);
    if (localSource) diffSetSource(localSource);
    if (isURISource(props.source) && isURISource(localSource))
      DeviceEventEmitter.emit(EVENT_NAME, { uri: props.source.uri, localPath: localSource.uri });
    if (props.thumb) {
      const localThumb = await getLocalSource(props.thumb);
      if (localThumb) diffSetThumb(localThumb);
    }
  }, [diffSetSource, diffSetThumb, props.originUri, props.source, props.thumb]);

  const listenerCallBack = useCallback(
    ({ uri, localPath }: { uri: string; localPath: string }) => {
      if (props.originUri === uri && source && isURISource(source) && source.uri !== localPath) init();
    },
    [init, props.originUri, source],
  );
  useDeviceEventListener(EVENT_NAME, listenerCallBack);

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
      {thumb && (
        <Image
          defaultSource={Default_Image}
          {...props}
          style={[props.style, !source ? undefined : styles.hide]}
          source={thumb}
        />
      )}
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
  hide: {
    opacity: 0,
    height: 0,
    width: 0,
  },
});
