import usePromptSearch from 'hooks/usePromptSearch';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback } from 'react';
import errorHandler from 'utils/errorHandler';

export default function Permission() {
  const detail = usePromptSearch<{ type: string }>();
  const onUnLockHandler = useCallback(async () => {
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: { ...errorHandler(0), data: detail },
    }).send();
  }, [detail]);
  return (
    <div>
      <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
