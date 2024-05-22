import { useCallback, useMemo } from 'react';
import { useImBlockedMapState } from '.';
import im, { TReportMessageParams } from '@portkey-wallet/im';
import { useCaAddressInfoList, useCurrentUserInfo } from '../wallet';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../..';
import { changeBlockedMap, setBlockedUserList } from '@portkey-wallet/store/store-ca/im/actions';
import useLockCallback from '../../useLockCallback';

export const useBlockAndReport = (targetRelationId?: string) => {
  const { userId } = useCurrentUserInfo();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const blockedMap = useImBlockedMapState();
  const userCaAddressInfos = useCaAddressInfoList();

  const blockMap = useMemo(() => blockedMap?.[networkType] || {}, [blockedMap, networkType]);

  const isBlocked = useMemo(() => {
    return !!blockMap?.[targetRelationId || ''];
  }, [blockMap, targetRelationId]);

  const changeTargetNetworkBlockMap = useLockCallback(
    (targetRelationId: string, block: boolean) => {
      return dispatch(
        changeBlockedMap({
          network: networkType,
          targetRelationId,
          isBlock: block,
        }),
      );
    },
    [dispatch, networkType],
  );

  const checkIsBlocked = useCallback(
    (relationId: string) => {
      console.log('checkIsBlocked', relationId, blockMap);
      return !!blockMap?.[relationId || ''];
    },
    [blockMap],
  );

  const fetchAndSetBlockList = useLockCallback(async () => {
    try {
      const { data } = await im.service.fetchBlockedList();
      dispatch(
        setBlockedUserList({
          network: networkType,
          blockedUserList: data,
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  }, [dispatch, networkType]);

  const block = useLockCallback(
    async (relationId?: string) => {
      if (!relationId && !targetRelationId) return;
      await im.service.blockUser({
        relationId: relationId || targetRelationId || '',
      });
      changeTargetNetworkBlockMap(relationId || '', true);

      try {
        await fetchAndSetBlockList();
      } catch (error) {
        console.log('fetchAndSetBlockList err', error);
      }
    },
    [changeTargetNetworkBlockMap, fetchAndSetBlockList, targetRelationId],
  );

  const unBlock = useLockCallback(
    async (relationId?: string) => {
      if (!relationId && !targetRelationId) return;

      await im.service.unBlockUser({
        relationId: relationId || targetRelationId || '',
      });
      changeTargetNetworkBlockMap(relationId || '', false);

      try {
        await fetchAndSetBlockList();
      } catch (error) {
        console.log('fetchAndSetBlockList err', error);
      }
    },
    [changeTargetNetworkBlockMap, fetchAndSetBlockList, targetRelationId],
  );

  const reportMessage = useLockCallback(
    (params: Omit<TReportMessageParams, 'userId' | 'userCaAddressInfos'>) => {
      return im.service.reportMessage({
        userId,
        userCaAddressInfos,
        ...params,
      });
    },
    [userCaAddressInfos, userId],
  );

  return {
    block,
    unBlock,
    fetchAndSetBlockList,
    isBlocked,
    checkIsBlocked,
    reportMessage,
  };
};

export default useBlockAndReport;
