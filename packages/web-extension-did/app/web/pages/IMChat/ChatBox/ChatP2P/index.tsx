import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import { MessageList, InputBar, StyleProvider, MessageContentType, PopDataProps } from '@portkey-wallet/im-ui-web';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useChannel, useIsStranger, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import BookmarkListDrawer from 'pages/IMChat/components/BookmarkListDrawer';
import { formatMessageList } from 'pages/IMChat/utils';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'store/Provider/hooks';
import { useAddStrangerContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { MAX_INPUT_LENGTH } from '@portkey-wallet/constants/constants-ca/im';
import CustomUpload from 'pages/IMChat/components/CustomUpload';
import ChatBoxTip from 'pages/IMChat/components/ChatBoxTip';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useHandle } from '../useHandleMsg';
import ChatBoxHeader from '../components/ChatBoxHeader';
import { useClickUrl } from 'hooks/im';
import WarnTip from 'pages/IMChat/components/WarnTip';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { TViewContactLocationState } from 'types/router';

export default function ChatBox() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigateState<TViewContactLocationState>();
  const [showBookmark, setShowBookmark] = useState(false);
  const messageRef = useRef<any>(null);
  const addContactApi = useAddStrangerContact();
  const [popVisible, setPopVisible] = useState(false);
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit, info, sendImage, deleteMessage, hasNext, next, loading } =
    useChannel(`${channelUuid}`);
  const isStranger = useIsStranger(info?.toRelationId || '');
  const { handleDeleteMsg, handlePin, handleMute } = useHandle({ info, mute, pin, deleteMessage, list });
  const { setLoading } = useLoading();
  const clickUrl = useClickUrl({ fromChannelUuid: channelUuid, isGroup: false });
  useEffectOnce(() => {
    init();
  });
  const { relationId } = useRelationId();
  const messageList: MessageContentType[] = useMemo(
    () => formatMessageList({ list, ownerRelationId: relationId! }),
    [list, relationId],
  );
  const handleDelete = useCallback(() => {
    CustomModalConfirm({
      content: t('Delete chat?'),
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          await exit();
          navigate('/chat-list');
        } catch (e) {
          singleMessage.error('Failed to delete chat');
          console.log('===handle delete chat error', e);
        }
      },
    });
  }, [exit, navigate, t]);
  const handleAddContact = useLockCallback(async () => {
    try {
      setLoading(true);
      const res = await addContactApi(info?.toRelationId || '');
      console.log('===add stranger res', res, 'info', info);
      singleMessage.success('Contact added');
    } catch (e) {
      singleMessage.error('Add contact error');
      console.log('===add stranger error', e);
    } finally {
      setLoading(false);
    }
  }, [addContactApi, info, setLoading]);
  const handleGoProfile = useCallback(() => {
    navigate('/setting/contacts/view', {
      state: { relationId: info?.toRelationId, previousPage: 'chat-box', isStranger, channelUuid },
    });
  }, [info?.toRelationId, isStranger, navigate, channelUuid]);
  const p2pPopList = useMemo(
    () => [
      {
        key: 'profile',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Profile',
        onClick: handleGoProfile,
      },
      {
        key: info?.pin ? 'un-pin' : 'pin',
        leftIcon: <CustomSvg type={info?.pin ? 'UnPin' : 'Pin'} />,
        children: info?.pin ? 'Unpin' : 'Pin',
        onClick: handlePin,
      },
      {
        key: info?.mute ? 'un-mute' : 'mute',
        leftIcon: <CustomSvg type={info?.mute ? 'UnMute' : 'Mute'} />,
        children: info?.mute ? 'Unmute' : 'Mute',
        onClick: handleMute,
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: handleDelete,
      },
      {
        key: 'add-contact',
        leftIcon: <CustomSvg type="ChatAddContact" />,
        children: 'Add Contact',
        onClick: handleAddContact,
      },
    ],
    [handleAddContact, handleDelete, handleGoProfile, handleMute, handlePin, info?.mute, info?.pin],
  );
  const handleSendMsgError = useCallback((e: any) => {
    singleMessage.error('Failed to send message');
    console.log('===Failed to send message', e);
  }, []);
  const inputMorePopList: PopDataProps[] = useMemo(
    () => [
      {
        key: 'album',
        children: (
          <CustomUpload
            sendImage={sendImage}
            onSuccess={() => (messageRef.current.scrollTop = messageRef.current.scrollHeight)}
            handleSendMsgError={handleSendMsgError}
          />
        ),
      },
      {
        key: 'bookmark',
        leftIcon: <CustomSvg type="Bookmark" />,
        children: 'Bookmarks',
        onClick: () => setShowBookmark(true),
      },
    ],
    [handleSendMsgError, sendImage],
  );
  const hidePop = useCallback((e: Event) => {
    try {
      const _target = e?.target as Element;
      const _className = _target?.className;
      const isFunc = _className.includes instanceof Function;
      if (isFunc && !_className.includes('chat-box-more')) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('===chat box hidePop error', e);
    }
  }, []);
  const handleSendMessage = useCallback(
    async (v: string) => {
      try {
        await sendMessage({
          content: v.trim() ?? '',
        });
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      } catch (e) {
        handleSendMsgError(e);
      }
    },
    [handleSendMsgError, sendMessage],
  );
  const renderTitle = useMemo(
    () => (
      <div className="flex title-element">
        <div className="title-content flex-center" onClick={handleGoProfile}>
          <Avatar src={info?.channelIcon} letter={info?.displayName?.slice(0, 1).toUpperCase()} />
          <div className="title-name">{info?.displayName}</div>
        </div>
        {info?.mute && <CustomSvg type="Mute" />}
      </div>
    ),
    [handleGoProfile, info?.channelIcon, info?.displayName, info?.mute],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="chat-box-page flex-column">
      <ChatBoxHeader
        popMenuData={p2pPopList.filter((i) => isStranger || i.key !== 'add-contact')}
        renderTitle={renderTitle}
        goBack={() => navigate('/chat-list')}
        popVisible={popVisible}
        setPopVisible={setPopVisible}
      />
      {isStranger && showStrangerTip && (
        <ChatBoxTip onConfirm={handleAddContact} onClose={() => setShowStrangerTip(false)}>
          <div className="content flex-center">
            <CustomSvg type="ChatAddContact" />
            <span className="text">Add Contact</span>
          </div>
        </ChatBoxTip>
      )}
      <div className="chat-box-content">
        <StyleProvider prefixCls="portkey">
          <MessageList
            loading={loading}
            reference={messageRef}
            hasNext={hasNext}
            next={next}
            lockable
            dataSource={messageList}
            onDeleteMsg={handleDeleteMsg}
            onClickUrl={clickUrl}
            onClickUnSupportMsg={WarnTip}
          />
        </StyleProvider>
      </div>
      <div className="chat-box-footer">
        <StyleProvider prefixCls="portkey">
          <InputBar moreData={inputMorePopList} maxLength={MAX_INPUT_LENGTH} onSendMessage={handleSendMessage} />
        </StyleProvider>
      </div>
      <BookmarkListDrawer
        destroyOnClose
        open={showBookmark}
        onClose={() => setShowBookmark(false)}
        onClick={handleSendMessage}
      />
    </div>
  );
}
