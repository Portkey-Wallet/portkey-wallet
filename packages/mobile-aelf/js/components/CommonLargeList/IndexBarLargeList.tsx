import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
  SectionList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import CommonLargeList, { CommonLargeListProps, SectionData } from 'components/CommonLargeList';
import IndexBar, { IndexBarInterface } from 'components/IndexBar';

export interface IndexLargeListProps extends CommonLargeListProps {
  data: SectionData[] | any[];
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
  const sectionListRef = useRef<SectionList>(null);
  const indexBarRef = useRef<IndexBarInterface>(null);

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

      if (Array.isArray(data) && Array.isArray((data[0] as SectionData)?.items)) {
        let [sectionKey, itemKey, hotHeight] = [key, 0, 0];
        if (showHeader) {
          sectionKey = key === 0 ? key : key - 1;
          hotHeight = key ? headerHeight ?? 0 : 0;
        }
        for (let i = 0; i < sectionKey; i++) {
          const section = data[i] as SectionData;
          if (Array.isArray(section?.items)) {
            itemKey = itemKey + section.items.length;
          }
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

  const onSectionSelect = useCallback((key: number) => {
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: key,
        itemIndex: 0,
        animated: false,
        viewOffset: 0,
      });
    }
  }, []);

  const { indexArray, showHeader, renderHeader, indexBarBoxStyle, indexBarWrapStyle, ...listProps } = props;

  const indexNativeYList = useMemo(() => {
    const { data, indexHeight = 0, sectionHeight = 0, heightForIndexPath, heightForSection } = props;
    if (Array.isArray(data) && Array.isArray((data[0] as SectionData)?.items)) {
      let preNativeY = 0;
      return data.map((section, sectionIdx) => {
        const _preNativeY = preNativeY;
        const sectionData = section as SectionData;
        preNativeY += heightForSection ? heightForSection(sectionIdx) : sectionHeight;
        if (Array.isArray(sectionData?.items)) {
          preNativeY += sectionData.items.reduce(
            (pv: number, _: any, cIdx: number) =>
              pv + (heightForIndexPath ? heightForIndexPath({ section: sectionIdx, row: cIdx }) : indexHeight),
            0,
          );
        }
        return _preNativeY;
      });
    }
    return [];
  }, [props]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      if (!indexNativeYList.length) {
        return;
      }
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
    },
    [indexNativeYList],
  );

  return (
    <View style={styles.box}>
      <CommonLargeList
        ref={sectionListRef}
        renderHeader={showHeader ? renderHeader : undefined}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
