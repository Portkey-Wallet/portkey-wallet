import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import BookmarkList from '../BookmarkList';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  onClose?: () => void;
  onClick: () => void;
}

export default function BookmarkListDrawer({ onClose, onClick, ...props }: CustomSelectProps) {
  return (
    <BaseDrawer
      {...props}
      open={true}
      height={528}
      placement="bottom"
      destroyOnClose
      onClose={onClose}
      className="bookmark-list-drawer">
      <BookmarkList onClick={onClick} />
    </BaseDrawer>
  );
}
