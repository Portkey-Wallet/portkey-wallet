import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Modal, Popover, Upload, message } from 'antd';
import { PopoverMenuList, MessageList, InputBar, StyleProvider, MessageType } from '@portkey-wallet/im-ui-web';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { RcFile } from 'antd/lib/upload/interface';
import PhotoSendModal from './components/ImageSendModal';
import {
  ImageMessageFileType,
  useAddStranger,
  useChannel,
  useIsStranger,
  useRelationId,
} from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import BookmarkListDrawer from './components/BookmarkListDrawer';
import { getPixel } from './utils';
import { formatMessageTime } from '@portkey-wallet/utils/chat';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { MessageTypeWeb } from 'types/im';
import { sleep } from '@portkey-wallet/utils';
import { useAppDispatch } from 'store/Provider/hooks';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import './index.less';

export default function Session() {
  const { channelUuid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [file, setFile] = useState<ImageMessageFileType>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [showBookmark, setShowBookmark] = useState(false);
  const sendImgModalRef = useRef<any>(null);
  const messageRef = useRef<any>(null);
  const addContactApi = useAddStranger();
  const [popVisible, setPopVisible] = useState(false);
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit, info, sendImage, deleteMessage, hasNext, next, loading } =
    useChannel(`${channelUuid}`);
  const isStranger = useIsStranger(info?.toRelationId || '');
  const dispatch = useAppDispatch();
  useEffectOnce(() => {
    init();
  });
  console.log('message-list', list);

  const relationId = useRelationId();
  const messageList: MessageType[] = useMemo(() => {
    const formatList: MessageType[] = [];
    let transItem: MessageType;
    list.forEach((item, i) => {
      const transType = MessageTypeWeb[item.type] || '';
      if (transType) {
        transItem = {
          id: `${item.id}`,
          // sendUuid: item.sendUuid, // TODO
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
          type: MessageTypeWeb[item.type] || 'text',
          date: item.createAt,
        };
      } else {
        transItem = {
          id: `${item.createAt}`,
          position: 'left',
          date: item.createAt,
          type: 'text',
          subType: 'non-text',
          text: '',
        };
      }
      if (i === 0) {
        formatList.push(
          {
            id: `${item.createAt}`,
            position: 'left',
            date: item.createAt,
            type: 'system',
            text: formatMessageTime(item.createAt),
          },
          transItem,
        );
      } else {
        if (dayjs(list[i - 1].createAt).isSame(item.createAt, 'day')) {
          formatList.push(transItem);
        } else {
          formatList.push(
            {
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
  const handleDel = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Delete chat?'),
      className: 'chat-delete-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: () => {
        exit();
        navigate('/chat-list');
      },
    });
  }, [exit, navigate, t]);
  const handleAddContact = useCallback(async () => {
    try {
      const res = await addContactApi(info?.toRelationId || '');
      console.log('===add stranger', res);
      message.success('Contact added');
      // TODO
      await sleep(100);
      dispatch(fetchContactListAsync());
    } catch (e) {
      message.error('Add contact error');
      console.log('===add stranger error', e);
    }
  }, [addContactApi, dispatch, info?.toRelationId]);
  const chatPopList = useMemo(
    () => [
      {
        key: 'profile',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Profile',
        // TODO
        onClick: () =>
          navigate('/setting/contacts/view', { state: { name: info?.displayName, relationId: info?.toRelationId } }),
      },
      {
        key: info?.pin ? 'un-pin' : 'pin',
        leftIcon: <CustomSvg type={info?.pin ? 'UnPin' : 'Pin'} />,
        children: info?.pin ? 'Unpin' : 'Pin',
        onClick: () => pin(!info?.pin),
      },
      {
        key: info?.mute ? 'un-mute' : 'mute',
        leftIcon: <CustomSvg type={info?.mute ? 'UnMute' : 'Mute'} />,
        children: info?.mute ? 'Unmute' : 'Mute',
        onClick: () => mute(!info?.mute),
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: handleDel,
      },
      {
        key: 'add-contact',
        leftIcon: <CustomSvg type="ChatAddContact" />,
        children: 'Add Contact',
        onClick: handleAddContact,
      },
    ],
    [handleAddContact, handleDel, info, mute, navigate, pin],
  );
  const uploadProps = {
    className: 'chat-input-upload',
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: async (paramFile: RcFile) => {
      const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(paramFile);
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      setPreviewImage(src as string);
      const { width, height } = await getPixel(src as string);
      setFile({ body: paramFile, width, height });
      return false;
    },
  };
  const inputMorePopList = [
    {
      key: 'album',
      leftIcon: <CustomSvg type="Album" />,
      children: (
        <Upload {...uploadProps}>
          <span className="upload-text">Picture</span>
        </Upload>
      ),
    },
    {
      key: 'bookmark',
      leftIcon: <CustomSvg type="Bookmark" />,
      children: 'Bookmark',
      onClick: () => setShowBookmark(true),
    },
  ];
  const handleUpload = async () => {
    try {
      await sendImage(file!);
      setPreviewImage('');
      setFile(undefined);
    } catch (e) {
      console.log('===send image error', e);
      message.error('Failed to send message');
      sendImgModalRef?.current?.setLoading(false);
    }
  };
  const hidePop = (e: any) => {
    try {
      if (e?.target?.className?.indexOf('chat-box-more') === -1) {
        setPopVisible(false);
      }
    } catch (e) {
      // TODO
      console.log('e', e);
    }
  };
  const handleSendMessage = async (v: string) => {
    try {
      await sendMessage(v);
    } catch (e) {
      message.error('Failed to send message');
    }
  };
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, []);
  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={
            <div className="flex title-element">
              <Avatar letterItem={info?.displayName?.slice(0, 1).toUpperCase()} />
              <div className="name-text">{info?.displayName}</div>
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
                content={<PopoverMenuList data={isStranger ? chatPopList : chatPopList.slice(0, -1)} />}>
                <div className="chat-box-more" onClick={() => setPopVisible(true)}>
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
            <CustomSvg type="AddContact" />
            <span className="text">Add Contact</span>
          </div>
          <CustomSvg type="Close2" onClick={() => setShowStrangerTip(false)} />
        </div>
      )}
      <div className="chat-box-content">
        <StyleProvider prefixCls="portkey">
          <MessageList
            loading={loading}
            referance={messageRef}
            hasNext={hasNext}
            next={next}
            lockable
            dataSource={messageList}
            onDelete={deleteMessage}
          />
        </StyleProvider>
      </div>
      <div className="chat-box-footer">
        <StyleProvider prefixCls="portkey">
          <InputBar moreData={inputMorePopList} onSendMessage={handleSendMessage} />
        </StyleProvider>
      </div>
      <PhotoSendModal
        ref={sendImgModalRef}
        open={!!previewImage}
        url={previewImage || ''}
        onConfirm={handleUpload}
        onCancel={() => {
          setPreviewImage('');
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
