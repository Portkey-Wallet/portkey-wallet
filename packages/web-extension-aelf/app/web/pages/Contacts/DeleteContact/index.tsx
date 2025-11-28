import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CommonModal from 'components/CommonModal';
import './index.less';

interface DeleteContact {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteContact({ open, onCancel, onConfirm }: DeleteContact) {
  const { t } = useTranslation();

  return (
    <CommonModal className="delete-contact-modal" closable={false} width={320} open={open} title={t('Confirm Delete?')}>
      <div className="text-center modal-content">
        <div>
          {t('After the contact is deleted, all relevant information of the contact will be deleted synchronously')}
        </div>
      </div>
      <div className="flex-between modal-footer">
        <Button type="default" onClick={onCancel}>
          {t('No')}
        </Button>
        <Button type="primary" onClick={onConfirm}>
          {t('Yes')}
        </Button>
      </div>
    </CommonModal>
  );
}
