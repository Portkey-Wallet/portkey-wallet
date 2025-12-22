import React, { forwardRef, Ref, useCallback, useMemo } from 'react';
import { SectionList, SectionListProps, SectionListRenderItemInfo, View, RefreshControl } from 'react-native';

export interface IndexPath {
  section: number;
  row: number;
}

export interface SectionData {
  index?: string;
  items: any[];
}

export interface CommonLargeListProps
  extends Omit<SectionListProps<any, SectionData>, 'sections' | 'renderItem' | 'renderSectionHeader'> {
  data: SectionData[] | any[];
  indexHeight?: number;
  sectionHeight?: number;
  renderItem: (info: { section: number; row: number }) => React.ReactElement | null;
  renderSection?: (sectionIndex: number) => React.ReactElement | null;
  renderHeader?: () => React.ReactElement | null;
  renderEmpty?: () => React.ReactElement | null;
  heightForIndexPath?: (index: IndexPath) => number;
  heightForSection?: (index: number) => number;
  onScroll?: SectionListProps<any, SectionData>['onScroll'];
  refreshing?: boolean;
  onRefresh?: () => void;
}

export interface CommonLargeListRef {
  scrollTo: (params: { x: number; y: number }, animated?: boolean) => void;
}

const CommonLargeList = forwardRef(function CommonLargeList(
  props: CommonLargeListProps,
  forwardedRef: Ref<SectionList>,
) {
  const {
    data,
    sectionHeight = 0,
    indexHeight = 0,
    renderItem,
    renderSection,
    renderHeader,
    renderEmpty,
    heightForSection,
    heightForIndexPath,
    refreshing,
    onRefresh,
    ...listProps
  } = props;

  // Convert data to SectionList format
  const sections = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Check if data is already in section format
    if (data[0]?.items) {
      return (data as SectionData[]).map((section, index) => ({
        ...section,
        data: section.items,
        sectionIndex: index,
      }));
    }

    // Wrap flat data in a single section
    return [{ data: data, items: data, sectionIndex: 0 }];
  }, [data]);

  const renderSectionItem = useCallback(
    ({ item, index, section }: SectionListRenderItemInfo<any, SectionData & { sectionIndex: number }>) => {
      return renderItem({ section: section.sectionIndex, row: index });
    },
    [renderItem],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData & { sectionIndex: number } }) => {
      if (!renderSection) {
        return null;
      }
      return renderSection(section.sectionIndex);
    },
    [renderSection],
  );

  const getItemLayout = useCallback(
    (_data: any, index: number) => {
      // Use fixed height for simplicity, can be enhanced if needed
      return {
        length: indexHeight,
        offset: indexHeight * index,
        index,
      };
    },
    [indexHeight],
  );

  const ListEmptyComponent = useMemo(() => {
    if (renderEmpty) {
      return renderEmpty();
    }
    return null;
  }, [renderEmpty]);

  const ListHeaderComponent = useMemo(() => {
    if (renderHeader) {
      return renderHeader();
    }
    return null;
  }, [renderHeader]);

  return (
    <SectionList
      {...listProps}
      ref={forwardedRef}
      sections={sections}
      renderItem={renderSectionItem}
      renderSectionHeader={renderSectionHeader}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={(item, index) => `item-${index}`}
      stickySectionHeadersEnabled={false}
      getItemLayout={heightForIndexPath ? undefined : getItemLayout}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} /> : undefined}
    />
  );
});

export default CommonLargeList;
