import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { dateToDayjs } from './time';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
dayjs.extend(utc);

export const formatMessageCountToStr = (num: number): string | undefined => {
  if (!num || num < 0) return undefined;
  return num > 99 ? '99+' : String(num);
};

export const formatChatListTime = (date?: dayjs.ConfigType): string => {
  if (!date) return '';
  const chatTime = dateToDayjs(date);
  const now = dayjs();
  const today = now.startOf('date');
  const yesterday = today.subtract(1, 'day');
  const thisYear = now.startOf('year');

  if (chatTime.isAfter(today)) {
    return chatTime.format('HH:mm');
  } else if (chatTime.isAfter(yesterday)) {
    return 'yesterday';
  } else if (chatTime.isAfter(thisYear)) {
    return chatTime.format('MM-DD');
  } else {
    return chatTime.format('YYYY-MM-DD');
  }
};

export const formatMessageTime = (date?: dayjs.ConfigType): string => {
  if (!date) return '';
  const messageTime = dateToDayjs(date);
  const now = dayjs();
  if (messageTime.isSame(now, 'year')) {
    return messageTime.format('MM-DD');
  } else {
    return messageTime.format('YYYY-MM-DD');
  }
};

export interface IGenerateRedPackageRawTransaction {
  caContract: ContractBasic;
  caHash: string;
  caAddress: string;
  contractAddress: string;
  id: string;
  symbol: string;
  totalAmount: string;
  minAmount: string;
  expirationTime: string;
  totalCount: number;
  type: RedPackageTypeEnum;
  publicKey: string;
}
export const generateRedPackageRawTransaction = async (params: IGenerateRedPackageRawTransaction) => {
  const rawResult = await params.caContract.encodedTx('ManagerForwardCall', {
    caHash: params.caHash,
    contractAddress: params.contractAddress,
    methodName: 'CreateCryptoBox',
    args: {
      cryptoBoxId: params.id,
      cryptoBoxSymbol: params.symbol,
      totalAmount: params.totalAmount,
      minAmount: params.minAmount,
      expirationTime: params.expirationTime,
      totalCount: params.totalCount,
      cryptoBoxType: params.type,
      publicKey: params.publicKey,
      sender: params.caAddress,
    },
  });
  if (!rawResult || !rawResult.data) {
    throw new Error('Failed to get raw transaction.');
  }
  return rawResult.data;
};
