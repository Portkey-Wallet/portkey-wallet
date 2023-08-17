import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { Popover } from 'antd';
import { PopoverMenuList, MessageList, InputBar } from '@portkey-wallet/im-ui-web';
// import PhotoSendModal from './components/PhotoSendModal';
import { Avatar } from '@portkey-wallet/im-ui-web';
import './index.less';

const mockTemp: any = [
  {
    id: 'id',
    title: '',
    position: 'right',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'text',
    date: new Date(),
  },
  {
    id: 'id',
    title: '',
    position: 'left',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'text',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'bookmark',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'left',
    data: {
      id: 'img1',
      uri: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'alt',
      status: {
        download: true,
      },
    },
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'photo',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    data: {
      id: 'img2',
      uri: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'alt',
      status: {
        download: true,
      },
    },
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'photo',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    text: '07-30',
    type: 'system',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'text',
    date: new Date(),
    // focus: false,
    // titleColor: '',
    // retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'left',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'text',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'bookmark',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'left',
    data: {
      id: 'img3',
      uri: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'alt',
      status: {
        download: true,
      },
    },
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'photo',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
  {
    id: 'id',
    title: '',
    position: 'right',
    data: {
      id: 'img4',
      uri: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'alt',
      status: {
        download: true,
      },
    },
    text: 'Hi, Do you want to buy or sell some tokens? Buy or sell some tokens?',
    type: 'photo',
    date: new Date(),
    focus: false,
    titleColor: '',
    notch: false,
    retracted: false,
  },
];

export default function Session() {
  const navigate = useNavigate();
  // const [messageList, setMessageList] = useState([]);
  // const [showStrangerTip, setShowStrangerTip] = useState(true);
  // const [showBookmark, setShowBookmark] = useState(false);
  // TODO
  const isStranger = true;

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
        <MessageList referance={null} lockable dataSource={mockTemp} />
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
