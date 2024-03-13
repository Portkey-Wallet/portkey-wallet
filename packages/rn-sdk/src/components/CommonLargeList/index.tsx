import React, { forwardRef, Ref } from 'react';
import { IndexPath, LargeList, LargeListPropType } from 'react-native-largelist';
import UpPullLoading from './components/UpPullLoading';
export interface CommonLargeListProps
  extends Omit<LargeListPropType, 'heightForIndexPath' | 'renderIndexPath' | 'heightForSection'> {
  indexHeight?: number;
  sectionHeight?: number;
  renderItem: LargeListPropType['renderIndexPath'];
  heightForIndexPath?: (index: IndexPath) => number;
  heightForSection?: (index: number) => number;
}

const CommonLargeList = forwardRef(function CommonLargeList(props: CommonLargeListProps, forwardedRef: Ref<LargeList>) {
  const {
    data,
    sectionHeight = 0,
    indexHeight = 0,
    renderItem,
    renderSection,
    heightForSection,
    heightForIndexPath,
    ...listProps
  } = props;

  const listData = data?.[0]?.items ? data : [{ items: data }];
  return (
    <LargeList
      {...listProps}
      ref={forwardedRef}
      renderIndexPath={renderItem}
      renderSection={renderSection}
      refreshHeader={UpPullLoading as any}
      heightForSection={heightForSection ? heightForSection : () => sectionHeight}
      heightForIndexPath={heightForIndexPath ? heightForIndexPath : () => indexHeight}
      data={Array.isArray(listData) ? listData : []}
    />
  );
});
export default CommonLargeList;
