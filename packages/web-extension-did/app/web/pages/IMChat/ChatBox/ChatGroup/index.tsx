import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Modal, Popover, message } from 'antd';
import {
  PopoverMenuList,
  MessageList,
  InputBar,
  StyleProvider,
  MessageType,
  PopDataProps,
} from '@portkey-wallet/im-ui-web';
import PhotoSendModal, { IPreviewImage } from '../../components/ImageSendModal';
import { ImageMessageFileType, useGroupChannel, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import BookmarkListDrawer from '../../components/BookmarkListDrawer';
import { formatMessageList } from '../../utils';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'store/Provider/hooks';
import { MAX_INPUT_LENGTH } from '@portkey-wallet/constants/constants-ca/im';
import ChatBoxTip from '../../components/ChatBoxTip';
import CustomUpload from '../../components/CustomUpload';
import CircleLoading from 'components/CircleLoading';

export default function ChatBox() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [file, setFile] = useState<ImageMessageFileType>();
  const [previewImage, setPreviewImage] = useState<IPreviewImage>();
  const [showBookmark, setShowBookmark] = useState(false);
  const sendImgModalRef = useRef<any>(null);
  const messageRef = useRef<any>(null);
  const [popVisible, setPopVisible] = useState(false);
  const [showAddMemTip, setShowAddMemTip] = useState(true);
  const {
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
    refreshGroupInfo,
    groupInfo,
  } = useGroupChannel(`${channelUuid}`);
  const { setLoading } = useLoading();
  console.log(setLoading);
  // useEffectOnce(() => {
  //   init();
  // });
  console.log('list group', list);
  const relationId = useRelationId();
  const messageList: MessageType[] = useMemo(() => formatMessageList(list, relationId!, true), [list, relationId]);
  console.log(messageList);
  console.log(refreshGroupInfo);
  // TODO delete
  const handleDeleteMsg = useCallback(
    async (item: MessageType) => {
      try {
        await deleteMessage(`${item.id}`);
      } catch (e) {
        message.error('Failed to delete message');
        console.log('===handle delete message error', e);
      }
    },
    [deleteMessage],
  );
  const handlePin = useCallback(async () => {
    try {
      await pin(!groupInfo?.pin);
    } catch (e: any) {
      if (`${e?.code}` === '13310') {
        message.error('Pin limit exceeded');
      } else {
        message.error(`Failed to ${groupInfo?.pin ? 'unpin' : 'pin'} chat`);
      }
      console.log('===handle pin error', e);
    }
  }, [groupInfo?.pin, pin]);
  const handleMute = useCallback(async () => {
    try {
      await mute(!groupInfo?.mute);
    } catch (e) {
      message.error(`Failed to ${groupInfo?.mute ? 'unmute' : 'mute'} chat`);
      console.log('===handle mute error', e);
    }
  }, [groupInfo?.mute, mute]);
  const handleDeleteBox = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Delete chat?'),
      className: 'chat-delete-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          await exit();
          navigate('/chat-list');
        } catch (e) {
          message.error('Failed to delete chat');
          console.log('===handle delete chat error', e);
        }
      },
    });
  }, [exit, navigate, t]);
  const handleGoGroupInfo = useCallback(() => {
    navigate(`/chat-group-info/${channelUuid}`);
  }, [navigate, channelUuid]);
  const handleLeaveGroup = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Leave the group?'),
      className: 'leave-group-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          // TODO await leave();
          navigate('/chat-list');
        } catch (e) {
          message.error('Failed to leave the group');
          console.log('===Failed to leave the group error', e);
        }
      },
    });
  }, [navigate, t]);
  const handleAddMember = useCallback(() => {
    navigate(`/chat-box-group/${channelUuid}/add-member`);
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
        leftIcon: <CustomSvg type={groupInfo?.pin ? 'UnPin' : 'Pin'} />,
        children: groupInfo?.pin ? 'Unpin' : 'Pin',
        onClick: handlePin,
      },
      {
        key: 'mute',
        leftIcon: <CustomSvg type={groupInfo?.mute ? 'UnMute' : 'Mute'} />,
        children: groupInfo?.mute ? 'Unmute' : 'Mute',
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
    [handleDeleteBox, handleGoGroupInfo, handleLeaveGroup, handleMute, handlePin, groupInfo?.mute, groupInfo?.pin],
  );
  const inputMorePopList: PopDataProps[] = useMemo(
    () => [
      {
        key: 'album',
        children: <CustomUpload setFile={setFile} setPreviewImage={setPreviewImage} />,
      },
      {
        key: 'bookmark',
        leftIcon: <CustomSvg type="Bookmark" />,
        children: 'Bookmarks',
        onClick: () => setShowBookmark(true),
      },
    ],
    [],
  );
  const handleUpload = useCallback(async () => {
    try {
      await sendImage(file!);
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
      setPreviewImage(undefined);
      setFile(undefined);
    } catch (e) {
      console.log('===send image error', e);
      message.error('Failed to send message');
    }
  }, [file, sendImage]);
  const hidePop = useCallback((e: any) => {
    try {
      const _t = e?.target?.className;
      const isFunc = _t.includes instanceof Function;
      if (isFunc && !_t.includes('chat-box-more')) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('===chat box hidePop error', e);
    }
  }, []);
  const handleSendMessage = useCallback(
    async (v: string) => {
      try {
        await sendMessage(v.trim() ?? '');
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      } catch (e) {
        message.error('Failed to send message');
      }
    },
    [sendMessage],
  );
  const renderChatBoxTip = useMemo(
    () =>
      isAdmin &&
      showAddMemTip && (
        <ChatBoxTip onConfirm={handleAddMember} onClose={() => setShowAddMemTip(false)}>
          <div className="content flex-center">
            <CustomSvg type="ChatAddContact" />
            <span className="text">Add Member</span>
          </div>
        </ChatBoxTip>
      ),
    [handleAddMember, isAdmin, showAddMemTip],
  );
  const renderTitle = useMemo(
    () => (
      <div className="title-group-content flex-center">
        <div className="group-icon flex-center" onClick={handleGoGroupInfo}>
          <CustomSvg type="GroupAvatar" />
        </div>
        <div>
          <div className="flex title-top">
            <div className="title-name" onClick={handleGoGroupInfo}>
              {groupInfo?.name}
            </div>
            <div>{groupInfo?.mute && <CustomSvg type="Mute" />}</div>
          </div>
          <div className="title-member flex">
            {groupInfo?.members ? <span>{groupInfo?.members.length}</span> : <CircleLoading />}
            {typeof groupInfo?.members?.length === 'number' && groupInfo?.members?.length > 1 ? 'members' : 'member'}
          </div>
        </div>
      </div>
    ),
    [groupInfo?.members, groupInfo?.mute, groupInfo?.name, handleGoGroupInfo],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={<div className="flex title-element">{renderTitle}</div>}
          leftCallBack={() => navigate('/chat-list')}
          rightElement={
            <div className="flex-center right-element">
              <Popover
                open={popVisible}
                overlayClassName="chat-box-popover"
                trigger="click"
                showArrow={false}
                content={<PopoverMenuList data={groupPopList.filter((i) => !isAdmin || i.key !== 'leave-group')} />}>
                <div className="chat-box-more" onClick={() => setPopVisible(!popVisible)}>
                  <CustomSvg type="More" />
                </div>
              </Popover>
              <CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />
            </div>
          }
        />
      </div>
      {renderChatBoxTip}
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
          />
        </StyleProvider>
      </div>
      <div className="chat-box-footer">
        <StyleProvider prefixCls="portkey">
          <InputBar moreData={inputMorePopList} maxLength={MAX_INPUT_LENGTH} onSendMessage={handleSendMessage} />
        </StyleProvider>
      </div>
      <PhotoSendModal
        ref={sendImgModalRef}
        open={!!previewImage?.src}
        file={previewImage}
        onConfirm={handleUpload}
        onCancel={() => {
          setPreviewImage(undefined);
          setFile(undefined);
        }}
      />
      <BookmarkListDrawer
        destroyOnClose
        open={showBookmark}
        onClose={() => setShowBookmark(false)}
        onClick={handleSendMessage}
      />
    </div>
  );
}
