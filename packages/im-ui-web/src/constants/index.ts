import { MessageType, MessageTypeEnum } from '@portkey-wallet/im';

export const RedPacketTextByMine = `[You sent a Crypto Box]`;

export const RedPacketTextByOthers = `[You received a Crypto Box, please check on Portkey App]`;

export const SupportSysMsgType: MessageType[] = [MessageTypeEnum.PIN_SYS, MessageTypeEnum.SYS];
