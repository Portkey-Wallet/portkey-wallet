import { Popover } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChatList as ChannelList, PopoverMenuList } from '@portkey-wallet/im-ui-web';

import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useChannelList, usePinChannel, useMuteChannel, useHideChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { formatChatListTime } from '@portkey-wallet/utils/chat';
import './index.less';

export default function ChatList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const {
    list: chatList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const onConfirm = () => {
    // TODO
  };
  const popList = useMemo(
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
          content={<PopoverMenuList data={popList} />}>
          <CustomSvg type="AddCircle" />
        </Popover>
        <CustomSvg type="Close2" onClick={() => navigate('/')} />
      </div>
    ),
    [navigate, popList],
  );

  const transChatList = useMemo(() => {
    return chatList.map((item) => {
      return {
        id: item.channelUuid,
        letterItem: item.displayName.substring(0, 1).toUpperCase(),
        title: item.displayName,
        subtitle: item.lastMessageContent,
        dateString: formatChatListTime(item.lastPostAt),
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
            id="channel-list"
            dataSource={transChatList}
            onClickPin={(chatItem) => pinChannel(`${chatItem.id}`, !chatItem.pin)}
            onClickMute={(chatItem) => muteChannel(`${chatItem.id}`, !chatItem.muted)}
            onClickDelete={(chatItem) => hideChannel(`${chatItem.id}`)}
            onClick={(chatItem) => navigate(`/chat-box/${chatItem.id}`, { state: chatItem })}
            hasMore={hasNextChannelList}
            loadMore={nextChannelList}
          />
        )}
      </div>
    </div>
  );
}
