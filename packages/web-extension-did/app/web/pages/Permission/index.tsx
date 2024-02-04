import { useEffect } from 'react';
import usePromptSearch from 'hooks/usePromptSearch';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback } from 'react';
import errorHandler from 'utils/errorHandler';
import { reportUserCurrentNetwork } from 'utils/analysisReport';
import { useCurrentNetwork } from '@portkey-wallet/hooks/network';

export default function Permission() {
  const detail = usePromptSearch<{ type: string }>();
  const { networkType } = useCurrentNetwork();
  const onUnLockHandler = useCallback(async () => {
    InternalMessage.payload(InternalMessageTypes.CLOSE_PROMPT, {
      closeParams: { ...errorHandler(0), data: detail },
    }).send();
  }, [detail]);
  useEffect(() => {
    reportUserCurrentNetwork(networkType);
  }, [networkType]);
  return <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />;
}
