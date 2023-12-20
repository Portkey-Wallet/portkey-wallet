import { useGroupChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { MessageList, MessageType, StyleProvider } from '@portkey-wallet/im-ui-web';
import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import { formatMessageList } from '../utils';
import './index.less';

const PinnedMsg = () => {
  const { channelUuid } = useParams();
  const { list, hasNext, next, loading } = useGroupChannel(`${channelUuid}`);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const messageRef = useRef<any>(null);
  const { relationId } = useRelationId();
  const messageList: MessageType[] = useMemo(() => formatMessageList(list, relationId!, true), [list, relationId]);
  const handleUnpinMsg = useCallback(() => {
    CustomModalConfirm({
      content: t('Are you sure to leave this group?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          // await leaveGroup(`${channelUuid}`);
          navigate('/chat-list');
        } catch (e) {
          message.error('Failed to leave the group');
          console.log('===Failed to leave the group error', e);
        }
      },
    });
  }, [navigate, t]);
  const handlePinMsg = useCallback(() => {
    //
  }, []);
  return (
    <div className="group-pinned-message-page flex-column-between">
      <div className="pinned-message-header">
        <SettingHeader title="5 Pinned Messages" leftCallBack={() => navigate(`/chat-box-group/${channelUuid}`)} />
      </div>
      <div className="pinned-message-container flex">
        <div className="pinned-message-footer flex-center">
          <span className="content" onClick={handleUnpinMsg}>
            Unpin All 5 Messages
          </span>
        </div>
        <div className="pinned-message-content">
          <StyleProvider prefixCls="portkey">
            <MessageList
              loading={loading}
              reference={messageRef}
              hasNext={hasNext}
              next={next}
              lockable
              dataSource={messageList}
              onPinMsg={handlePinMsg}
            />
          </StyleProvider>
        </div>
      </div>
    </div>
  );
};
export default PinnedMsg;
