import { useDisbandChannel, useGroupChannelInfo, useUpdateChannelInfo } from '@portkey-wallet/hooks/hooks-ca/im';
import { Button, Form, Input, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import SettingHeader from 'pages/components/SettingHeader';
import { useNavigate, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import UploadAvatar from 'pages/components/UploadAvatar';
import { RcFile } from 'antd/lib/upload/interface';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import { useLoading } from 'store/Provider/hooks';
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
  const [name, setName] = useState<string>(groupInfo?.name || '');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const updateChannelInfo = useUpdateChannelInfo();
  const [file, setFile] = useState<RcFile>();
  const { setLoading } = useLoading();
  const handleInputValueChange = useCallback(
    (v: string) => {
      setValidName({ validateStatus: '', errorMsg: '' });
      if (!v.trim()) {
        setDisabled(true);
      } else {
        setName(v);
        if (file) {
          setDisabled(false);
        } else {
          setDisabled(v === groupInfo?.name);
        }
      }
    },
    [file, groupInfo?.name],
  );
  useEffect(() => {
    setDisabled(!file);
  }, [file]);
  const onFinish = useCallback(async () => {
    try {
      setLoading(true);
      let s3Url = groupInfo?.icon || '';
      if (file) {
        s3Url = await uploadImageToS3(file);
      }
      await updateChannelInfo(`${channelUuid}`, `${name?.trim()}`, s3Url);
      message.success('Group name update');
      navigate(-1);
    } catch (error) {
      message.error('Failed to update group name');
      console.log('===Failed to update group name', error);
    } finally {
      setLoading(false);
    }
  }, [channelUuid, file, groupInfo?.icon, name, navigate, setLoading, updateChannelInfo]);
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
          <div className="group-info-avatar flex-center">
            <UploadAvatar avatarUrl={groupInfo?.icon} getFile={setFile} uploadText="Set New Photo" size="large" />
          </div>
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
