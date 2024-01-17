import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import DeleteContact from 'pages/Contacts/DeleteContact';
import clsx from 'clsx';
import './index.less';
import { useCallback, useState } from 'react';
import { useDeleteContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useNavigate } from 'react-router';
import { EditContactItemApiType } from '@portkey-wallet/types/types-ca/contact';
import singleMessage from 'utils/singleMessage';

interface IEditButtonGroupProps {
  className?: string;
  data: EditContactItemApiType;
  cantSave: boolean;
}
export default function EditButtonGroup({ className, data, cantSave }: IEditButtonGroupProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [delOpen, setDelOpen] = useState<boolean>(false);
  const deleteContactApi = useDeleteContact();

  const handleDelConfirm = useCallback(async () => {
    await deleteContactApi(data);
    switch (data?.from) {
      case 'chat-box':
        navigate(`/chat-box/${data?.channelUuid}`);
        break;
      case 'chat-box-group':
        navigate(`/chat-box-group/${data?.channelUuid}`);
        break;
      case 'chat-group-info':
        navigate(`/chat-group-info/${data?.channelUuid}`);
        break;
      case 'chat-member-list':
        navigate(`/chat-group-info/${data?.channelUuid}/member-list`);
        break;
      default:
        navigate('/setting/contacts');
    }
    singleMessage.success('Contact deleted successfully');
  }, [data, deleteContactApi, navigate]);

  return (
    <div className={clsx(['edit-button-group', className])}>
      <div className="flex-between form-btn-edit">
        <Button
          danger
          onClick={() => {
            setDelOpen(true);
          }}>
          {t('Delete')}
        </Button>
        <Button htmlType="submit" type="primary" disabled={cantSave}>
          {t('Save')}
        </Button>
      </div>
      <DeleteContact
        open={delOpen}
        onCancel={() => {
          setDelOpen(false);
        }}
        onConfirm={handleDelConfirm}
      />
    </div>
  );
}
