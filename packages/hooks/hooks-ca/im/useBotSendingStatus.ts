import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../..';
import { addBotSending, removeBotSending } from '@portkey-wallet/store/store-ca/im/actions';
import { useImSendingBotNetMapState } from './index';

export const useBotSendingStatus = (targetRelationId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const sendingBotNetMap = useImSendingBotNetMapState();
  const [canSend, setCanSend] = useState<boolean>(true);
  const sendingBotMap = useMemo(() => sendingBotNetMap?.[networkType] || [], [sendingBotNetMap, networkType]);
  const timerRef = useRef<any>();
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
    timerRef.current = setTimeout(() => {
      dispatch(
        removeBotSending({
          network: networkType,
          targetRelationId,
        }),
      );
    }, 10000);
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, [dispatch, networkType, targetRelationId]);
  const changeToRepliedStatus = useCallback(() => {
    if (!targetRelationId) {
      return;
    }
    timerRef.current && clearTimeout(timerRef.current);
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
