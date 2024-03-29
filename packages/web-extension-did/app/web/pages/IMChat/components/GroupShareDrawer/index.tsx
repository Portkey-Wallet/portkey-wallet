import { DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import ContactChatList from '../ContactChatList';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import './index.less';

interface CustomSelectProps extends DrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (v: ChannelMemberInfo[]) => void;
}

export default function ContactListDrawer({ open, onClose, onConfirm, ...props }: CustomSelectProps) {
  return (
    <BaseDrawer
      {...props}
      open={open}
      height={528}
      placement="bottom"
      destroyOnClose
      onClose={onClose}
      className="contact-list-drawer">
      <ContactChatList onConfirm={onConfirm} onClose={onClose} />
    </BaseDrawer>
  );
}
