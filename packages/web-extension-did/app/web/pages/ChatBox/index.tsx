import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Popover, Upload, UploadFile } from 'antd';
import { PopoverMenuList, MessageList, InputBar, StyleProvider } from '@portkey-wallet/im-ui-web';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { RcFile } from 'antd/lib/upload/interface';
import PhotoSendModal from './components/PhotoSendModal';
import { useChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { formatChatListTime } from '@portkey-wallet/utils/chat';
import BookmarkListDrawer from './components/BookmarkListDrawer';
import im from '@portkey-wallet/im';
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
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState<UploadFile>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [showBookmark, setShowBookmark] = useState(false);
  // TODO
  const isStranger = true;
  const [showStrangerTip, setShowStrangerTip] = useState(true);
  const { list, init, sendMessage, pin, mute, exit } = useChannel(`${channelUuid}`);
  console.log(file);
  useEffectOnce(() => {
    init();
  });

  // TODO photo

  const messageList: any = useMemo(() => {
    return list.map((item) => {
      return {
        id: item.id,
        // sendUuid: item.sendUuid, // TODO
        title: item.fromName,
        position: item.from === im.userInfo?.relationId ? 'right' : 'left', // TODO '5h7d6-liaaa-aaaaj-vgmya-cai'
        text: item.parsedContent,
        type: MessageTypeWeb[item.type],
        dateString: formatChatListTime(item.createAt),
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
        onClick: () => navigate('/profile'),
      },
      {
        key: state?.pin ? 'un-pin' : 'pin',
        leftIcon: <CustomSvg type={state?.pin ? 'UnPin' : 'Pin'} />,
        children: state?.pin ? 'Unpin' : 'Pin',
        onClick: () => pin(!state.pin),
      },
      {
        key: state?.muted ? 'un-mute' : 'mute',
        leftIcon: <CustomSvg type={state?.muted ? 'UnMute' : 'Mute'} />,
        children: state?.muted ? 'Unmute' : 'Mute',
        onClick: () => mute(!state?.muted),
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
    [exit, isStranger, mute, navigate, pin, state?.muted, state.pin],
  );
  const uploadProps = {
    className: 'chat-input-upload',
    showUploadList: false,
    accept: 'image/*',
    beforeUpload: async (paramFile: RcFile) => {
      setFile(paramFile);
      const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(paramFile);
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      setPreviewImage(src as string);
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

  // TODO
  const handleUpload = () => {
    // sendImage(file)
  };

  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={
            <div className="flex title-element">
              <Avatar letterItem={state?.letterItem} />
              <div className="name-text">{state?.title}</div>
              {state?.muted && <CustomSvg type="Mute" />}
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
          <div className="content flex-center">
            <CustomSvg type="AddContact" />
            <span className="text">Add Contact</span>
          </div>
          <CustomSvg type="Close2" onClick={() => setShowStrangerTip(false)} />
        </div>
      )}
      <div className="chat-box-content">
        <StyleProvider prefixCls="portkey">
          <MessageList referance={null} lockable dataSource={messageList} />
        </StyleProvider>
      </div>
      <div className="chat-box-footer">
        <StyleProvider prefixCls="portkey">
          <InputBar moreData={inputMorePopList} onSendMessage={sendMessage} />
        </StyleProvider>
      </div>
      <PhotoSendModal
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
