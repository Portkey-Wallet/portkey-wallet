import { useGroupChannelInfo, useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button, Modal, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

export interface IGroupInfoProps {
  groupId: string;
}
const GroupInfo = () => {
  const { channelUuid } = useParams();
  const { groupInfo, isAdmin } = useGroupChannelInfo(`${channelUuid}`);
  const memberLen = useMemo(
    () => (typeof groupInfo?.members.length === 'number' ? groupInfo?.members.length : 0),
    [groupInfo?.members.length],
  );
  console.log('groupInfo', groupInfo);
  const relationId = useRelationId();
  console.log('relationId', relationId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLeaveGroup = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Leave the group?'),
      className: 'leave-group-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Confirm'),
      cancelText: t('Cancel'),
      onOk: async () => {
        try {
          // TODO await leave();
          navigate('/chat-list');
        } catch (e) {
          message.error('Failed to leave the group');
          console.log('===Failed to leave the group error', e);
        }
      },
    });
  }, [navigate, t]);
  return (
    <div className="group-info-page flex-column">
      <div className="group-info-header">
        <SettingHeader
          title="Group Info"
          leftCallBack={() => navigate(`/chat-box-group/${channelUuid}`)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(`/chat-box-group/${channelUuid}`)} />}
        />
      </div>
      <div className="group-info-container">
        <div className="info-basic flex-center">
          <div className="flex-column-center">
            <div className="group-icon flex-center">
              <CustomSvg type="GroupAvatar" />
            </div>
            <div className="group-name">{groupInfo?.name}</div>
            <div className="group-members">
              {memberLen}
              {memberLen > 1 ? ' members' : ' member'}
            </div>
          </div>
        </div>
        <div className="info-operation">
          <div
            className="add-member op-member flex"
            onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/add`)}>
            <CustomSvg type="AddMem" className="flex-center" />
            add Members
          </div>
          {isAdmin && (
            <div
              className="remove-member op-member flex"
              onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/remove`)}>
              <CustomSvg type="RemoveMem" className="flex-center" />
              remove
            </div>
          )}
        </div>
        <div className="info-members">
          {(groupInfo?.members || []).slice(0, 6).map(
            (m) => (
              <div className="member-item flex-between" key={m.relationId}>
                <div className="flex member-basic">
                  <Avatar width={28} height={28} letter={m.name.slice(0, 1)} />
                  <div className="member-name">{m.name}</div>
                </div>
                {m.isAdmin && <div className="admin-icon flex-center">Owner</div>}
              </div>
              // <div key={item.relationId} className="member-item flex">
              //   <Avatar letter={item.name?.slice(0, 1)} width={28} height={28} />
              //   {item.name}
              // </div>
            ),
            [],
          )}
          {/* {mockMembers.length > 6 && ( */}
          <div
            className="view-more-members flex-center"
            onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list`)}>
            View more Members
            <CustomSvg type="LeftArrow" className="flex-center" />
          </div>
          {/* )} */}
        </div>
        {isAdmin && (
          <div
            className="info-transfer flex-between"
            onClick={() => navigate(`/chat-group-info/${channelUuid}/transfer-ownership`)}>
            Transfer Ownership
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
  );
};
export default GroupInfo;
