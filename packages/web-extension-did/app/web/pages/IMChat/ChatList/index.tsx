import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatList as ChannelList, IChatItemProps, PopoverMenuList, StyleProvider } from '@portkey-wallet/im-ui-web';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import {
  useChannelList,
  usePinChannel,
  useMuteChannel,
  useHideChannel,
  useUnreadCount,
  useBlockAndReport,
} from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffectOnce } from 'react-use';
import { useHandleClickChatItem } from 'hooks/im';
import { PIN_LIMIT_EXCEED } from '@portkey-wallet/constants/constants-ca/chat';
import { setBadge } from 'utils/FCM';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useReportFCMStatus } from 'hooks/useFCM';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TFindMoreLocationState } from 'types/router';
import { useJoinOfficialGroupTipModal } from 'hooks/useJoinOfficialGroupTip';
// import InviteGuideList from 'pages/components/InviteGuideList';
import OfficialGroupGuide from 'pages/components/OfficialGroupGuide';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import BottomBar from 'pages/components/BottomBar';
import clsx from 'clsx';
import './index.less';
import useGAReport from 'hooks/useGAReport';

export default function ChatList() {
  const navigate = useNavigateState<TFindMoreLocationState>();
  const { t } = useTranslation();
  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();
  const { list: chatList, init, next: nextChannelList, hasNext: hasNextChannelList } = useChannelList();
  const unreadCount = useUnreadCount();
  const reportFCMStatus = useReportFCMStatus();
  const userInfo = useCurrentUserInfo();
  const handleClickChatItem = useHandleClickChatItem();
  const joinOfficialGroupTip = useJoinOfficialGroupTipModal();
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const { fetchAndSetBlockList } = useBlockAndReport();
  const hasPinedMsg = useMemo(() => chatList.some((chat) => chat.pin), [chatList]);
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

  useEffectOnce(() => {
    fetchAndSetBlockList();
  });

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

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport('ChatList');
  });

  const initChannelList = useCallback(async () => {
    await init();
    endReport('ChatList');
    setShowGuide(true);
  }, [endReport, init]);
  useEffectOnce(() => {
    initChannelList();
    joinOfficialGroupTip();
  });

  useEffect(() => {
    reportFCMStatus();
    signalrFCM.signalr && setBadge({ value: unreadCount });
  }, [reportFCMStatus, unreadCount]);

  return (
    <div className="chat-list-page flex-column">
      <CommonHeader
        className={clsx('chat-list-top', hasPinedMsg && 'has-pined-msg')}
        title={t('Chats')}
        rightElementList={[
          {
            customSvgType: 'CircleSearch',
            onClick: () => navigate('/chat-list-search'),
          },
          {
            customSvgType: 'CircleAdd',
            popoverProps: {
              overlayClassName: 'chat-list-popover',
              placement: 'bottom',
              trigger: 'click',
              showArrow: false,
              content: <PopoverMenuList data={popList} />,
            },
          },
        ]}
      />
      <div className="chat-list-content flex-1">
        {showGuide && chatList.length === 0 && (
          <div className="flex-column">
            {/* <InviteGuideList /> */}
            <OfficialGroupGuide />
          </div>
        )}
        {chatList.length !== 0 && (
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
      <BottomBar />
    </div>
  );
}
