import { useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { mockMembers } from '../mock';

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
  return (
    <div className="group-info-page flex-column">
      <SettingHeader
        title="Group Info"
        leftCallBack={() => navigate(`/chat-box-group/${channelUuid}`)}
        rightElement={<CustomSvg type="Close2" onClick={() => navigate(`/chat-box-group/${channelUuid}`)} />}
      />
      <div className="group-info-container">
        <div className="info-basic flex">
          <CustomSvg type="Close2" onClick={() => navigate(-1)} />
          <div>
            <div className="group-name">Portkey Official Group</div>
            <div className="group-members">120 members</div>
          </div>
        </div>
        <div className="info-operation">
          <div onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/add`)}>add Members</div>
          {isAdmin && <div onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list/remove`)}>remove</div>}
        </div>
        <div className="info-members">
          {mockMembers.slice(0, 6).map(
            (item) => (
              <div key={item.id}>{item.name}</div>
            ),
            [],
          )}
          {mockMembers.length > 6 && (
            <div onClick={() => navigate(`/chat-group-info/${channelUuid}/member-list`)}>View more Members</div>
          )}
        </div>
        {isAdmin && (
          <div className="info-transfer" onClick={() => navigate(`/chat-group-info/${channelUuid}/transfer-ownership`)}>
            Transfer Ownership
          </div>
        )}
        <div className="leave-group">Leave Group</div>
      </div>
      <div className="group-info-footer flex-center">
        <Button onClick={() => navigate(`/chat-group-info/${channelUuid}/edit`)}>Edit</Button>
      </div>
    </div>
  );
};
export default GroupInfo;
