import { useCallback, useMemo, useRef, useState } from 'react';
import im, {
  Message,
  MessageTypeEnum,
  ParsedRedPackage,
  RedPackageDetail,
  RedPackageGrabInfoItem,
  RedPackageStatusEnum,
  RedPackageTypeEnum,
} from '@portkey-wallet/im';
import { ChainId } from '@portkey-wallet/types';
import { handleLoopFetch, randomId } from '@portkey-wallet/utils';
import { useRedPackageTokenConfigListMapState, useRelationId } from '.';
import { RedPackageCreationStatusEnum } from '@portkey-wallet/im/types/service';
import { messageParser } from '@portkey-wallet/im/utils';
import { useCurrentWalletInfo, useWallet } from '../wallet';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  addChannelMessage,
  setRedPackageTokenConfigList,
  updateChannelAttribute,
  updateChannelMessageRedPackageAttribute,
  updateChannelRedPackageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useCurrentNetworkInfo } from '../network';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { generateRedPackageRawTransaction } from '@portkey-wallet/utils/chat';

export interface ICreateRedPacketParams {
  id: string;
  symbol: string;
  totalAmount: string;
  minAmount: string;
  expireTime: string;
  totalCount: number;
  type: RedPackageTypeEnum;
  publicKey: string;
  signature: string;
}
export interface ISendRedPackageHookParams {
  channelId: string;
  chainId: ChainId;
  symbol: string;
  totalAmount: string;
  decimal: string | number;
  type: RedPackageTypeEnum;
  count: number;
  memo: string;
  caContract: ContractBasic;
  image?: string;
}
export const useSendRedPackage = () => {
  const { relationId, getRelationId } = useRelationId();
  const { networkType } = useCurrentNetworkInfo();
  const { userInfo } = useWallet();
  const wallet = useCurrentWalletInfo();
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (params: ISendRedPackageHookParams) => {
      const { channelId, chainId, symbol, totalAmount, image = '', memo, type, count, caContract } = params;

      const caHash = wallet.caHash;
      const caAddress = wallet[chainId]?.caAddress;
      if (!userInfo || !caHash || !caAddress) {
        throw new Error('No user info');
      }
      let _relationId = relationId;
      if (!_relationId) {
        try {
          _relationId = await getRelationId();
        } catch (error) {
          throw new Error('No user info');
        }
      }

      await im.refreshToken();
      const redPackageInfo = await im.service.createRedPackage({
        chainId,
        symbol,
      });
      const { id, publicKey, signature, minAmount, redPackageContractAddress, expireTime } = redPackageInfo.data;

      const rawTransaction = await generateRedPackageRawTransaction({
        caContract,
        caHash,
        caAddress,
        contractAddress: redPackageContractAddress,
        id,
        symbol,
        totalAmount,
        minAmount,
        expirationTime: Date.now() + expireTime,
        totalCount: count,
        type,
        publicKey,
        signature,
      });

      const redPackageContent: ParsedRedPackage = {
        image,
        link: '',
        data: {
          id,
          senderId: userInfo.userId,
          memo,
        },
      };
      const uuid = randomId();
      const message = {
        channelUuid: channelId,
        type: MessageTypeEnum.REDPACKAGE_CARD,
        content: JSON.stringify(redPackageContent),
        sendUuid: `${_relationId}-${channelId}-${Date.now()}-${uuid}`,
      };

      const {
        data: { sessionId },
      } = await im.service.sendRedPackage({
        id,
        totalAmount,
        type,
        count,
        chainId,
        symbol,
        memo,
        channelUuid: channelId,
        rawTransaction,
        message: JSON.stringify(message),
      });

      const { data: creationStatus } = await handleLoopFetch({
        fetch: () => {
          return im.service.getRedPackageCreationStatus({
            sessionId,
          });
        },
        times: 40,
        interval: 2000,
        checkIsContinue: _creationStatusResult => {
          return _creationStatusResult?.data?.status === RedPackageCreationStatusEnum.PENDING;
        },
      });
      if (creationStatus.status !== RedPackageCreationStatusEnum.SUCCESS) {
        // TODO: toast error creation FAIL
        throw new Error('Creation FAIL');
      }

      const msgObj: Message = messageParser({
        ...message,
        from: _relationId,
        fromAvatar: '', // TODO: from walletAvatar
        fromName: userInfo.nickName,
        createAt: `${Date.now()}`,
        id: '', // TODO: from creationStatus
        redPackage: {
          viewStatus: RedPackageStatusEnum.UNOPENED,
        },
      });

      dispatch(
        addChannelMessage({
          network: networkType,
          channelId,
          message: msgObj,
        }),
      );
      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            lastMessageType: msgObj.type,
            lastMessageContent: msgObj.parsedContent,
            lastPostAt: msgObj.createAt,
          },
        }),
      );
    },
    [dispatch, getRelationId, networkType, relationId, userInfo, wallet],
  );
};

