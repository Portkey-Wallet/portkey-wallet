import { forwardRef, useImperativeHandle } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.less';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';

interface PhotoSendModalProps {
  open: boolean;
  url: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const ImageSendModal = forwardRef(({ open, url, onConfirm, onCancel }: PhotoSendModalProps, ref) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    setLoading,
  }));

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (e) {
      console.log('===send image error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      destroyOnClose
      className="portkey-image-send-modal"
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
});

export default ImageSendModal;
