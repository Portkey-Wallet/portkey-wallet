import { useCallback } from 'react';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { ChainId } from '@portkey-wallet/types';
import { ParsedTransfer, TransferTypeEnum } from '@portkey-wallet/im/types';
import im, { Message, MessageTypeEnum } from '@portkey-wallet/im';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { useRelationId } from '.';
import { TransferStatusEnum } from '@portkey-wallet/im/types';
import { messageParser } from '@portkey-wallet/im/utils';
import { useCurrentUserInfo, useCurrentWalletInfo } from '../wallet';
import { useAppCommonDispatch } from '../../index';
import { addChannelMessage, updateChannelAttribute } from '@portkey-wallet/store/store-ca/im/actions';
import { useCurrentNetworkInfo } from '../network';
import { generateTransferRawTransaction } from '@portkey-wallet/utils/transfer';
import { getSendUuid } from '@portkey-wallet/utils/chat';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

export interface ISendIMTransferParams {
  toUserId?: string;
  channelId: string;
  chainId: ChainId;
  tokenContractAddress: string;
  toCAAddress: string;
  symbol: string;
  amount: string;
  type: TransferTypeEnum;
  memo: string;
  caContract: ContractBasic;
  image?: string;
  guardiansApproved?: GuardiansApprovedType[];
}

export const useSendIMTransfer = () => {
  const { relationId, getRelationId } = useRelationId();
  const { networkType } = useCurrentNetworkInfo();
  const userInfo = useCurrentUserInfo();
  const wallet = useCurrentWalletInfo();
  const dispatch = useAppCommonDispatch();

  return useCallback(
    async (params: ISendIMTransferParams) => {
      const {
        channelId,
        chainId,
        symbol,
        amount,
        image = '',
        memo,
        type,
        caContract,
        tokenContractAddress,
        toCAAddress,
        toUserId,
        guardiansApproved,
      } = params;
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

      const rawTransaction = await generateTransferRawTransaction({
        caContract,
        contractAddress: tokenContractAddress,
        caHash,
        symbol,
        amount,
        to: toCAAddress,
        guardiansApproved,
      });

      const transferContent: ParsedTransfer = {
        image,
        link: '',
        data: {
          id: '',
          senderId: userInfo?.userId,
          senderName: userInfo?.nickName,
          memo,
          transactionId: '',
          blockHash: '',
          toUserId: toUserId || '',
          toUserName: '',
        },
      };

      const message = {
        channelUuid: channelId,
        type: MessageTypeEnum.TRANSFER_CARD,
        content: JSON.stringify(transferContent),
        sendUuid: getSendUuid(_relationId, channelId),
      };

      const {
        data: { transferId },
      } = await im.service.sendTransfer({
        type,
        toUserId,
        chainId,
        channelUuid: channelId,
        rawTransaction,
        message: JSON.stringify(message),
      });

      const { data: statusResult } = await handleLoopFetch({
        fetch: () => {
          return im.service.getTransferStatus({
            transferId,
          });
        },
        times: 10,
        interval: 5000,
        checkIsContinue: _statusResult => {
          return _statusResult?.data?.status === TransferStatusEnum.PENDING;
        },
      });

      if (statusResult?.status !== TransferStatusEnum.SUCCESS) {
        throw new Error('Creation FAIL');
      }

      transferContent.data.id = transferId;
      transferContent.data.transactionId = statusResult.transactionId;
      transferContent.data.blockHash = statusResult.blockHash;
      message.content = JSON.stringify(transferContent);
      const msgObj: Message = messageParser({
        ...message,
        from: _relationId,
        fromAvatar: userInfo.avatar,
        fromName: userInfo.nickName,
        createAt: `${Date.now()}`,
        id: '', // TODO: from creationStatus
      });

      dispatch(
        addChannelMessage({
          network: networkType,
          channelId: channelId || '',
          message: msgObj,
        }),
      );
      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId || '',
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
