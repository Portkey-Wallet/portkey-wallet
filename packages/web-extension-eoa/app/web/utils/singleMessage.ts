import { message } from 'antd';

export enum MessageTipTypeEnum {
  warning = 'warning',
  error = 'error',
  info = 'info',
  success = 'success',
}

type TSingleMessage = {
  content: string;
  key: string;
  duration?: number;
};

const messageTip = (content: TSingleMessage, type: MessageTipTypeEnum) => {
  message[type](content);
};

const success = (content: string, duration?: number) => {
  messageTip({ content, key: content, duration }, MessageTipTypeEnum.success);
};

const error = (content: string, duration?: number) => {
  messageTip({ content, key: content, duration }, MessageTipTypeEnum.error);
};

const info = (content: string, duration?: number) => {
  messageTip({ content, key: content, duration }, MessageTipTypeEnum.info);
};

const warning = (content: string, duration?: number) => {
  messageTip({ content, key: content, duration }, MessageTipTypeEnum.warning);
};

const singleMessage = {
  success,
  error,
  info,
  warning,
};

export default singleMessage;
