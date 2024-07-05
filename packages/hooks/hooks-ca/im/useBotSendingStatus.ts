import { useCallback, useMemo, useState, useEffect } from 'react';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../..';
import { addBotSending, removeBotSending } from '@portkey-wallet/store/store-ca/im/actions';
import { useImSendingBotNetMapState } from '.';

export const useBotSendingStatus = (targetRelationId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const sendingBotNetMap = useImSendingBotNetMapState();
  const [canSend, setCanSend] = useState<boolean>(true);
  const sendingBotMap = useMemo(() => sendingBotNetMap?.[networkType] || [], [sendingBotNetMap, networkType]);

  useEffect(() => {
    setCanSend(sendingBotMap.indexOf(targetRelationId) === -1);
  }, [sendingBotMap, targetRelationId]);
  const changeToSendingStatus = useCallback(() => {
    if (!targetRelationId) {
      return;
    }
    dispatch(
      addBotSending({
        network: networkType,
        targetRelationId,
      }),
    );
  }, [dispatch, networkType, targetRelationId]);
  const changeToRepliedStatus = useCallback(() => {
    if (!targetRelationId) {
      return;
    }
    dispatch(
      removeBotSending({
        network: networkType,
        targetRelationId,
      }),
    );
  }, [dispatch, networkType, targetRelationId]);
  return {
    canSend,
    changeToSendingStatus,
    changeToRepliedStatus,
  };
};
export default useBotSendingStatus;
