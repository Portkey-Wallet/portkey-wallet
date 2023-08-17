import CustomSvg from 'components/CustomSvg';
import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useBookmarkList } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { isSafeOrigin } from 'pages/WalletSecurity/utils';
import ImageDisplay from 'pages/components/ImageDisplay';
import MenuList from 'pages/components/MenuList';
import './index.less';

export interface ICustomTokenListProps {
  onClick: (v: any) => void;
  onClose?: () => void;
}

export default function BookmarkList({ onClick, onClose }: ICustomTokenListProps) {
  // const { t } = useTranslation();
  // const bookmarkList = useBookmarkList();

  const mockData = useMemo(
    () => [
      {
        id: 'baidu',
        url: 'http://www.baidu.com',
        name: 'baidu',
      },
      {
        id: 'baidu1',
        url: 'http://www.baidu.com',
        name: 'baidu1',
      },
    ],
    [],
  );

  const showBookmarkList = useMemo(
    () =>
      (mockData ?? []).map((discover) => ({
        key: discover.id,
        element: (
          <div className="content flex">
            <ImageDisplay defaultHeight={32} className="icon" src={discover.url} backupSrc="DappDefault" />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{discover.name}</span>
                <CustomSvg type={isSafeOrigin(discover.url) ? 'DappLock' : 'DappWarn'} />
              </div>
              <div className="text origin">{discover.url}</div>
            </div>
          </div>
        ),
        click: () => onClick(discover),
      })),
    [mockData, onClick],
  );

  return (
    <div className="bookmark-list">
      <div className="header flex-center">
        <p>{`Bookmarks`}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <div className="list">
        {mockData.length === 0 ? (
          <div className="empty-content flex-center">
            <p className="empty-text">No Bookmarks</p>
          </div>
        ) : (
          <MenuList list={showBookmarkList} showEnterIcon={false} />
        )}
      </div>
    </div>
  );
}
