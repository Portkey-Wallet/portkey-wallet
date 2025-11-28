import { useEffect } from 'react';
import usePromptSearch from 'hooks/usePromptSearch';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import { useCallback } from 'react';
import errorHandler from 'utils/errorHandler';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';

export default function Permission() {
  const detail = usePromptSearch<{ type: string }>();
  const currentNetwork = useCurrentNetwork();
  const onUnLockHandler = useCallback(async () => {
    await InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: { ...errorHandler(0), data: detail },
    }).send();
  }, [detail]);
  useEffect(() => {
    reportUserCurrentNetwork(currentNetwork);
  }, [currentNetwork]);
  return <LockPage onUnLockHandler={onUnLockHandler} />;
}
