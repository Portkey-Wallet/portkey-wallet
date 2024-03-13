import { message } from 'antd';
import './index.less';

export default function WarnTip() {
  const tipMsg = `Downloading the latest Portkey for you. To proceed, please close and restart the App.`;
  return message.warning({
    className: 'chat-message-warning',
    key: tipMsg,
    content: <div className="chat-message-warning-msg">{tipMsg}</div>,
  });
}
