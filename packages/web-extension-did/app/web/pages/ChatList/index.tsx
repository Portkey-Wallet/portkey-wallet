import { Popover } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChatList as ChannelList, PopoverMenuList } from '@portkey-wallet/im-ui-web';

import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import './index.less';
import { useChannelList } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { formatChatListTime } from '@portkey-wallet/utils/chat';

export default function ChatList() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    list: chatList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

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

  const transChatList = useMemo(() => {
    return chatList.map((item) => {
      return {
        id: item.channelUuid,
        avatar: '',
        letterItem: item.displayName.substring(0, 1).toLocaleUpperCase(),
        alt: 'p',
        title: item.displayName,
        subtitle: item.lastMessageContent,
        dateString: formatChatListTime(item.lastPostAt),
        showMute: true,
        muted: item.mute,
        pin: item.pin,
        unread: item.unreadMessageCount,
      };
    });
  }, [chatList]);

  useEffectOnce(() => {
    initChannelList();
  });

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
            dataSource={transChatList}
            id="channel-list"
            onClick={() => navigate('/chat-box')}
            hasMore={hasNextChannelList}
            loadMore={nextChannelList}
          />
        )}
      </div>
    </div>
  );
}
