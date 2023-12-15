import { message } from 'antd';

const success = (content: string, duration?: number) => {
  message.destroy(content);
  message.success({ content, key: content, duration });
};

const singleMessage = {
  success,
};

export default singleMessage;
