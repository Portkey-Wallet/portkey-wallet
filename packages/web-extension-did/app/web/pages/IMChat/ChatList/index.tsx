import { Popover, message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChatList as ChannelList, IChatItemProps, PopoverMenuList, StyleProvider } from '@portkey-wallet/im-ui-web';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import {
  useChannelList,
  usePinChannel,
  useMuteChannel,
  useHideChannel,
  useUnreadCount,
} from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { formatChatListTime } from '@portkey-wallet/utils/chat';
import { ChannelItem, MessageTypeEnum, ParsedRedPackage } from '@portkey-wallet/im';
import { useHandleClickChatItem } from 'hooks/im';
import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { useWalletInfo } from 'store/Provider/hooks';
import { setBadge } from 'utils/FCM';
import { AppStatusUnit } from '@portkey-wallet/socket/socket-fcm/types';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { formatChatListSubTitle } from '../utils';
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
  const unreadCount = useUnreadCount();
  const { userInfo } = useWalletInfo();
  const formatIsOwner = useCallback(
    (item: ChannelItem) => {
      const _type = item.lastMessageType;
      let isOwner = false;
      if (_type === MessageTypeEnum.REDPACKAGE_CARD) {
        const senderId = (item.lastMessageContent as ParsedRedPackage).data?.senderId;
        isOwner = senderId === userInfo?.userId;
      }
      return isOwner;
    },
    [userInfo?.userId],
  );
  const popList = useMemo(
    () => [
      {
        key: 'new-chat',
        leftIcon: <CustomSvg type="NewChat" />,
        children: 'New Chat',
        onClick: () => {
          navigate('/new-chat');
        },
      },
      {
        key: 'create-group',
        leftIcon: <CustomSvg type="CreateGroup" />,
        children: 'Create Group',
        onClick: () => {
          navigate('/create-chat-group');
        },
      },
      {
        key: 'find-more',
        leftIcon: <CustomSvg type="AddMorePeople" />,
        children: 'Find People',
        onClick: () => {
          navigate(`/setting/contacts/find-more`, { state: { from: 'chat-list' } });
        },
      },
    ],
    [navigate],
  );
  const headerRightEle = useMemo(
    () => (
      <div className="flex-center right-element">
        <CustomSvg type="Search" onClick={() => navigate('/chat-list-search')} />
        <Popover
          overlayClassName="chat-list-popover"
          placement="bottom"
          trigger="click"
          showArrow={false}
          content={<PopoverMenuList data={popList} />}>
          <CustomSvg type="AddCircle" />
        </Popover>
        <CustomSvg type="Close2" onClick={() => navigate('/')} />
      </div>
    ),
    [popList, navigate],
  );
  const transChatList: IChatItemProps[] = useMemo(() => {
    return chatList.map((item) => {
      return {
        id: item.channelUuid,
        letter: item.displayName.substring(0, 1).toUpperCase(),
        title: item.displayName,
        subtitle: formatChatListSubTitle(item),
        dateString: formatChatListTime(item.lastPostAt),
        muted: item.mute,
        pin: item.pin,
        unread: item.unreadMessageCount,
        channelType: item?.channelType,
        status: item.status,
        avatar: item.channelIcon,
        isOwner: formatIsOwner(item),
        lastMessageType: item.lastMessageType || 'TEXT',
      };
    });
  }, [chatList, formatIsOwner]);

  const handleClickChatItem = useHandleClickChatItem();

  const handlePin = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await pinChannel(`${chatItem.id}`, !chatItem.pin);
      } catch (e: any) {
        if (`${e?.code}` === PIN_LIMIT_EXCEED) {
          message.error('Pin limit exceeded');
        } else {
          message.error(`Failed to ${chatItem?.pin ? 'unpin' : 'pin'} chat`);
        }
        console.log('===handle pin error', e);
      }
    },
    [pinChannel],
  );
  const handleMute = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await muteChannel(`${chatItem.id}`, !chatItem.muted);
      } catch (e) {
        message.error(`Failed to ${chatItem.muted ? 'unmute' : 'mute'} chat`);
        console.log('===handle mute error', e);
      }
    },
    [muteChannel],
  );
  const handleDelete = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await hideChannel(`${chatItem.id}`);
      } catch (e) {
        message.error('Failed to delete chat');
        console.log('===handle delete error', e);
      }
    },
    [hideChannel],
  );
  useEffectOnce(() => {
    initChannelList();
  });

  useEffect(() => {
    signalrFCM.reportAppStatus(AppStatusUnit.FOREGROUND, unreadCount);
    signalrFCM.signalr && setBadge({ value: unreadCount });
  }, [unreadCount]);

  return (
    <div className="chat-list-page">
      <div className="chat-list-top">
        <SettingHeader title={t('Chats')} leftCallBack={() => navigate('/')} rightElement={headerRightEle} />
      </div>
      <div className="chat-list-content">
        {chatList.length === 0 ? (
          <div className="no-message flex-column-center">
            <CustomSvg type="Message" />
            <div>No message</div>
          </div>
        ) : (
          <StyleProvider prefixCls="portkey">
            <ChannelList
              id="channel-list"
              dataSource={transChatList}
              onClickPin={handlePin}
              onClickMute={handleMute}
              onClickDelete={handleDelete}
              onClick={handleClickChatItem}
              hasMore={hasNextChannelList}
              loadMore={nextChannelList}
            />
          </StyleProvider>
        )}
      </div>
    </div>
  );
}
