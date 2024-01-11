import { MessageType, MessageTypeEnum } from '@portkey-wallet/im';

export const RedPacketSubtitle = `[Crypto Box]`;

export const RedPacketTextByMine = `[You sent a Crypto Box]`;

export const RedPacketTextByOthers = `[You received a Crypto Box, please check on Portkey App]`;

export const TransferSubtitle = `[Transfer]`;

export const TransferTextByMine = `[A transfer from you]`;

export const TransferTextToMe = `[A transfer to you. Please check it on Portkey App]`;

export const TransferTextToOther = `[A transfer between others]`;

export const SupportSysMsgType: MessageType[] = [MessageTypeEnum.PIN_SYS, MessageTypeEnum.SYS];
