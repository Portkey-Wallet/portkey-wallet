import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useCallback, useMemo, useRef } from 'react';
import { View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import CommonLargeList, { CommonLargeListProps } from '.';
import IndexBar, { IndexBarInterface } from '../IndexBar';
import { LargeList } from 'react-native-largelist';
export interface IndexLargeListProps extends CommonLargeListProps {
  data: Array<any>;
  headerHeight?: number;
  showHeader?: boolean;
  indexBarStyle?: ViewStyle;
  indexBarWrapStyle?: ViewStyle;
  indexBarBoxStyle?: ViewStyle;
  indexTextStyle?: TextStyle;
  indexArray?: Array<string>;
  upPullRefresh?: boolean;
  extraHeight?: number;
}
export default function IndexBarLargeList(props: IndexLargeListProps) {
  const largeListRef = useRef<LargeList>();
  const indexBarRef = useRef<IndexBarInterface>();

  const getOffset = useCallback(
    (key: number) => {
      const {
        data,
        indexHeight = 0,
        sectionHeight = 0,
        headerHeight,
        showHeader,
        heightForIndexPath,
        heightForSection,
      } = props;

      if (Array.isArray(data) && Array.isArray(data[0]?.items)) {
        let [sectionKey, itemKey, hotHeight] = [key, 0, 0];
        if (showHeader) {
          sectionKey = key === 0 ? key : key - 1;
          hotHeight = key ? headerHeight ?? 0 : 0;
        }
        for (let i = 0; i < sectionKey; i++) {
          if (Array.isArray(data[i]?.items)) itemKey = itemKey + data[i].items.length;
        }

        return (
          itemKey * (heightForIndexPath ? heightForIndexPath({ section: sectionKey, row: itemKey }) : indexHeight) +
          sectionKey * (heightForSection ? heightForSection(sectionKey) : sectionHeight) +
          hotHeight
        );
      }
      return 0;
    },
    [props],
  );

  const maxOffset = useMemo(() => {
    const _maxOffset = getOffset(props.data?.length) - screenHeight + (props.extraHeight ?? 0);
    return _maxOffset > 0 ? _maxOffset : 0;
  }, [getOffset, props.data?.length, props.extraHeight]);

  const onSectionSelect = useCallback(
    (key: number) => {
      const offset = getOffset(key);
      largeListRef.current?.scrollTo(
        {
          x: 0,
          y: Math.min(maxOffset, offset),
        },
        false,
      );
    },
    [getOffset, maxOffset],
  );
  const { indexArray, showHeader, renderHeader, indexBarBoxStyle, indexBarWrapStyle, ...listProps } = props;

  const indexNativeYList = useMemo(() => {
    const { data, indexHeight = 0, sectionHeight = 0, heightForIndexPath, heightForSection } = props;
    if (Array.isArray(data) && Array.isArray(data[0]?.items)) {
      let preNativeY = 0;
      return data.map((section, sectionIdx) => {
        const _preNativeY = preNativeY;
        preNativeY += heightForSection ? heightForSection(sectionIdx) : sectionHeight;
        if (Array.isArray(section?.items)) {
          preNativeY += (section?.items as Array<any>).reduce(
            (pv, _, cIdx) =>
              pv + (heightForIndexPath ? heightForIndexPath({ section: sectionIdx, row: cIdx }) : indexHeight),
            0,
          );
        }
        return _preNativeY;
      });
    }
    return [];
  }, [props]);

  return (
    <View style={styles.box}>
      <CommonLargeList
        ref={largeListRef as any}
        renderHeader={showHeader ? renderHeader : undefined}
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => {
          if (!indexNativeYList.length) return;
          for (let i = 0; i < indexNativeYList.length; i++) {
            if (y <= 0) {
              indexBarRef.current?.setSelectIndex(0);
              return;
            }
            if (indexNativeYList[i + 1] === undefined || (y >= indexNativeYList[i] && y < indexNativeYList[i + 1])) {
              indexBarRef.current?.setSelectIndex(i);
              return;
            }
          }
        }}
        {...listProps}
      />
      {indexArray && (
        <View style={[styles.indexBarWrap, indexBarWrapStyle]}>
          <IndexBar
            ref={indexBarRef}
            showPopover
            style={indexBarBoxStyle}
            data={indexArray}
            onPress={index => onSectionSelect(index)}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { flex: 1, position: 'relative' },
  indexBarWrap: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
