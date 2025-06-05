import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';
import './index.less';

export interface IPreviewImage {
  src: string;
  width: number;
  height: number;
}
interface PhotoSendModalProps {
  open: boolean;
  file?: IPreviewImage;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const ImageSendModal = forwardRef(({ open, file, onConfirm, onCancel }: PhotoSendModalProps, ref) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    setLoading,
  }));

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (e) {
      console.log('===send image error', e);
    } finally {
      setLoading(false);
    }
  }, [onConfirm]);

  return (
    <CommonModal
      destroyOnClose
      className="portkey-image-send-modal"
      closable={false}
      width={320}
      open={open}
      footer={
        <div className="flex modal-footer">
          <Button type="default" onClick={onCancel} disabled={loading}>
            {t('Cancel')}
          </Button>
          <Button type="primary" className="send-image-btn" onClick={handleConfirm} loading={loading}>
            {!loading && t('Send')}
          </Button>
        </div>
      }>
      <div className="modal-content flex-center">
        <img src={file?.src} alt="image-send" style={{ width: file?.width, height: file?.height }} />
      </div>
    </CommonModal>
  );
});

export default ImageSendModal;
