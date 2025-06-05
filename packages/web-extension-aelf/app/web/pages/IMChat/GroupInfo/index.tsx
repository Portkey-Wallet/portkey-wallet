import {
  useGroupChannelInfo,
  useLeaveChannel,
  useRelationId,
  useSendChannelMessage,
} from '@portkey-wallet/hooks/hooks-ca/im';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import { useParams } from 'react-router';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import Copy from 'components/Copy';
import ContactListDrawer from '../components/GroupShareDrawer';
import { LinkPortkeyPath } from '@portkey-wallet/constants/constants-ca/network';
import { useLoading } from 'store/Provider/hooks';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import singleMessage from 'utils/singleMessage';
import { useNavigateState } from 'hooks/router';
import { FromPageEnum, TViewContactLocationState, TWalletNameLocationState } from 'types/router';
import './index.less';

const GroupInfo = () => {
  const { channelUuid } = useParams();
  const leaveGroup = useLeaveChannel();
  const { relationId: myRelationId } = useRelationId();
  const [shareVisible, setShareVisible] = useState(false);
  const { groupInfo, isAdmin, refresh } = useGroupChannelInfo(`${channelUuid}`);
  const { sendMassMessage } = useSendChannelMessage();
  const shareLink = useMemo(() => LinkPortkeyPath.addGroup + channelUuid, [channelUuid]);
  const navigate = useNavigateState<TWalletNameLocationState | TViewContactLocationState>();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const handleLeaveGroup = useCallback(() => {
    CustomModalConfirm({
      content: t('Are you sure to leave this group?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await leaveGroup(`${channelUuid}`);
          navigate('/chat-list');
        } catch (e) {
          singleMessage.error('Failed to leave the group');
          console.log('===Failed to leave the group error', e);
        }
      },
    });
  }, [channelUuid, leaveGroup, navigate, t]);
  const handleGoProfile = useCallback(
    (item: ChannelMemberInfo) => {
      if (item.relationId === myRelationId) {
        navigate('/setting/wallet/wallet-name', { state: { previousPage: FromPageEnum.chatGroupInfo, channelUuid } });
      } else {
        navigate('/setting/contacts/view', {
          state: { relationId: item.relationId, previousPage: FromPageEnum.chatGroupInfo, channelUuid },
        });
      }
    },
    [myRelationId, navigate, channelUuid],
  );
  const handleSend = useCallback(
    async (params: ChannelMemberInfo[]) => {
      try {
        setLoading(true);
        const toRelationIds = params.map((m) => m.relationId || '');
        await sendMassMessage({ toRelationIds, content: shareLink });
      } catch (error) {
        console.log('share group to contacts error', error);
      } finally {
        setLoading(false);
        navigate('/chat-list');
      }
    },
    [navigate, sendMassMessage, setLoading, shareLink],
  );
  const handleRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (error) {
      console.log('===Failed to refresh error', error);
      singleMessage.error('Failed to fetch data');
    }
  }, [refresh]);
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="group-info-page flex-column-between">
      <CommonHeader
        className="group-info-header"
        title="Group Info"
        onLeftBack={() => navigate(`/chat-box-group/${channelUuid}`)}
      />
      <div className="group-info-body flex-column-between">
        <div className="group-info-container">
          <div className="info-basic flex-center">
            <div className="flex-column-center">
              <Avatar isGroupAvatar={true} src={groupInfo?.icon} avatarSize="large" />
              <div className="group-name">{groupInfo?.name || ''}</div>
              <div className="group-members">
                {groupInfo?.totalCount}
                {(groupInfo?.totalCount ?? 0) > 1 ? ' members' : ' member'}
              </div>
            </div>
          </div>
          <div className="info-share flex-row-between">
            <div className="share-link flex-column">
              <div className="share-link-title">Invite Link</div>
              <div className="share-link-content flex-between">
                <div className="link-content" onClick={() => setShareVisible(true)}>
                  {shareLink}
                </div>
                <div className="link-icon flex-row-center">
                  <Copy iconType="Copy4" toCopy={shareLink} />
                  <CustomSvg type="QRCode2" onClick={() => navigate(`/chat-group-info/${channelUuid}/share`)} />
                </div>
              </div>
            </div>
          </div>
          <div className="info-operation">
            <div
              className="add-member op-member flex"
              onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/add`)}>
              <CustomSvg type="AddMem" className="flex-center" />
              Add Members
            </div>
            {isAdmin && (
              <div
                className={clsx([
                  'remove-member',
                  'op-member',
                  'flex',
                  (groupInfo?.members || []).length === 1 && 'remove-disable',
                ])}
                onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/remove`)}>
                <CustomSvg type="RemoveMem" className="flex-center" />
                <span className="remove-members-text">Remove Members</span>
              </div>
            )}
          </div>
          <div className="info-members">
            {(groupInfo?.members || []).slice(0, 4).map(
              (m) => (
                <div className="member-item flex-row-between" key={m.relationId} onClick={() => handleGoProfile(m)}>
                  <div className="flex member-basic">
                    <Avatar src={m.avatar} letter={m.name.slice(0, 1).toUpperCase()} avatarSize="small" />
                    <div className="member-name">{m.name}</div>
                  </div>
                  {m.isAdmin && <div className="admin-icon flex-center">Owner</div>}
                </div>
              ),
              [],
            )}
            {(groupInfo?.members || []).length > 4 && (
              <div
                className={clsx(['view-more-members', 'flex-center', isAdmin && 'is-admin'])}
                onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list`)}>
                View More Members
                <CustomSvg type="LeftArrow" className="flex-center" />
              </div>
            )}
          </div>
          {isAdmin && (
            <div
              className="info-transfer flex-row-between"
              onClick={() => navigate(`/chat-group-info/${channelUuid}/transfer-ownership`)}>
              Transfer Group Ownership
              <CustomSvg type="LeftArrow" className="flex-center" />
            </div>
          )}
        </div>
        <div className="group-info-footer flex-center">
          {isAdmin ? (
            <Button className="edit-group-btn op-btn" onClick={() => navigate(`/chat-group-info/${channelUuid}/edit`)}>
              Edit
            </Button>
          ) : (
            <Button type="default" onClick={handleLeaveGroup} className="leave-group-btn op-btn">
              Leave Group
            </Button>
          )}
        </div>
      </div>
      <ContactListDrawer
        destroyOnClose
        open={shareVisible}
        onConfirm={handleSend}
        onClose={() => setShareVisible(false)}
      />
    </div>
  );
};
export default GroupInfo;