export const useGetRedPackageDetail = (id?: string) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const [info, setInfo] = useState<RedPackageDetail>();
  const infoRef = useRef(info);
  infoRef.current = info;
  const [list, setList] = useState<RedPackageGrabInfoItem[]>([]);
  const pagerRef = useRef({
    skipCount: 0,
    maxResultCount: 20,
    totalCount: 0,
  });

  // TODO: change to useLockCallback
  const next = useCallback(
    async ({
      id: _id,
      skipCount: _skipCount,
      maxResultCount: _maxResultCount,
    }: {
      id?: string;
      skipCount?: number;
      maxResultCount?: number;
    }) => {
      const { skipCount, maxResultCount } = pagerRef.current;

      const params = {
        id: _id ?? id ?? '',
        skipCount: _skipCount ?? skipCount ?? 0,
        maxResultCount: _maxResultCount ?? maxResultCount ?? 20,
      };

      const {
        data: { items, ...detail },
      } = await im.service.getRedPackageDetail(params);

      setInfo(detail);

      if (skipCount === 0) {
        setList(items);
        pagerRef.current = {
          skipCount: items.length,
          maxResultCount: params.maxResultCount,
          totalCount: detail.totalCount,
        };
      } else {
        setList(pre => [...pre, ...items]);
        pagerRef.current = {
          skipCount: params.skipCount + items.length,
          maxResultCount: params.maxResultCount,
          totalCount: detail.totalCount,
        };
      }
      return {
        info: detail,
        list: items,
      };
    },
    [id],
  );
  const init = useCallback(
    async (params: { id: string }) => {
      return await next(params);
    },
    [next],
  );

  const initInfo = useCallback(
    async (channelId: string, id: string) => {
      const { info } = await next({
        id,
        skipCount: 0,
        maxResultCount: 0,
      });
      dispatch(
        updateChannelMessageRedPackageAttribute({
          network: networkType,
          channelId,
          id,
          value: {
            viewStatus: info.viewStatus,
          },
        }),
      );
      dispatch(
        updateChannelRedPackageAttribute({
          network: networkType,
          channelId,
          id,
          value: {
            viewStatus: info.viewStatus,
          },
        }),
      );

      return info;
    },
    [dispatch, networkType, next],
  );

  return {
    info,
    list,
    next,
    init,
    initInfo,
  };
};

export const useGrabRedPackage = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  return useCallback(
    async (channelId: string, id: string) => {
      const { data } = await im.service.grabRedPackage({
        channelUuid: channelId,
        id,
      });

      const { viewStatus } = data;
      dispatch(
        updateChannelMessageRedPackageAttribute({
          network: networkType,
          channelId,
          id,
          value: {
            viewStatus,
          },
        }),
      );
      dispatch(
        updateChannelRedPackageAttribute({
          network: networkType,
          channelId,
          id,
          value: {
            viewStatus,
          },
        }),
      );
      return data;
    },

    [dispatch, networkType],
  );
};

export const useGetRedPackageTokenConfig = (isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const networkTypeRef = useRef(networkType);
  networkTypeRef.current = networkType;
  const redPackageTokenConfigListMap = useRedPackageTokenConfigListMapState();
  const redPackageTokenConfigList = useMemo(
    () => redPackageTokenConfigListMap?.[networkType] || [],
    [networkType, redPackageTokenConfigListMap],
  );

  const refresh = useCallback(async () => {
    try {
      const _networkType = networkTypeRef.current;
      const result = await handleLoopFetch({
        fetch: () => im.service.getRedPackageConfig({}),
        times: isInit ? 3 : 1,
        checkIsInvalid: () => {
          return _networkType !== networkTypeRef.current;
        },
      });
      const tokenInfo = result?.data?.tokenInfo || [];
      dispatch(
        setRedPackageTokenConfigList({
          network: networkType,
          value: tokenInfo,
        }),
      );
    } catch (error) {
      console.log('useGetRedPackageTokenConfig refresh', error);
    }
  }, [dispatch, isInit, networkType]);

  useEffectOnce(() => {
    refresh();
  });

  return useCallback(
    (chainId: ChainId, symbol: string) => {
      return redPackageTokenConfigList.find(item => item.chainId === chainId && item.symbol === symbol);
    },
    [redPackageTokenConfigList],
  );
};

export const useIsMyRedPacket = (senderId: string): boolean => {
  const { userInfo } = useWallet();

  return userInfo?.userId === senderId;
};

export const useGetCurrentRedPacketId = (currentMessage?: Message): string => {
  return (currentMessage?.parsedContent as ParsedRedPackage)?.data?.id || '';
};

export const useGetCurrentRedPacketParsedData = (
  currentMessage?: Message,
): { id: string; senderId: string; memo: string } => {
  return (currentMessage?.parsedContent as ParsedRedPackage)?.data;
};
