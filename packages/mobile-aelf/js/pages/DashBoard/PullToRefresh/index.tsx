import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import {
  PullToRefreshHeader,
  PullToRefreshHeaderProps,
  PullToRefreshOffsetChangedEvent,
  PullToRefreshStateChangedEvent,
  PullToRefreshStateIdle,
  PullToRefreshStateRefreshing,
} from '@sdcx/pull-to-refresh';
import { pTd } from 'utils/unit';
import loading from 'assets/image/pngs/loading.png';

export default function CustomPullToRefreshHeader(props: PullToRefreshHeaderProps) {
  const { onRefresh, refreshing } = props;

  const [text, setText] = useState('pull to refresh');
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onStateChanged = useCallback((event: PullToRefreshStateChangedEvent) => {
    const state = event.nativeEvent.state;
    if (state === PullToRefreshStateIdle) {
      setText('pull to refresh');
    } else if (state === PullToRefreshStateRefreshing) {
      setText('refreshing...');
    } else {
      setText('release to refresh');
    }
  }, []);

  const onOffsetChanged = useCallback((event: PullToRefreshOffsetChangedEvent) => {
    console.log('refresh header offset', event.nativeEvent.offset);
  }, []);

  useEffect(() => {
    if (refreshing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [refreshing, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <PullToRefreshHeader
      style={styles.container}
      onOffsetChanged={onOffsetChanged}
      onStateChanged={onStateChanged}
      onRefresh={onRefresh}
      refreshing={refreshing}>
      {text === 'refreshing...' ? (
        <View style={styles.container}>
          <Animated.Image source={loading} style={[styles.image, { transform: [{ rotate }] }]} />
        </View>
      ) : (
        <Image source={loading} style={styles.image} />
      )}
    </PullToRefreshHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    height: pTd(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  image: {
    width: pTd(32),
    height: pTd(32),
  },
});
