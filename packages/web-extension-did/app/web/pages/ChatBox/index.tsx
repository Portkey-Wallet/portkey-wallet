import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Modal, Popover, Upload, message } from 'antd';
import { PopoverMenuList, MessageList, InputBar, StyleProvider, MessageType } from '@portkey-wallet/im-ui-web';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { RcFile } from 'antd/lib/upload/interface';
import PhotoSendModal, { IPreviewImage } from './components/ImageSendModal';
import { ImageMessageFileType, useChannel, useIsStranger, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import BookmarkListDrawer from './components/BookmarkListDrawer';
import { getPixel } from './utils';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import { useTranslation } from 'react-i18next';
import { MessageTypeWeb } from 'types/im';
import { useLoading } from 'store/Provider/hooks';
import { useAddStrangerContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { isSameDay } from '@portkey-wallet/utils/time';
import { MAX_FILE_SIZE, MAX_INPUT_LENGTH } from '@portkey-wallet/constants/constants-ca/im';
import { ZERO } from '@portkey-wallet/constants/misc';
import { formatImageSize } from '@portkey-wallet/utils/img';
import './index.less';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export default function ChatBox() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [file, setFile] = useState<ImageMessageFileType>();
  const [previewImage, setPreviewImage] = useState<IPreviewImage>();
  const [showBookmark, setShowBookmark] = useState(false);
  const sendImgModalRef = useRef<any>(null);
  const messageRef = useRef<any>(null);
  const addContactApi = useAddStrangerContact();
  const [popVisible, setPopVisible] = useState(false);
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit, info, sendImage, deleteMessage, hasNext, next, loading } =
    useChannel(`${channelUuid}`);
  const isStranger = useIsStranger(info?.toRelationId || '');
  const { setLoading } = useLoading();
  useEffectOnce(() => {
    init();
  });
  const relationId = useRelationId();
  const messageList: MessageType[] = useMemo(() => {
    const formatList: MessageType[] = [];
    let transItem: MessageType;
    list.forEach((item, i) => {
      const transType = MessageTypeWeb[item.type] || '';
      if (['text', 'image'].includes(transType)) {
        transItem = {
          id: `${item.id}`,
          key: item.sendUuid,
          title: item.fromName,
          position: item.from === relationId ? 'right' : 'left',
          text: `${item.parsedContent}`,
          imgData:
            typeof item.parsedContent === 'object'
              ? {
                  ...item.parsedContent,
                  thumbImgUrl: decodeURIComponent(`${item.parsedContent.thumbImgUrl}`) || '',
                  imgUrl: decodeURIComponent(`${item.parsedContent.imgUrl}`) || '',
                  width: `${item?.parsedContent?.width}`,
                  height: `${item?.parsedContent?.height}`,
                }
              : {},
          type: transType,
          date: item.createAt,
        };
      } else {
        transItem = {
          key: `${item.createAt}`,
          id: `${item.createAt}`,
          position: 'left',
          date: item.createAt,
          type: 'text',
          subType: 'non-support-msg',
          text: '',
        };
      }
      if (i === 0) {
        formatList.push(
          {
            key: `${item.createAt}`,
            id: `${item.createAt}`,
            position: 'left',
            date: item.createAt,
            type: 'system',
            text: formatMessageTime(item.createAt),
          },
          transItem,
        );
      } else {
        if (isSameDay(list[i - 1].createAt, item.createAt)) {
          formatList.push(transItem);
        } else {
          formatList.push(
            {
              key: `${item.createAt}`,
              id: `${item.createAt}`,
              position: 'left',
              date: item.createAt,
              type: 'system',
              text: formatMessageTime(item.createAt),
            },
            transItem,
          );
        }
      }
    });
    return formatList;
  }, [list, relationId]);
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
      await pin(!info?.pin);
    } catch (e: any) {
      if (`${e?.code}` === '13310') {
        message.error('Pin limit exceeded');
      } else {
        message.error(`Failed to ${info?.pin ? 'unpin' : 'pin'} chat`);
      }
      console.log('===handle pin error', e);
    }
  }, [info?.pin, pin]);
  const handleMute = useCallback(async () => {
    try {
      await mute(!info?.mute);
    } catch (e) {
      message.error(`Failed to ${info?.mute ? 'unmute' : 'mute'} chat`);
      console.log('===handle mute error', e);
    }
  }, [info?.mute, mute]);
  const handleDelete = useCallback(() => {
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
  const handleAddContact = useLockCallback(async () => {
    try {
      setLoading(true);
      const res = await addContactApi(info?.toRelationId || '');
      console.log('===add stranger res', res, 'info', info);
      message.success('Contact added');
    } catch (e) {
      message.error('Add contact error');
      console.log('===add stranger error', e);
    } finally {
      setLoading(false);
    }
  }, [addContactApi, info, setLoading]);
  const handleGoProfile = useCallback(() => {
    navigate('/setting/contacts/view', {
      state: { relationId: info?.toRelationId, from: 'chat-box', isStranger, channelUuid },
    });
  }, [info?.toRelationId, isStranger, navigate, channelUuid]);
  const chatPopList = useMemo(
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
  const uploadProps = useMemo(
    () => ({
      className: 'chat-input-upload',
      showUploadList: false,
      accept: 'image/*',
      beforeUpload: async (paramFile: RcFile) => {
        const sizeOk = ZERO.plus(paramFile.size / 1024 / 1024).isLessThanOrEqualTo(MAX_FILE_SIZE);
        if (!sizeOk) {
          message.info('File too large');
          return false;
        }
        try {
          const src = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(paramFile);
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (e) => {
              reject(e);
            };
          });
          const { width, height } = await getPixel(src as string);
          const imageSize = formatImageSize({ width, height, maxWidth: 300, maxHeight: 360 });
          setPreviewImage({ src: src as string, width: imageSize.width, height: imageSize.height });
          setFile({ body: paramFile, width, height });
        } catch (e) {
          console.log('===image beforeUpload error', e);
          message.error('Failed to send message');
        }
        return false;
      },
    }),
    [],
  );
  const inputMorePopList = useMemo(
    () => [
      {
        key: 'album',
        // leftIcon: <CustomSvg type="Album" />,
        children: (
          <Upload {...uploadProps}>
            <CustomSvg type="Album" />
            <span className="upload-text">Picture</span>
          </Upload>
        ),
      },
      {
        key: 'bookmark',
        leftIcon: <CustomSvg type="Bookmark" />,
        children: 'Bookmarks',
        onClick: () => setShowBookmark(true),
      },
    ],
    [uploadProps],
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
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={
            <div className="flex title-element">
              <div className="title-content flex-center" onClick={handleGoProfile}>
                <Avatar letterItem={info?.displayName?.slice(0, 1).toUpperCase()} />
                <div className="name-text">{info?.displayName}</div>
              </div>
              {info?.mute && <CustomSvg type="Mute" />}
            </div>
          }
          leftCallBack={() => navigate('/chat-list')}
          rightElement={
            <div className="flex-center right-element">
              <Popover
                open={popVisible}
                overlayClassName="chat-box-popover"
                trigger="click"
                showArrow={false}
                content={
                  <PopoverMenuList data={chatPopList.filter((pop) => pop.key !== 'add-contact' || isStranger)} />
                }>
                <div className="chat-box-more" onClick={() => setPopVisible(!popVisible)}>
                  <CustomSvg type="More" />
                </div>
              </Popover>
              <CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />
            </div>
          }
        />
      </div>
      {isStranger && showStrangerTip && (
        <div className="add-contact-tip">
          <div className="content flex-center" onClick={handleAddContact}>
            <CustomSvg type="ChatAddContact" />
            <span className="text">Add Contact</span>
          </div>
          <CustomSvg type="Close2" onClick={() => setShowStrangerTip(false)} />
        </div>
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
