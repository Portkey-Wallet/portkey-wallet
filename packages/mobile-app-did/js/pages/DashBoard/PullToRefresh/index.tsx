import React, { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  PullToRefreshHeader,
  PullToRefreshHeaderProps,
  PullToRefreshOffsetChangedEvent,
  PullToRefreshStateChangedEvent,
  PullToRefreshStateIdle,
  PullToRefreshStateRefreshing,
} from '@sdcx/pull-to-refresh';
import { pTd } from 'utils/unit';

export default function CustomPullToRefreshHeader(props: PullToRefreshHeaderProps) {
  const { onRefresh, refreshing } = props;

  const [text, setText] = useState('下拉刷新');

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

  return (
    <PullToRefreshHeader
      style={styles.container}
      onOffsetChanged={onOffsetChanged}
      onStateChanged={onStateChanged}
      onRefresh={onRefresh}
      refreshing={refreshing}>
      <Text style={styles.text}>{text}</Text>
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
});
