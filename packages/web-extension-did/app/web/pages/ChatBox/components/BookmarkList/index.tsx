import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { isSafeOrigin } from 'pages/WalletSecurity/utils';
import ImageDisplay from 'pages/components/ImageDisplay';
import MenuList from 'pages/components/MenuList';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import './index.less';

export interface IBookmarkListProps {
  onClick: (v: string) => void;
  onClose: () => void;
}

export default function BookmarkList({ onClick, onClose }: IBookmarkListProps) {
  const { refresh } = useBookmarkList();
  const [bookmarkList, setBookmarkList] = useState<IBookmarkItem[]>([]);
  const [more, setMore] = useState(false);

  const getData = useCallback(
    async (skip?: number) => {
      const { items, totalCount } = await refresh(skip);
      const newList: IBookmarkItem[] = [...bookmarkList, ...items];
      setBookmarkList(newList);
      if (newList.length < totalCount) {
        setMore(true);
      } else {
        setMore(false);
      }
    },
    [bookmarkList, refresh],
  );

  const getMoreData = useCallback(async () => {
    getData(bookmarkList.length);
  }, [bookmarkList.length, getData]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showBookmarkList = useMemo(
    () =>
      (bookmarkList ?? []).map((item) => ({
        key: item?.id,
        element: (
          <div className="content flex">
            <ImageDisplay defaultHeight={32} className="icon" src={item?.url} backupSrc="DappDefault" />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{item?.name}</span>
                <CustomSvg type={isSafeOrigin(item?.url) ? 'DappLock' : 'DappWarn'} />
              </div>
              <div className="text origin">{item?.url}</div>
            </div>
          </div>
        ),
        click: () => onClick(item?.url),
      })),
    [bookmarkList, onClick],
  );

  return (
    <div className="bookmark-list">
      <div className="header flex-center">
        <p>{`Bookmarks`}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="list">
        {showBookmarkList.length === 0 ? (
          <div className="empty-content flex-center">
            <p className="empty-text">No Bookmarks</p>
          </div>
        ) : (
          <MenuList list={showBookmarkList} showEnterIcon={false} />
        )}
        <LoadingMore hasMore={more} loadMore={getMoreData} className="load-more" noDataText=" " />
      </div>
    </div>
  );
}
