import { Popover } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
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
import { useHandleClickChatItem } from 'hooks/im';
import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { useWalletInfo } from 'store/Provider/hooks';
import { setBadge } from 'utils/FCM';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useReportFCMStatus } from 'hooks/useFCM';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TFindMoreLocationState } from 'types/router';
import { useJoinOfficialGroupTipModal } from 'hooks/useJoinOfficialGroupTip';
import './index.less';

export default function ChatList() {
  const navigate = useNavigateState<TFindMoreLocationState>();
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
  const reportFCMStatus = useReportFCMStatus();
  const { userInfo } = useWalletInfo();
  const handleClickChatItem = useHandleClickChatItem();
  const JoinOfficialGroupTip = useJoinOfficialGroupTipModal();
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
          navigate(`/setting/contacts/find-more`, { state: { previousPage: FromPageEnum.chatList } });
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

  const handlePin = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await pinChannel(`${chatItem.channelUuid}`, !chatItem.pin);
      } catch (e: any) {
        if (`${e?.code}` === PIN_LIMIT_EXCEED) {
          singleMessage.error('Pin limit exceeded');
        } else {
          singleMessage.error(`Failed to ${chatItem?.pin ? 'unpin' : 'pin'} chat`);
        }
        console.log('===handle pin error', e);
      }
    },
    [pinChannel],
  );
  const handleMute = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await muteChannel(`${chatItem.channelUuid}`, !chatItem.mute);
      } catch (e) {
        singleMessage.error(`Failed to ${chatItem.mute ? 'unmute' : 'mute'} chat`);
        console.log('===handle mute error', e);
      }
    },
    [muteChannel],
  );
  const handleDelete = useCallback(
    async (chatItem: IChatItemProps) => {
      try {
        await hideChannel(`${chatItem.channelUuid}`);
      } catch (e) {
        singleMessage.error('Failed to delete chat');
        console.log('===handle delete error', e);
      }
    },
    [hideChannel],
  );
  useEffectOnce(() => {
    initChannelList();
    JoinOfficialGroupTip();
  });

  useEffect(() => {
    reportFCMStatus();
    signalrFCM.signalr && setBadge({ value: unreadCount });
  }, [reportFCMStatus, unreadCount]);

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
              dataSource={chatList}
              myPortkeyId={userInfo?.userId}
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
