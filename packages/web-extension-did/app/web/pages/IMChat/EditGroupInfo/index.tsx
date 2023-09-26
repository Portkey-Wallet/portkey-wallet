import { useDisbandChannel, useGroupChannelInfo, useUpdateChannelName } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button, Form, Input, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import './index.less';

const { Item: FormItem } = Form;
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
export type ValidData = {
  validateStatus: ValidateStatus;
  errorMsg: string;
};
export interface IGroupInfoProps {
  groupId: string;
}
export default function EditGroupInfo() {
  const [form] = Form.useForm();
  const { channelUuid } = useParams();
  const { groupInfo } = useGroupChannelInfo(`${channelUuid}`);
  const disbandGroup = useDisbandChannel(`${channelUuid}`);
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [name, setName] = useState<string>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const updateChannelName = useUpdateChannelName();
  const handleInputValueChange = useCallback(
    (v: string) => {
      setValidName({ validateStatus: '', errorMsg: '' });
      if (!v.trim()) {
        setDisabled(true);
      } else {
        setName(v);
        setDisabled(v === groupInfo?.name);
      }
    },
    [groupInfo?.name],
  );
  const onFinish = useCallback(async () => {
    try {
      await updateChannelName(`${channelUuid}`, `${name?.trim()}`);
      message.success('Group name update');
      navigate(-1);
    } catch (error) {
      message.error('Failed to update group name');
      console.log('===Failed to update group name', error);
    }
  }, [channelUuid, name, navigate, updateChannelName]);
  const handleDisband = useCallback(() => {
    CustomModalConfirm({
      content: t('Are you sure to leave and delete this group?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          await disbandGroup();
          navigate(`/chat-list`);
          message.success('Group deleted');
        } catch (e) {
          message.error('Failed to disband group');
          console.log('===Failed to disband group', e);
        }
      },
    });
  }, [disbandGroup, navigate, t]);
  return (
    <div className="group-info-edit-page flex-column">
      <div className="group-info-edit-header">
        <SettingHeader
          title="Edit Group"
          leftCallBack={() => navigate(`/chat-group-info/${channelUuid}`)}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate(`/chat-group-info/${channelUuid}`)} />}
        />
      </div>
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        className="flex-column-between edit-group-info-form"
        requiredMark={false}
        initialValues={{ name: groupInfo?.name }}
        onFinish={onFinish}>
        <div className="form-content">
          <FormItem name="name" label="Group Name" validateStatus={validName.validateStatus} help={validName.errorMsg}>
            <Input
              value={name}
              placeholder="Enter name"
              onChange={(e) => handleInputValueChange(e.target.value)}
              maxLength={40}
            />
          </FormItem>
        </div>
        <div className="flex form-footer">
          <Button danger onClick={handleDisband}>
            Leave and Delete
          </Button>
          <Button htmlType="submit" type="primary" disabled={disabled}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
