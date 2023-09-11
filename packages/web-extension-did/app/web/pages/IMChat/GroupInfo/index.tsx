import { useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button, Modal, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { mockMembers } from '../mock';
import { Avatar } from '@portkey-wallet/im-ui-web';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

export interface IGroupInfoProps {
  groupId: string;
}
const GroupInfo = () => {
  const { channelUuid } = useParams();
  console.log('id', channelUuid);
  const relationId = useRelationId();
  console.log('relationId', relationId);
  const navigate = useNavigate();
  // TODO
  const isAdmin = true;
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
              <CustomSvg type="AddMem" />
            </div>
            <div className="group-name">Portkey Official Group</div>
            <div className="group-members">120 members</div>
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
          {mockMembers.slice(0, 6).map(
            (item) => (
              <div key={item.id} className="member-item flex">
                <Avatar letter={item.name?.slice(0, 1)} width={28} height={28} />
                {item.name}
              </div>
            ),
            [],
          )}
          {mockMembers.length > 6 && (
            <div
              className="view-more-members flex-center"
              onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list`)}>
              View more Members
              <CustomSvg type="LeftArrow" className="flex-center" />
            </div>
          )}
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
