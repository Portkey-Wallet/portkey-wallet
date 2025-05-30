import CommonHeader from 'components/CommonHeader';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { ITokenAllowanceProps } from '..';
import LoadingMore from 'components/LoadingMore/LoadingMore';

export default function TokenAllowancePopup({
  headerTitle,
  goBack,
  list,
  fetching,
  hasMore,
  fetchMoreList,
}: BaseHeaderProps & IMenuItemProps & ITokenAllowanceProps) {
  return (
    <div className="token-allowance-page-popup token-allowance-page min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      {!fetching && list.length === 0 ? (
        <div className="no-data flex-center">No data</div>
      ) : (
        <>
          <MenuList list={list} height={92} />
          <LoadingMore hasMore={hasMore} loadMore={fetchMoreList} className="load-more" />
        </>
      )}
    </div>
  );
}
