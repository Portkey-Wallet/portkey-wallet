import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Popover, Upload, message } from 'antd';
import { PopoverMenuList, MessageList, InputBar, StyleProvider } from '@portkey-wallet/im-ui-web';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { RcFile } from 'antd/lib/upload/interface';
import PhotoSendModal from './components/PhotoSendModal';
import { ImageMessageFileType, useChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import BookmarkListDrawer from './components/BookmarkListDrawer';
import im from '@portkey-wallet/im';
import { getPixel } from './utils';
import './index.less';

enum MessageTypeWeb {
  'SYS' = 'system',
  'TEXT' = 'text',
  'CARD' = '',
  'IMAGE' = 'photo',
  'ANNOUNCEMENT' = '',
  'BATCH_TRANSFER' = '',
}

export default function Session() {
  const { channelUuid } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<ImageMessageFileType>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [showBookmark, setShowBookmark] = useState(false);
  const sendImgModalRef = useRef<any>(null);
  const messageRef = useRef<any>(null);
  // TODO
  const isStranger = true;
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit, info, sendImage, deleteMessage, hasNext, next, loading } =
    useChannel(`${channelUuid}`);
  useEffectOnce(() => {
    init();
  });
  const messageList: any = useMemo(() => {
    return list.map((item) => {
      return {
        id: item.id,
        // sendUuid: item.sendUuid, // TODO
        title: item.fromName,
        position: item.from === im.userInfo?.relationId ? 'right' : 'left', // TODO '5h7d6-liaaa-aaaaj-vgmya-cai'
        text: item.parsedContent,
        imgData:
          typeof item.parsedContent === 'object'
            ? {
                ...item.parsedContent,
                thumbImgUrl: decodeURIComponent(`${item.parsedContent.thumbImgUrl}`),
                imgUrl: decodeURIComponent(`${item.parsedContent.imgUrl}`),
              }
            : {},
        type: MessageTypeWeb[item.type],
      };
    });
  }, [list]);
  const chatPopList = useMemo(
    () => [
      {
        key: 'profile',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Profile',
        // TODO
        onClick: () => navigate('/setting/contacts/view', { state: {} }),
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
        onClick: exit,
      },
      isStranger && {
        key: 'add-contact',
        leftIcon: <CustomSvg type="ChatAddContact" />,
        children: 'Add Contact',
        // TODO
        onClick: () => navigate('/add-contact'),
      },
    ],
    [exit, info?.mute, info?.pin, isStranger, mute, navigate, pin],
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
      message.error('send error');
      sendImgModalRef?.current?.setLoading(false);
    }
  };
  const handleAddContact = () => {
    // TODO
    // isStranger is true
  };
  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={
            <div className="flex title-element">
              <Avatar letterItem={info?.name?.slice(0, 1).toUpperCase()} />
              <div className="name-text">{info?.name}</div>
              {info?.mute && <CustomSvg type="Mute" />}
            </div>
          }
          leftCallBack={() => navigate('/chat-list')}
          rightElement={
            <div className="flex-center right-element">
              <Popover
                overlayClassName="chat-box-popover"
                trigger="click"
                showArrow={false}
                content={<PopoverMenuList data={chatPopList} />}>
                <CustomSvg type="More" />
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
          <InputBar moreData={inputMorePopList} onSendMessage={sendMessage} />
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
        onClick={sendMessage}
      />
    </div>
  );
}
