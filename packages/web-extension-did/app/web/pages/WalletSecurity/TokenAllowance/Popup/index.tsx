import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';
import MenuList, { IMenuItemProps } from 'pages/components/MenuList';
import { ITokenAllowanceProps } from '..';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import './index.less';

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
      <div className="token-allowance-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
