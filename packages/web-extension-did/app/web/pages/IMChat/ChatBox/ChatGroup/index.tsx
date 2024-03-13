import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import {
  MessageList,
  InputBar,
  StyleProvider,
  MessageContentType,
  PopDataProps,
  Avatar,
  IInputReplyMsgProps,
} from '@portkey-wallet/im-ui-web';
import { useGroupChannel, useHideChannel, useLeaveChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import BookmarkListDrawer from '../../components/BookmarkListDrawer';
import { formatImageData, formatMessageList } from '../../utils';
import { useTranslation } from 'react-i18next';
import { MAX_INPUT_LENGTH } from '@portkey-wallet/constants/constants-ca/im';
import ChatBoxTip from '../../components/ChatBoxTip';
import CustomUpload from '../../components/CustomUpload';
import { useEffectOnce } from 'react-use';
import { useHandle } from '../useHandleMsg';
import ChatBoxHeader from '../components/ChatBoxHeader';
import CustomModal from 'pages/components/CustomModal';
import { useClickUrl } from 'hooks/im';
import WarnTip from 'pages/IMChat/components/WarnTip';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import { NO_LONGER_IN_GROUP } from '@portkey-wallet/constants/constants-ca/chat';
import { Message, MessageTypeEnum, ParsedImage } from '@portkey-wallet/im';
import ChatBoxPinnedMsg from 'pages/IMChat/components/ChatBoxPinnedMsg';
import { useIMPin } from '@portkey-wallet/hooks/hooks-ca/im/pin';
import { useWalletInfo } from 'store/Provider/hooks';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { TViewContactLocationState } from 'types/router';

export default function ChatBox() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const { userInfo } = useWalletInfo();
  const navigate = useNavigateState<TViewContactLocationState>();
  const [showBookmark, setShowBookmark] = useState(false);
  const messageRef = useRef<any>(null);
  const [popVisible, setPopVisible] = useState(false);
  const [showAddMemTip, setShowAddMemTip] = useState(true);
  const [replyMsg, setReplyMsg] = useState<Message>();
  const showReplyMsg: IInputReplyMsgProps | undefined = useMemo(() => {
    if (replyMsg?.type === MessageTypeEnum.TEXT) {
      return {
        msgType: MessageTypeEnum.TEXT,
        toName: `${replyMsg.fromName}`,
        msgContent: `${replyMsg.content}`,
      };
    }
    if (replyMsg?.type === MessageTypeEnum.IMAGE) {
      const { thumbImgUrl, imgUrl } = formatImageData(replyMsg?.parsedContent as ParsedImage);
      return {
        msgType: MessageTypeEnum.IMAGE,
        toName: `${replyMsg.fromName}`,
        thumbImgUrl: thumbImgUrl || imgUrl,
        imgUrl,
      };
    }
    return undefined;
  }, [replyMsg]);
  const {
    init,
    list,
    isAdmin,
    deleteMessage,
    exit,
    hasNext,
    next,
    loading,
    mute,
    pin,
    sendImage,
    sendMessage,
    groupInfo,
    info,
  } = useGroupChannel(`${channelUuid}`);
  const {
    list: pinList,
    lastPinMessage,
    refresh: refreshAllPinList,
    pin: pinMsg,
    unPin: unPinMsg,
  } = useIMPin(`${channelUuid}`, true);
  const clickUrl = useClickUrl({ fromChannelUuid: channelUuid, isGroup: true });
  useEffectOnce(() => {
    init();
    refreshAllPinList();
  });
  const lastPinMsgShow = useMemo(() => {
    if (lastPinMessage?.type === MessageTypeEnum.TEXT) {
      setShowAddMemTip(false);
      return {
        msgType: MessageTypeEnum.TEXT,
        msgContent: `${lastPinMessage.content}`,
      };
    }
    if (lastPinMessage?.type === MessageTypeEnum.IMAGE) {
      const { thumbImgUrl, imgUrl } = formatImageData(lastPinMessage?.parsedContent as ParsedImage);
      setShowAddMemTip(false);
      return {
        msgType: MessageTypeEnum.IMAGE,
        thumbImgUrl: thumbImgUrl || imgUrl,
        imgUrl,
      };
    }
    return undefined;
  }, [lastPinMessage]);
  const hideChannel = useHideChannel();
  const { relationId } = useRelationId();
  const messageList: MessageContentType[] = useMemo(
    () => formatMessageList({ list, ownerRelationId: relationId!, isGroup: true, isAdmin }),
    [isAdmin, list, relationId],
  );
  const handleCancelReply = useCallback(() => {
    setReplyMsg(undefined);
  }, []);
  const handleClickReply = useCallback(
    (item: MessageContentType) => {
      const _msg = list.find((temp) => temp.id === item.id);
      setReplyMsg(_msg);
    },
    [list],
  );
  const leaveGroup = useLeaveChannel();
  const { handleDeleteMsg, handlePin, handleMute, handlePinMsg } = useHandle({
    info,
    mute,
    pin,
    deleteMessage,
    list,
    pinMsg,
    unPinMsg,
  });
  const handleDeleteBox = useCallback(() => {
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
  const handleGoGroupInfo = useCallback(() => {
    navigate(`/chat-group-info/${channelUuid}`);
  }, [navigate, channelUuid]);
  const handleLeaveGroup = useCallback(() => {
    CustomModalConfirm({
      content: t('Are you sure to leave this group?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await leaveGroup(`${channelUuid}`);
          navigate('/chat-list');
        } catch (e) {
          singleMessage.error('Failed to leave the group');
          console.log('===Failed to leave the group error', e);
        }
      },
    });
  }, [channelUuid, leaveGroup, navigate, t]);
  const handleAddMember = useCallback(() => {
    navigate(`/chat-group-info/${channelUuid}/member-list/add`);
  }, [channelUuid, navigate]);
  const groupPopList = useMemo(
    () => [
      {
        key: 'group-info',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Group Info',
        onClick: handleGoGroupInfo,
      },
      {
        key: 'pin',
        leftIcon: <CustomSvg type={info?.pin ? 'UnPin' : 'Pin'} />,
        children: info?.pin ? 'Unpin' : 'Pin',
        onClick: handlePin,
      },
      {
        key: 'mute',
        leftIcon: <CustomSvg type={info?.mute ? 'UnMute' : 'Mute'} />,
        children: info?.mute ? 'Unmute' : 'Mute',
        onClick: handleMute,
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: handleDeleteBox,
      },
      {
        key: 'leave-group',
        leftIcon: <CustomSvg type="ChatLeave" />,
        children: 'Leave Group',
        onClick: handleLeaveGroup,
      },
    ],
    [handleDeleteBox, handleGoGroupInfo, handleLeaveGroup, handleMute, handlePin, info?.mute, info?.pin],
  );
  const handleSendMsgError = useCallback(
    (e: any) => {
      if (`${e.code}` === NO_LONGER_IN_GROUP) {
        hideChannel(`${channelUuid}`, true);
        CustomModal({
          content: `You can't send messages to this group because you are no longer in it.`,
          onOk: () => {
            navigate('/chat-list');
          },
        });
      } else {
        singleMessage.error('Failed to send message');
        console.log('===Failed to send message', e);
      }
    },
    [channelUuid, hideChannel, navigate],
  );
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
        setReplyMsg(undefined);
        await sendMessage({
          content: v.trim() ?? '',
          quoteMessage: replyMsg,
        });
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      } catch (e: any) {
        handleSendMsgError(e);
      }
    },
    [handleSendMsgError, replyMsg, sendMessage],
  );
  const handleGoProfile = useCallback(
    (item: MessageContentType) => {
      navigate('/setting/contacts/view', {
        state: { relationId: item?.from, previousPage: 'chat-box-group', channelUuid },
      });
    },
    [navigate, channelUuid],
  );
  const renderTitle = useMemo(
    () => (
      <div className="flex title-element">
        <div className="title-content flex-center" onClick={handleGoGroupInfo}>
          <Avatar isGroupAvatar={true} src={groupInfo?.icon} />
          <div className="title-name">{groupInfo?.name || info?.displayName || ''}</div>
        </div>
        <div>{info?.mute && <CustomSvg type="Mute" />}</div>
      </div>
    ),
    [handleGoGroupInfo, groupInfo?.icon, groupInfo?.name, info?.displayName, info?.mute],
  );
  const renderAddMember = useMemo(
    () =>
      isAdmin &&
      showAddMemTip && (
        <ChatBoxTip onConfirm={handleAddMember} onClose={() => setShowAddMemTip(false)}>
          <div className="content flex-center">
            <CustomSvg type="ChatAddContact" />
            <span className="text">Add Members</span>
          </div>
        </ChatBoxTip>
      ),
    [handleAddMember, isAdmin, showAddMemTip],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="chat-box-page flex-column">
      <ChatBoxHeader
        popMenuData={groupPopList.filter((i) => !isAdmin || i.key !== 'leave-group')}
        renderTitle={<div className="flex title-element">{renderTitle}</div>}
        goBack={() => navigate('/chat-list')}
        popVisible={popVisible}
        setPopVisible={setPopVisible}
      />
      {lastPinMsgShow ? (
        <ChatBoxPinnedMsg
          msgCount={pinList?.length}
          msgType={lastPinMsgShow.msgType}
          msgContent={lastPinMsgShow.msgContent}
          thumbImgUrl={lastPinMsgShow.thumbImgUrl}
          imgUrl={lastPinMsgShow.imgUrl}
          onViewMore={() => navigate(`/chat-box-group/${channelUuid}/pinned-msg`)}
        />
      ) : (
        renderAddMember
      )}
      <div className="chat-box-content">
        <StyleProvider prefixCls="portkey">
          <MessageList
            loading={loading}
            reference={messageRef}
            hasNext={hasNext}
            next={next}
            lockable
            myPortkeyId={userInfo?.userId}
            dataSource={messageList}
            onClickAvatar={handleGoProfile}
            onDeleteMsg={handleDeleteMsg}
            onPinMsg={handlePinMsg}
            onClickUrl={clickUrl}
            onClickUnSupportMsg={WarnTip}
            onReplyMsg={handleClickReply}
          />
        </StyleProvider>
      </div>
      <div className="chat-box-footer">
        <StyleProvider prefixCls="portkey">
          <InputBar
            moreData={inputMorePopList}
            maxLength={MAX_INPUT_LENGTH}
            replyMsg={showReplyMsg}
            onCloseReply={handleCancelReply}
            onSendMessage={handleSendMessage}
          />
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
