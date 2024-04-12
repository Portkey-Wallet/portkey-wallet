import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/discover';
import { isSafeOrigin } from 'pages/WalletSecurity/utils';
import ImageDisplay from 'pages/components/ImageDisplay';
import MenuList from 'pages/components/MenuList';
import { IBookmarkItem } from '@portkey-wallet/store/store-ca/discover/type';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import CircleLoading from 'components/CircleLoading';
import { useGetCmsWebsiteInfo } from '@portkey-wallet/hooks/hooks-ca/cms';
import './index.less';

export interface IBookmarkListProps {
  onClick: (v: string) => void;
  onClose: () => void;
}

export default function BookmarkList({ onClick, onClose }: IBookmarkListProps) {
  const { refresh } = useBookmarkList();
  const [bookmarkList, setBookmarkList] = useState<IBookmarkItem[]>([]);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [more, setMore] = useState(false);
  const { getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName } = useGetCmsWebsiteInfo();

  const getData = useCallback(
    async (skip?: number) => {
      try {
        const { items, totalCount } = await refresh(skip);
        setIsFirstLoading(false);
        const newList: IBookmarkItem[] = [...bookmarkList, ...items];
        setBookmarkList(newList);
        if (newList.length < totalCount) {
          setMore(true);
        } else {
          setMore(false);
        }
      } catch (e) {
        console.log('===get Bookmarks error', e);
        setIsFirstLoading(false);
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
            <ImageDisplay
              defaultHeight={32}
              className="icon"
              src={getCmsWebsiteInfoImageUrl(item?.url) || getFaviconUrl(item?.url)}
              backupSrc="DappDefault"
            />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{getCmsWebsiteInfoName(item?.url) || item?.name}</span>
                <CustomSvg type={isSafeOrigin(item?.url) ? 'DappLock' : 'DappWarn'} />
              </div>
              <div className="text origin">{item?.url}</div>
            </div>
          </div>
        ),
        click: () => onClick(item?.url),
      })),
    [bookmarkList, getCmsWebsiteInfoImageUrl, getCmsWebsiteInfoName, onClick],
  );

  return (
    <div className="bookmark-list">
      <div className="header flex-center">
        <p>{`Bookmarks`}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="list">
        {isFirstLoading && <CircleLoading />}
        {showBookmarkList.length === 0 ? (
          <div className="empty-content flex-center">
            {isFirstLoading ? null : <p className="empty-text">No Bookmarks</p>}
          </div>
        ) : (
          <MenuList list={showBookmarkList} showEnterIcon={false} height={72} />
        )}
        <LoadingMore hasMore={more} loadMore={getMoreData} className="load-more" noDataText=" " />
      </div>
    </div>
  );
}
