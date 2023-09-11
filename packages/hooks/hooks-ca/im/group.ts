import { useCallback, useEffect, useMemo } from 'react';
import { useChannel, useIMGroupInfoMapNetMapState, useRelationId } from '.';
import im, { ChannelInfo, ChannelMemberInfo, ChannelStatusEnum, ChannelTypeEnum } from '@portkey-wallet/im';
import { useAppCommonDispatch } from '../../index';
import {
  addChannelMembers,
  removeChannelMembers,
  setGroupInfo,
  transferChannelOwner,
  updateChannelAttribute,
  updateGroupInfo,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useCurrentNetworkInfo } from '../network';

export const useDisbandChannel = (channelId: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

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

    im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(() => {
      im.refreshMessageCount();
    });
  }, [channelId, dispatch, networkType]);

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

      im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(() => {
        im.refreshMessageCount();
      });
    },
    [dispatch, networkType],
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

export const useGroupChannelInfo = (channelId: string, isInit = true) => {
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
  const { groupInfo, isAdmin, refresh: refreshGroupInfo } = useGroupChannelInfo(channelId, false);
  const disband = useDisbandChannel(channelId);

  useEffect(() => {
    refreshGroupInfo();
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
