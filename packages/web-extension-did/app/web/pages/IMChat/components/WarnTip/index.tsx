import { message } from 'antd';
import './index.less';

export default function WarnTip() {
  return message.warning({
    className: 'chat-message-warning',
    content: (
      <div className="chat-message-warning-msg">
        {`Downloading the latest Portkey for you. To proceed, please close and restart the App.`}
      </div>
    ),
  });
}
