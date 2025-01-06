import CommonHeader from 'components/CommonHeader';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { ITokenAllowanceProps } from '..';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import CircleLoading from '../../../../components/CircleLoading';

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
      {fetching && (
        <div className="no-data flex-center">
          <CircleLoading width={32} />
        </div>
      )}
      {!fetching && list.length === 0 ? (
        <div className="no-data flex-center">No assets yet</div>
      ) : (
        <div className="token-allowance-list-container">
          <MenuList list={list} height={74} />
          <LoadingMore hasMore={hasMore} loadMore={fetchMoreList} className="load-more" />
        </div>
      )}
    </div>
  );
}
