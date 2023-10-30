import { UnreadTip } from '@portkey-wallet/im-ui-web';
import { useNavigate } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface IChatEntry {
  unread?: number;
}

export default function ChatEntry(props: IChatEntry) {
  const { unread = 0 } = props;
  const navigate = useNavigate();
  return (
    <div className="chat-entry" onClick={() => navigate('/chat-list')}>
      <div className="flex-center chat-entry-container">
        <CustomSvg type="ChatEntry" />
      </div>
      {unread > 0 && (
        <div className="chat-entry-unread">
          <UnreadTip unread={unread} />
        </div>
      )}
    </div>
  );
}
