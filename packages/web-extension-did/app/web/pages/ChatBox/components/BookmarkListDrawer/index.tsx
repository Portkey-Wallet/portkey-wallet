import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import BookmarkList from '../BookmarkList';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  open: boolean;
  onClose: () => void;
  onClick: (url: string) => void;
}

export default function BookmarkListDrawer({ open, onClose, onClick, ...props }: CustomSelectProps) {
  const handleClick = (v: string) => {
    onClick(v);
    onClose();
  };
  return (
    <BaseDrawer
      {...props}
      open={open}
      height={528}
      placement="bottom"
      destroyOnClose
      onClose={onClose}
      className="bookmark-list-drawer">
      <BookmarkList onClick={handleClick} onClose={onClose} />
    </BaseDrawer>
  );
}
