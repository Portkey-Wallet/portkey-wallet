import clsx from 'clsx';
import { ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router';
import PortKeyHeader from '../PortKeyHeader';
import { useIsImputation } from '@portkey-wallet/hooks/hooks-ca/contact';

export default function PromptFrame({ content, className }: { content: ReactNode; className?: string }) {
  const navigate = useNavigate();
  const isImputation = useIsImputation();

  const onUserClick = useCallback(() => {
    navigate(`/setting`);
  }, [navigate]);

  return (
    <div className={clsx(['portkey-prompt', className])}>
      <PortKeyHeader unReadShow={isImputation} onUserClick={onUserClick} />
      {content}
    </div>
  );
}
