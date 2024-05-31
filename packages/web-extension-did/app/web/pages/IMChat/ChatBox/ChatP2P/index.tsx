import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import CustomSvg from 'components/CustomSvg';
import { MessageList, InputBar, StyleProvider, MessageContentType, PopDataProps } from '@portkey-wallet/im-ui-web';
import {
  ImageMessageFileType,
  useBlockAndReport,
  useChannel,
  useIsStranger,
  useRelationId,
} from '@portkey-wallet/hooks/hooks-ca/im';
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
import ReportDrawer from 'pages/IMChat/components/ReportDrawer';
import { ReportMessageEnum } from '@portkey-wallet/constants/constants-ca/chat';
import { handleErrorMessage } from '@portkey-wallet/utils';
import CircleLoading from 'components/CircleLoading';
import { MessageTypeEnum, ParsedImage } from '@portkey-wallet/im';
import { formatImageData } from '@portkey-wallet/im-ui-web';

export default function ChatBox() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigateState<TViewContactLocationState>();
  const [showBookmark, setShowBookmark] = useState(false);
  const messageRef = useRef<any>(null);
  const addContactApi = useAddStrangerContact();
  const [popVisible, setPopVisible] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit, info, sendImage, deleteMessage, hasNext, next, loading } =
    useChannel(`${channelUuid}`);
  const isStranger = useIsStranger(info?.toRelationId || '');
  const { reportMessage, isBlocked, unBlock: unBlockApi } = useBlockAndReport(info?.toRelationId);
  const { handleDeleteMsg, handlePin, handleMute } = useHandle({
    info,
    mute,
    pin,
    deleteMessage,
    list,
  });
  const curOperateMsg = useRef<MessageContentType>();
  const { setLoading } = useLoading();
  const [unBlockLoading, setUnBlockLoading] = useState(false);
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
            sendImage={(file: ImageMessageFileType) => sendImage(file, info?.toRelationId)}
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
    [handleSendMsgError, info?.toRelationId, sendImage],
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
          toRelationId: info?.toRelationId,
          content: v.trim() ?? '',
        });
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      } catch (e) {
        handleSendMsgError(e);
      }
    },
    [handleSendMsgError, info?.toRelationId, sendMessage],
  );
  const handleReport = useCallback(
    async ({ reportType, description }: { reportType: ReportMessageEnum; description: string }) => {
      if (!curOperateMsg.current) throw 'can not find target message';
      try {
        const parsedContent = curOperateMsg.current.parsedContent;
        let msg = parsedContent;
        if (curOperateMsg.current.type === MessageTypeEnum.IMAGE) {
          const { thumbImgUrl, imgUrl } = formatImageData(parsedContent as ParsedImage);
          msg = thumbImgUrl ?? imgUrl;
        }

        await reportMessage({
          message: msg,
          messageId: curOperateMsg.current.id,
          reportedRelationId: curOperateMsg.current.from,
          reportType,
          description,
          channelUuid,
        });
        singleMessage.success(
          'Thank you for reporting this. Portkey will look into the matter and take appropriate action to handle it.',
        );
      } catch (error) {
        console.log('handleReport error===', error);
        singleMessage.error(handleErrorMessage(error, 'report message error.'));
      }
    },
    [channelUuid, reportMessage],
  );
  const handleUnBlock = useCallback(async () => {
    try {
      setUnBlockLoading(true);
      await unBlockApi(info?.toRelationId);
      singleMessage.success('User unblocked');
    } catch (error) {
      console.log('===handleUnBlock error', error);
      singleMessage.error(handleErrorMessage(error, 'unBlock error'));
    } finally {
      setUnBlockLoading(false);
    }
  }, [info?.toRelationId, unBlockApi]);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="chat-box-page flex-column">
      <ChatBoxHeader
        avatarProps={{
          src: info?.channelIcon,
          letter: info?.displayName?.slice(0, 1).toUpperCase(),
        }}
        titleName={info?.displayName}
        isMute={info?.mute}
        handleClickTitle={handleGoProfile}
        popMenuData={p2pPopList.filter((i) => isStranger || i.key !== 'add-contact')}
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
            onReportMsg={(item: MessageContentType) => {
              setReportOpen(true);
              curOperateMsg.current = item;
            }}
          />
        </StyleProvider>
      </div>
      {isBlocked ? (
        <div className="unblock-footer flex-center">
          {unBlockLoading ? (
            <div className="flex-row-center un-click-content">
              <CircleLoading />
              Unblocking
            </div>
          ) : (
            <div onClick={handleUnBlock} className="click-content">
              Unblock
            </div>
          )}
        </div>
      ) : (
        <div className="chat-box-footer">
          <StyleProvider prefixCls="portkey">
            <InputBar moreData={inputMorePopList} maxLength={MAX_INPUT_LENGTH} onSendMessage={handleSendMessage} />
          </StyleProvider>
        </div>
      )}
      <BookmarkListDrawer
        destroyOnClose
        open={showBookmark}
        onClose={() => setShowBookmark(false)}
        onClick={handleSendMessage}
      />
      <ReportDrawer open={reportOpen} onCloseReport={() => setReportOpen(false)} onReport={handleReport} />
    </div>
  );
}
