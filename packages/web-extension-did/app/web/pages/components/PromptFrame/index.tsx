import clsx from 'clsx';
import { ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PortKeyHeader from '../PortKeyHeader';

export default function PromptFrame({ content, className }: { content: ReactNode; className?: string }) {
  const navigate = useNavigate();

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  return (
    <div className={clsx(['portkey-prompt', className])}>
      <PortKeyHeader onUserClick={onUserClick} />
      {content}
    </div>
  );
}
