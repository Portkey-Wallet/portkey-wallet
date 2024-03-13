import { useDeleteMessage, useGroupChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import SettingHeader from 'pages/components/SettingHeader';
import { useParams } from 'react-router';
import { MessageList, MessageContentType, StyleProvider, MessageShowPageEnum } from '@portkey-wallet/im-ui-web';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import { formatMessageList } from '../utils';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import { Message } from '@portkey-wallet/im';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';

const PinnedMsg = () => {
  const { channelUuid } = useParams();
  const {
    list: pinList,
    initList: initPinList,
    refresh: refreshPinList,
    unPin: unPinMsg,
    unPinAll: unPinAllMsg,
  } = useIMPin(`${channelUuid}`, true);
  const deleteMsg = useDeleteMessage(channelUuid || '');
  const { isAdmin } = useGroupChannel(`${channelUuid}`);
  const navigate = useNavigateState();
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
  useEffectOnce(() => {
    initPinList();
  });
  useEffect(() => {
    if (pinList.length === 0) navigate(`/chat-box-group/${channelUuid}`);
  }, [channelUuid, navigate, pinList.length]);
  const handleUnpinAllMsg = useCallback(() => {
    CustomModalConfirm({
      content: (
        <div className="modal-unpin-content flex-column-center">
          <div className="unpin-content-title">Unpin All Messages</div>
          <div>{`Do you want to unpin all ${pinList?.length} messages in this chat?`}</div>
        </div>
      ),
      okText: t('Unpin'),
      onOk: async () => {
        try {
          unPinAllMsg();
        } catch (e) {
          singleMessage.error('Failed to unpin all message');
          console.log('===Failed to unpin all message error', e);
        }
      },
    });
  }, [pinList?.length, t, unPinAllMsg]);
  const handleUnpinMsg = useCallback(
    async (item: MessageContentType) => {
      const _msg = pinList.find((temp) => temp.id === item.id);
      if (!_msg) {
        singleMessage.error('cannot find message');
        return;
      }
      CustomModalConfirm({
        content: (
          <div className="modal-unpin-content flex-column-center">
            <div className="unpin-content-title">Unpin Message</div>
            <div>Do you like to unpin this message?</div>
          </div>
        ),
        okText: t('Unpin'),
        onOk: async () => {
          try {
            unPinMsg(_msg);
          } catch (e) {
            singleMessage.error('Failed to unpin all message');
            console.log('===Failed to unpin all message error', e);
          }
        },
      });
    },
    [pinList, t, unPinMsg],
  );
  const handleDeleteMsg = useCallback(
    async (item: MessageContentType) => {
      const msg = pinList.find((temp) => temp.id === item.id);
      try {
        await deleteMsg(msg as Message);
        refreshPinList();
      } catch (e) {
        singleMessage.error('Failed to delete message');
        console.log('===handle delete message error', e);
      }
    },
    [deleteMsg, pinList, refreshPinList],
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
        {isAdmin && (
          <div className="pinned-message-footer flex-center">
            <span className="content" onClick={handleUnpinAllMsg}>
              {`Unpin All ${pinList?.length} Messages`}
            </span>
          </div>
        )}
        <div className="pinned-message-content">
          <StyleProvider prefixCls="portkey">
            <MessageList
              loading={false}
              reference={messageRef}
              hasNext={false}
              lockable
              dataSource={messageList}
              onPinMsg={handleUnpinMsg}
              onDeleteMsg={handleDeleteMsg}
            />
          </StyleProvider>
        </div>
      </div>
    </div>
  );
};
export default PinnedMsg;
