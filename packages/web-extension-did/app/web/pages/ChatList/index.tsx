import { Popover } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChatList as ChannelList, PopoverMenuList } from '@portkey-wallet/im-ui-web';

import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import './index.less';

// TODO
type IChatItemProps = any;
const mockChatList: IChatItemProps[] = [
  {
    id: 'id1',
    avatar: '',
    letterItem: 'E',
    alt: 'p',
    title: 'EmreEmreEmreEmreEmreEmreEmreEmreEmre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    showMute: true,
    muted: true,
    pin: true,
    unread: 0,
    // customStatusComponents: [() => UnreadTip({ unread: 10 })],
  },
  {
    id: 'id2',
    avatar: '',
    letterItem: 'B',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    showMute: true,
    muted: true,
    unread: 1,
    // customStatusComponents: [() => UnreadTip({ unread: 10 })],
  },
  {
    id: 'id3',
    avatar: '',
    letterItem: 'C',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    muted: true,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99+',
    unread: 99,
  },
  {
    id: 'id4',
    avatar: 'p',
    letterItem: 'P',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    muted: true,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '9',
    unread: 100,
  },
  {
    id: 'id5',
    avatar: 'p',
    letterItem: 'E',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    muted: false,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99',
    unread: 1,
  },
  {
    id: 'id6',
    avatar: 'p',
    letterItem: '2',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    date: new Date(),
    muted: false,
    showMute: true,
    // customStatusComponents: [() => UnreadTip({ unread: 101 })],
    unread: 99,
  },
  {
    id: 'id7',
    avatar: 'p',
    letterItem: 'd',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    // date: new Date(),
    date: undefined,
    muted: false,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99+',
    unread: 100,
  },
  {
    id: 'id8',
    avatar: 'p',
    letterItem: 'd',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    // date: new Date(),
    date: undefined,
    muted: false,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99+',
    unread: 100,
  },
  {
    id: 'id9',
    avatar: 'p',
    letterItem: 'd',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    // date: new Date(),
    date: undefined,
    muted: false,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99+',
    unread: 100,
  },
  {
    id: 'id10',
    avatar: 'p',
    letterItem: 'd',
    alt: 'p',
    title: 'Emre',
    subtitle: 'What are you doing ?',
    // date: new Date(),
    date: undefined,
    muted: false,
    showMute: true,
    showVideoCall: true,
    statusColor: 'red',
    statusColorType: 'badge',
    statusText: '99+',
    unread: 100,
  },
];

export default function ChatList() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [chatList, setChatList] = useState(mockChatList);
  // TODO
  const hasMore = false;

  const onConfirm = () => {
    // TODO
  };

  const popoverList = useMemo(
    () => [
      {
        key: 'newChat',
        leftIcon: <CustomSvg type="NewChat" />,
        children: 'New Chat',
        onClick: () => navigate('/new-chat'),
      },
      {
        key: 'add-contact',
        leftIcon: <CustomSvg type="ChatAddContact" />,
        children: 'Add Contact',
        onClick: onConfirm,
      },
    ],
    [navigate],
  );
  const rightElement = useMemo(
    () => (
      <div className="flex-center right-element">
        <CustomSvg type="Search" onClick={() => navigate('/chat-list-search')} />
        <Popover
          overlayClassName="chat-box-popover"
          placement="bottom"
          trigger="click"
          showArrow={false}
          content={<PopoverMenuList data={popoverList} />}>
          <CustomSvg type="AddCircle" />
        </Popover>
        <CustomSvg type="Close2" onClick={() => navigate('/')} />
      </div>
    ),
    [navigate, popoverList],
  );

  const handleLoadMore = async () => {
    return Promise.resolve().then(() => {
      // TODO
      setChatList([...chatList, ...mockChatList]);
    });
  };

  return (
    <div className="chat-list-page">
      <div className="chat-list-top">
        <SettingHeader title={t('Chats')} leftCallBack={() => navigate('/')} rightElement={rightElement} />
      </div>
      <div className="chat-list-content">
        {chatList.length === 0 ? (
          <div className="no-message flex-column-center">
            <CustomSvg type="Message" />
            <div>No Message</div>
          </div>
        ) : (
          <ChannelList
            dataSource={mockChatList}
            id="channel-list"
            onClick={() => navigate('/chat-box')}
            hasMore={hasMore}
            loadMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
}
