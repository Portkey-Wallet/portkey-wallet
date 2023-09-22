import { message } from 'antd';
import './index.less';

export default function WarnTip() {
  return message.warning({
    className: 'chat-message-warning',
    content: (
      <div className="chat-message-warning-msg">
        Please try updating to the latest version.You can try to terminate the APP process and then re-enter it.
      </div>
    ),
  });
}
