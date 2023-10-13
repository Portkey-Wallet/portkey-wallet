import React, { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatListProps,
} from 'react-native';
import { defaultColors } from 'assets/theme';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { TextM } from 'components/CommonText';
import { ON_END_REACHED_THRESHOLD } from '@portkey-wallet/constants/constants-ca/activity';
interface ListComponentProps<ItemT> extends FlatListProps<ItemT> {
  whetherAutomatic?: boolean; // Whether to automatically load more, if there is a ceiling, you can not set this property to true
  upPullRefresh?: () => void; // Pull-down refresh callback
  data: ReadonlyArray<ItemT> | null | undefined;
  onEndReachedThreshold?: number; // Determines how far away the onEndReached callback is when it is far from the bottom of the content. default0.3
  onEndReached?: () => void; // Pull-refresh callback,
  loadCompleted?: boolean; // Whether all data has been loaded and the tail component is hidden
  noPositionTips?: string;
  showFooter?: boolean;
  allLoadedTips?: string;
  message?: string;
  bottomLoadTip?: string;
}
export interface ListComponentInterface {
  // End pull-down refresh
  endUpPullRefresh: () => void;
  // End the bottom refresh state
  endBottomRefresh: () => void;
  onRefresh: () => void;
}
const listProps = {
  //Improve performance
  windowSize: 50,
  maxToRenderPerBatch: 5,
  // removeClippedSubviews: false,
  // legacyImplementation: true
};
const ListComponent = forwardRef(function ListComponent(
  { onEndReachedThreshold = ON_END_REACHED_THRESHOLD, whetherAutomatic = false, ...props }: ListComponentProps<any>,
  forwardedRef,
) {
  const { upPullRefresh, loadCompleted, showFooter } = props;

  const [bottomLoad, setBottomLoad] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const endRefresh = useRef<NodeJS.Timeout>();
  const canLoadMore = useRef<boolean>();
  useEffect(() => {
    return () => {
      endRefresh.current && clearTimeout(endRefresh.current);
    };
  }, []);
  const onEndReached = useCallback(
    (info: { distanceFromEnd: number } | true) => {
      if (info || (canLoadMore && !loadCompleted)) {
        setBottomLoad(true);
        props.onEndReached?.();
        canLoadMore.current = false;
      }
    },
    [loadCompleted, props],
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    props.upPullRefresh?.();
  }, [props]);
  // End pull-down refresh
  const endUpPullRefresh = () => {
    endRefresh.current && clearTimeout(endRefresh.current);
    endRefresh.current = setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  //End the bottom refresh state
  const endBottomRefresh = useCallback(() => {
    setBottomLoad(false);
  }, []);
  const onMomentumScrollBegin = useCallback(() => {
    canLoadMore.current = true;
  }, []);
  useImperativeHandle(forwardedRef, () => ({ endUpPullRefresh, endBottomRefresh, onRefresh }), [
    endBottomRefresh,
    onRefresh,
  ]);
  const ListFooterComponent = useCallback(() => {
    const { allLoadedTips, bottomLoadTip } = props;
    if (loadCompleted) {
      return (
        <View style={styles.FooterStyles}>
          <TextM>{allLoadedTips || 'All loaded'}</TextM>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={() => onEndReached(true)} style={styles.FooterStyles}>
        {bottomLoad ? (
          <ActivityIndicator size="large" color={defaultColors.primaryColor} />
        ) : (
          <TextM>{bottomLoadTip || 'Click to load more'}</TextM>
        )}
      </TouchableOpacity>
    );
  }, [bottomLoad, loadCompleted, onEndReached, props]);
  return (
    <FlatList
      {...listProps}
      {...props}
      extraData={bottomLoad && loadCompleted}
      keyExtractor={(_, index) => index.toString()}
      onMomentumScrollBegin={onMomentumScrollBegin}
      ListFooterComponent={!showFooter ? null : ListFooterComponent}
      onEndReached={whetherAutomatic ? onEndReached : undefined}
      refreshControl={
        upPullRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            colors={[defaultColors.primaryColor]}
            tintColor={defaultColors.primaryColor}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
});
const styles = StyleSheet.create({
  FooterStyles: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: bottomBarHeight,
  },
});

export default ListComponent;
