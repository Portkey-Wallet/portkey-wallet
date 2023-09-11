import { useRelationId } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button, Form, Input, Modal, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [validName, setValidName] = useState<ValidData>({ validateStatus: '', errorMsg: '' });
  const [name, setName] = useState('');
  const { t } = useTranslation();
  const { channelUuid } = useParams();
  console.log(channelUuid);
  const relationId = useRelationId();
  console.log('relationId', relationId);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const handleInputValueChange = useCallback((v: string) => {
    setValidName({ validateStatus: '', errorMsg: '' });
    if (!v) {
      setDisabled(true);
    } else {
      setName(v);
      setDisabled(false);
    }
  }, []);
  const onFinish = useCallback(() => {
    // TODO
  }, []);
  const handleDisband = useCallback(() => {
    return Modal.confirm({
      width: 320,
      content: t('Disband the group?'),
      className: 'disband-group-modal',
      autoFocusButton: null,
      icon: null,
      centered: true,
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: async () => {
        try {
          //TODO await disband();
          navigate(`/chat-list`);
          message.success('group disbanded');
        } catch (e) {
          message.error('Failed to disband group');
          console.log('===Failed to disband group', e);
        }
      },
    });
  }, [navigate, t]);
  return (
    <div className="group-info-edit-page flex-column">
      <SettingHeader
        title="Edit Group"
        leftCallBack={() => navigate(`/chat-group-info/${channelUuid}`)}
        rightElement={<CustomSvg type="Close2" onClick={() => navigate(`/chat-group-info/${channelUuid}`)} />}
      />
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        className="flex-column add-contact-form"
        // initialValues={}
        requiredMark={false}
        onFinish={onFinish}>
        <div className="form-content">
          <FormItem name="name" label="Group Name" validateStatus={validName.validateStatus} help={validName.errorMsg}>
            <Input
              value={name}
              placeholder="Enter name"
              onChange={(e) => handleInputValueChange(e.target.value)}
              maxLength={16}
            />
          </FormItem>
        </div>
        <div className="flex form-btn-edit">
          <Button danger onClick={handleDisband}>
            Disband
          </Button>
          <Button htmlType="submit" type="primary" disabled={disabled}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
