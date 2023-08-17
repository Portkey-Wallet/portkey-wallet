import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';

interface PhotoSendModalProps {
  open: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PhotoSendModal({ open, url, onConfirm, onCancel }: PhotoSendModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm();
  };

  return (
    <CommonModal
      className="portkey-photo-send-modal"
      closable={false}
      width={320}
      open={open}
      footer={
        <div className="flex modal-footer">
          <Button type="default" onClick={onCancel}>
            {t('Cancel')}
          </Button>
          <Button type="primary" onClick={handleConfirm} loading={loading}>
            {!loading && t('Send')}
          </Button>
        </div>
      }>
      <div className="text-center modal-content">
        <img src={url} alt="image-send" />
      </div>
    </CommonModal>
  );
}
