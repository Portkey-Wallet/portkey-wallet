import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useChannel, useHideChannel, useIMGroupInfoMapNetMapState, useRelationId } from '.';
import im, {
  ChannelInfo,
  ChannelMemberInfo,
  ChannelStatusEnum,
  ChannelTypeEnum,
  SocketMessage,
} from '@portkey-wallet/im';
import { useAppCommonDispatch } from '../../index';
import {
  addChannelMembers,
  removeChannelMembers,
  setGroupInfo,
  transferChannelOwner,
  updateChannelAttribute,
  updateGroupInfo,
  updateGroupMemberAmount,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useCurrentNetworkInfo } from '../network';
import { sleep } from '@portkey-wallet/utils';
import { UpdateGroupMemberAmountTypeEnum } from '@portkey-wallet/store/store-ca/im/type';

export const useDisbandChannel = (channelId: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const hideChannel = useHideChannel();

  const disbandChannel = useCallback(async () => {
    await im.service.disbandChannel({ channelUuid: channelId });
    dispatch(
      updateChannelAttribute({
        network: networkType,
        channelId,
        value: {
          status: ChannelStatusEnum.DISBAND,
        },
      }),
    );
    await sleep(100);

    await hideChannel(channelId);
  }, [channelId, dispatch, hideChannel, networkType]);

  return disbandChannel;
};

export const useTransferChannelOwner = (channelId: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  return useCallback(
    async (relationId: string) => {
      await im.service.transferChannelOwner({
        channelUuid: channelId,
        relationId,
      });

      dispatch(
        transferChannelOwner({
          network: networkType,
          channelId,
          relationId,
        }),
      );
    },
    [channelId, dispatch, networkType],
  );
};

export const useAddChannelMembers = (channelId: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  return useCallback(
    async (memberInfos: ChannelMemberInfo[]) => {
      await im.service.addChannelMembers({
        channelUuid: channelId,
        members: memberInfos.map(item => item.relationId),
      });

      dispatch(
        addChannelMembers({
          network: networkType,
          channelId,
          memberInfos,
        }),
      );
    },
    [channelId, dispatch, networkType],
  );
};

export const useRemoveChannelMembers = (channelId: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  return useCallback(
    async (members: string[]) => {
      await im.service.removeChannelMembers({
        channelUuid: channelId,
        members,
      });

      dispatch(
        removeChannelMembers({
          network: networkType,
          channelId,
          members,
        }),
      );
    },
    [channelId, dispatch, networkType],
  );
};

export const useLeaveChannel = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const hideChannel = useHideChannel();

  const leaveChannel = useCallback(
    async (channelId: string) => {
      await im.service.leaveChannel({
        channelUuid: channelId,
      });

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId,
          value: {
            status: ChannelStatusEnum.LEFT,
          },
        }),
      );

      await sleep(100);
      await hideChannel(channelId);
    },
    [dispatch, hideChannel, networkType],
  );

  return leaveChannel;
};

export const useUpdateChannelName = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  const updateChannelName = useCallback(
    async (channelId: string, name: string) => {
      await im.service.updateChannelName({
        channelUuid: channelId,
        channelName: name,
      });

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId,
          value: {
            displayName: name,
          },
        }),
      );

      dispatch(
        updateGroupInfo({
          network: networkType,
          channelId,
          value: {
            name,
          },
        }),
      );
    },
    [dispatch, networkType],
  );

  return updateChannelName;
};

export const useGroupChannelInfo = (channelId: string, isInit = false) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const groupInfoMapNetMap = useIMGroupInfoMapNetMapState();
  const groupInfo = useMemo<ChannelInfo | undefined>(
    () => groupInfoMapNetMap?.[networkType]?.[channelId],
    [channelId, groupInfoMapNetMap, networkType],
  );

  const relationId = useRelationId();

  const refresh = useCallback(async () => {
    const { data: groupInfo } = await im.service.getChannelInfo({
      channelUuid: channelId,
    });
    dispatch(
      setGroupInfo({
        network: networkType,
        groupInfo,
      }),
    );
  }, [channelId, dispatch, networkType]);

  const isAdmin = useMemo(() => {
    if (!groupInfo || !relationId) return false;
    if (groupInfo.type !== ChannelTypeEnum.GROUP) return false;
    const adminMember = groupInfo.members[0];
    return adminMember && adminMember.relationId === relationId;
  }, [groupInfo, relationId]);

  useEffect(() => {
    isInit && refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    groupInfo,
    isAdmin,
    refresh,
  };
};

export const useGroupChannel = (channelId: string) => {
  const channel = useChannel(channelId);
  const { groupInfo, isAdmin, refresh: refreshGroupInfo } = useGroupChannelInfo(channelId, true);
  const disband = useDisbandChannel(channelId);
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  const updateList = useCallback(
    (e: any) => {
      const rawMsg: SocketMessage = e['im-message'];
      if (rawMsg.type !== 'SYS') return;
      console.log('receive SYS msg');
      const content = rawMsg.content;
      if (content.endsWith('joined in')) {
        dispatch(
          updateGroupMemberAmount({
            network: networkType,
            channelId,
            type: UpdateGroupMemberAmountTypeEnum.ADD,
          }),
        );
        return;
      }
      if (content.endsWith('been removed') || content.endsWith('left the group')) {
        dispatch(
          updateGroupMemberAmount({
            network: networkType,
            channelId,
            type: UpdateGroupMemberAmountTypeEnum.REMOVE,
          }),
        );
        return;
      }
    },
    [channelId, dispatch, networkType],
  );
  const updateListRef = useRef(updateList);
  updateListRef.current = updateList;

  useEffect(() => {
    const { remove: removeMsgObserver } = im.registerChannelMsgObserver(channelId, e => {
      updateListRef.current(e);
    });
    return removeMsgObserver;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...channel,
    groupInfo,
    refreshGroupInfo,
    disband,
    isAdmin,
  };
};
