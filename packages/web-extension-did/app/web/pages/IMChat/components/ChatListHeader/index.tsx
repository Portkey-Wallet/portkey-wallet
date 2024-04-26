import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.less';

export interface IChatListHeaderProps {
  className?: string;
  title: string;
  rightElement?: ReactNode;
}

export default function ChatListHeader({ className, title, rightElement }: IChatListHeaderProps) {
  return (
    <div className={clsx('chat-list-header', 'flex-between-center', className)}>
      <div className="header-left">{title}</div>
      <div className="header-right">{rightElement || ''}</div>
    </div>
  );
}
