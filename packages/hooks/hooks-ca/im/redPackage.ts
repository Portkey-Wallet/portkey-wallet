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
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { useRedPackageConfigMapState, useRelationId } from './index';
import { RedPackageCreationStatusEnum } from '@portkey-wallet/im/types';
import { messageParser } from '@portkey-wallet/im/utils';
import { useCurrentWalletInfo, useCurrentUserInfo } from '../wallet';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  addChannelMessage,
  setRedPackageConfig,
  updateChannelAttribute,
  updateChannelMessageRedPackageAttribute,
  updateChannelRedPackageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useCurrentNetworkInfo } from '../network';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { generateRedPackageRawTransaction, getSendUuid } from '@portkey-wallet/utils/chat';
import useLockCallback from '../../useLockCallback';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';

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
  totalAmount: string;
  type: RedPackageTypeEnum;
  count: number;
  memo: string;
  caContract: ContractBasic;
  image?: string;
  token: ICryptoBoxAssetItemType;
}

export const useSendRedPackage = () => {
  const { relationId, getRelationId } = useRelationId();
  const { networkType } = useCurrentNetworkInfo();
  const userInfo = useCurrentUserInfo();
  const wallet = useCurrentWalletInfo();
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (params: ISendRedPackageHookParams) => {
      const { channelId, totalAmount, image = '', memo, type, count, caContract, token } = params;
      const { chainId, symbol, assetType = AssetType.ft, alias, tokenId } = token;

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
      const { id, publicKey, minAmount, redPackageContractAddress, expireTime } = redPackageInfo.data;

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
      });

      const redPackageContent: ParsedRedPackage = {
        image,
        link: '',
        data: {
          id,
          senderId: userInfo.userId,
          memo,
          assetType,
          alias,
          tokenId,
        },
      };
      const message = {
        channelUuid: channelId,
        type: MessageTypeEnum.REDPACKAGE_CARD,
        content: JSON.stringify(redPackageContent),
        sendUuid: getSendUuid(_relationId, channelId),
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
        assetType,
      });

      const { data: creationStatus } = await handleLoopFetch({
        fetch: () => {
          return im.service.getRedPackageCreationStatus({
            sessionId,
          });
        },
        times: 10,
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
        fromAvatar: userInfo.avatar,
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

type NextRedPackageDetailParams = { id?: string; skipCount?: number; maxResultCount?: number };
export type NextRedPackageDetailResult = { info: RedPackageDetail; list: RedPackageGrabInfoItem[] };
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

  const next: (params?: NextRedPackageDetailParams) => Promise<NextRedPackageDetailResult> = useLockCallback(
    async (params?: NextRedPackageDetailParams) => {
      const { skipCount, maxResultCount, totalCount } = pagerRef.current;

      const fetchParams = {
        id: params?.id ?? id ?? '',
        skipCount: params?.skipCount ?? skipCount ?? 0,
        maxResultCount: params?.maxResultCount ?? maxResultCount ?? 20,
      };

      const _skipCount = fetchParams.skipCount;
      if (_skipCount !== 0 && _skipCount >= totalCount) {
        return {
          info: infoRef.current,
          list: [],
        };
      }

      const {
        data: { items, ...detail },
      } = await im.service.getRedPackageDetail(fetchParams);

      setInfo(detail);
      if (fetchParams.skipCount === 0) {
        setList(items);
        pagerRef.current = {
          skipCount: items.length,
          maxResultCount: fetchParams.maxResultCount,
          totalCount: detail.totalCount,
        };
      } else {
        setList(pre => [...pre, ...items]);
        pagerRef.current = {
          skipCount: fetchParams.skipCount + items.length,
          maxResultCount: fetchParams.maxResultCount,
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
    async (params?: { id: string }) => {
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

export const useGetRedPackageConfig = (isAutoFetch = false, isInit = false) => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const networkTypeRef = useRef(networkType);
  networkTypeRef.current = networkType;
  const redPackageConfigMap = useRedPackageConfigMapState();
  const redPackageConfig = useMemo(() => redPackageConfigMap?.[networkType], [networkType, redPackageConfigMap]);

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
      const redPackageContractAddress = result?.data?.redPackageContractAddress || [];
      const redPackageConfig = {
        tokenInfo,
        redPackageContractAddress,
      };
      dispatch(
        setRedPackageConfig({
          network: networkType,
          value: redPackageConfig,
        }),
      );
      return redPackageConfig;
    } catch (error) {
      console.log('useGetRedPackageConfig refresh', error);
      throw error;
    }
  }, [dispatch, isInit, networkType]);

  useEffectOnce(() => {
    isAutoFetch && refresh();
  });

  const getTokenInfo = useCallback(
    (chainId: ChainId, symbol: string) => {
      return redPackageConfig?.tokenInfo.find(item => item.chainId === chainId && item.symbol === symbol);
    },
    [redPackageConfig?.tokenInfo],
  );

  const getContractAddress = useCallback(
    (chainId: ChainId) => {
      return redPackageConfig?.redPackageContractAddress.find(item => item.chainId === chainId)?.contractAddress;
    },
    [redPackageConfig?.redPackageContractAddress],
  );

  return {
    refresh,
    getTokenInfo,
    getContractAddress,
  };
};

export const useIsMyRedPacket = (senderId: string): boolean => {
  const { userId } = useCurrentUserInfo();

  return userId === senderId;
};

export const useGetCurrentRedPacketId = (currentMessage?: Message): string => {
  return (currentMessage?.parsedContent as ParsedRedPackage)?.data?.id || '';
};

export const useGetCurrentRedPacketParsedData = (
  currentMessage?: Message,
): { id: string; senderId: string; memo: string } => {
  return (currentMessage?.parsedContent as ParsedRedPackage)?.data;
};
