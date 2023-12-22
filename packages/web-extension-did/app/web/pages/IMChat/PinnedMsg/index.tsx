import { useGroupChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { MessageList, MessageContentType, StyleProvider, MessageShowPageEnum } from '@portkey-wallet/im-ui-web';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import { formatMessageList } from '../utils';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import './index.less';

const PinnedMsg = () => {
  const { channelUuid } = useParams();
  const {
    list: pinList,
    initList: initPinList,
    unPin: unPinMsg,
    unPinAll: unPinAllMsg,
  } = useIMPin(`${channelUuid}`, true);
  const { isAdmin } = useGroupChannel(`${channelUuid}`);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const messageRef = useRef<any>(null);
  const { relationId } = useRelationId();
  const messageList: MessageContentType[] = useMemo(
    () =>
      formatMessageList({
        list: pinList,
        ownerRelationId: relationId!,
        isGroup: true,
        isAdmin,
        showPageType: MessageShowPageEnum['PIN-PAGE'],
      }),
    [isAdmin, pinList, relationId],
  );
  useEffect(() => {
    initPinList();
  }, [initPinList]);
  const handleUnpinAllMsg = useCallback(() => {
    CustomModalConfirm({
      content: `Do you want to unpin all ${pinList?.length} messages in this chat?`,
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await unPinAllMsg();
          navigate(`/chat-box-group/${channelUuid}`);
        } catch (e) {
          message.error('Failed to unpin all message');
          console.log('===Failed to unpin all message error', e);
        }
      },
    });
  }, [channelUuid, navigate, pinList?.length, t, unPinAllMsg]);
  const handleUnpinMsg = useCallback(
    async (item: MessageContentType) => {
      const _msg = pinList.find((temp) => temp.id === item.id);
      if (!_msg) {
        message.error('cannot find message');
        return;
      }
      await unPinMsg(_msg);
      if (pinList.length === 1) navigate(`/chat-box-group/${channelUuid}`);
    },
    [channelUuid, navigate, pinList, unPinMsg],
  );
  return (
    <div className="group-pinned-message-page flex-column-between">
      <div className="pinned-message-header">
        <SettingHeader
          title={`${pinList.length} Pinned Messages`}
          leftCallBack={() => navigate(`/chat-box-group/${channelUuid}`)}
        />
      </div>
      <div className="pinned-message-container flex">
        <div className="pinned-message-footer flex-center">
          <span className="content" onClick={handleUnpinAllMsg}>
            {`Unpin All ${pinList?.length} Messages`}
          </span>
        </div>
        <div className="pinned-message-content">
          <StyleProvider prefixCls="portkey">
            <MessageList
              loading={false}
              reference={messageRef}
              hasNext={false}
              lockable
              dataSource={messageList}
              onPinMsg={handleUnpinMsg}
            />
          </StyleProvider>
        </div>
      </div>
    </div>
  );
};
export default PinnedMsg;
