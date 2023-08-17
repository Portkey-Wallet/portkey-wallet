import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Popover } from 'antd';
import { PopoverMenuList, MessageList, InputBar } from '@portkey-wallet/im-ui-web';
// import PhotoSendModal from './components/PhotoSendModal';
import { Avatar } from '@portkey-wallet/im-ui-web';
import './index.less';
import { useChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { formatChatListTime } from '@portkey-wallet/utils/chat';
import im from '@portkey-wallet/im';

enum MessageTypeWeb {
  'SYS' = 'system',
  'TEXT' = 'text',
  'CARD' = '',
  'IMAGE' = 'photo',
  'ANNOUNCEMENT' = '',
  'BATCH_TRANSFER' = '',
}

export default function Session() {
  const navigate = useNavigate();
  // const [messageList, setMessageList] = useState([]);
  // const [showStrangerTip, setShowStrangerTip] = useState(true);
  // const [showBookmark, setShowBookmark] = useState(false);
  // TODO
  const isStranger = true;

  const { list, init } = useChannel('e7554d14bf7d4a12a40698138f7a7d8c');
  // e7554d14bf7d4a12a40698138f7a7d8c
  // 1689b154c49946a0a4324b339b83b194

  useEffectOnce(() => {
    init();
    // sendMessage('hello', 'TEXT');
  });

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

  // const menuListData = useMemo(
  //   () => [
  //     {
  //       key: 'profile',
  //       // LeftIcon: <div>L</div>,
  //       // rightIcon: '>',
  //       children: 'profile',
  //       // onClick?: () => {};
  //       height: 32,
  //     },
  //     {
  //       key: 'mute',
  //       // LeftIcon: <div>O</div>,
  //       // rightIcon: '>',
  //       children: 'mute',
  //       // onClick?: () => {};
  //       height: 32,
  //     },
  //     {
  //       key: 'pin',
  //       // LeftIcon: <div>V</div>,
  //       // rightIcon: '>',
  //       children: 'pin',
  //       // onClick?: () => {};
  //       height: 32,
  //     },
  //     {
  //       key: 'delete',
  //       // LeftIcon: <div>V</div>,
  //       // rightIcon: '>',
  //       children: 'delete',
  //       // onClick?: () => {};
  //       height: 32,
  //     },
  //   ],
  //   [],
  // );

  // const handleAddContact = useCallback(() => {
  //   // TODO
  // }, []);
  // const showTopBarTip = useMemo(() => {
  //   if (isStranger && showStrangerTip) {
  //     return {
  //       center: (
  //         <div className="add-contact" onClick={handleAddContact}>
  //           ADD CONTACT
  //         </div>
  //       ),
  //       right: (
  //         <div className="close-icon" onClick={() => setShowStrangerTip(false)}>
  //           X
  //         </div>
  //       ),
  //       className: 'add-contact-tip',
  //     };
  //   } else {
  //     return undefined;
  //   }
  // }, [handleAddContact, isStranger, showStrangerTip]);

  // const [curUrl, setCurUrl] = useState('');
  // const onCancel = () => {
  //   // TODO
  // };
  const onConfirm = () => {
    // TODO
  };

  // TODO
  const contactName = useMemo(() => 'contactTestName', []);
  // TODO
  const isMute = true;
  // TODO
  const popoverList = useMemo(
    () => [
      {
        key: 'profile',
        leftIcon: <CustomSvg type="Profile" />,
        children: 'Profile',
        onClick: onConfirm,
      },
      {
        key: 'pin',
        // TODO isPin
        leftIcon: <CustomSvg type="Pin" />,
        children: 'Pin',
        onClick: onConfirm,
      },
      {
        key: 'un-pin',
        // TODO isPin
        leftIcon: <CustomSvg type="UnPin" />,
        children: 'Unpin',
        onClick: onConfirm,
      },
      {
        key: 'mute',
        // TODO isPin
        leftIcon: <CustomSvg type="Mute" />,
        children: 'Mute',
        onClick: onConfirm,
      },
      {
        key: 'un-mute',
        // TODO isPin
        leftIcon: <CustomSvg type="UnMute" />,
        children: 'Unmute',
        onClick: onConfirm,
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: onConfirm,
      },
      // TODO isStranger
      {
        key: 'add-contact',
        leftIcon: <CustomSvg type="ChatAddContact" />,
        children: 'Add Contact',
        onClick: onConfirm,
      },
    ],
    [],
  );
  const onClick = () => {
    // TODO
  };
  //
  const morePopoverList = [
    {
      key: 'album',
      leftIcon: <CustomSvg type="Album" />,
      children: 'Picture',
      onClick: onClick,
    },
    {
      key: 'bookmark',
      leftIcon: <CustomSvg type="Bookmark" />,
      children: 'Bookmark',
      onClick: onClick,
    },
  ];

  return (
    <div className="chat-box-page flex-column">
      <div className="chat-box-top">
        <SettingHeader
          title={
            <div className="flex title-element">
              <Avatar letterItem={contactName?.slice(0, 1).toUpperCase()} />
              <div className="name-text">{contactName}</div>
              {isMute && <CustomSvg type="Mute" />}
            </div>
          }
          leftCallBack={() => navigate('/chat-list')}
          rightElement={
            <div className="flex-center right-element">
              <Popover
                overlayClassName="chat-box-popover"
                placement="bottom"
                trigger="click"
                showArrow={false}
                content={<PopoverMenuList data={popoverList} />}>
                <CustomSvg type="More" />
              </Popover>
              <CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />
            </div>
          }
        />
      </div>
      {isStranger && (
        <div className="add-contact-tip flex-center">
          <CustomSvg type="AddContact" />
          Add Contact
        </div>
      )}
      <div className="chat-box-content">
        <MessageList referance={null} lockable dataSource={messageList} />
      </div>
      <div className="chat-box-footer">
        <InputBar moreData={morePopoverList} />
      </div>
      {/* <Button onClick={() => setCurUrl('https://avatars.githubusercontent.com/u/80540635?v=4')}>ShowImage</Button>
  {curUrl && <PhotoPreview uri={curUrl} onClose={() => setCurUrl('')} />} */}
      {/* <CustomChat dataSource={[]} lazyLoadingImage="false" id="id" /> */}
      {/* <PhotoSendModal
    open={true}
    url="https://avatars.githubusercontent.com/u/80540635?v=4"
    onCancel={onCancel}
    onConfirm={onConfirm}
  /> */}
      {/* <BookmarkListDrawer onClick={onCancel} /> */}
    </div>
  );
}
