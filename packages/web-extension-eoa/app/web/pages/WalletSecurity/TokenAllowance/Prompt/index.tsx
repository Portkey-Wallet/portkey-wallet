import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { ITokenAllowanceProps } from '..';
import './index.less';

export default function TokenAllowancePrompt({
  headerTitle,
  goBack,
  list,
  fetching,
  hasMore,
  fetchMoreList,
}: BaseHeaderProps & IMenuItemProps & ITokenAllowanceProps) {
  return (
    <div className="token-allowance-page-prompt token-allowance-page">
      <div className="token-allowance-body-prompt">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        {!fetching && list.length === 0 ? (
          <div className="no-data flex-center">No data</div>
        ) : (
          <MenuList list={list} height={92} />
        )}
        <LoadingMore hasMore={hasMore} loadMore={fetchMoreList} className="load-more" />
      </div>
      <Outlet />
    </div>
  );
}
