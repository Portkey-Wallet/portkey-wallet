import { request } from '@portkey-wallet/api/api-did';
import { useServiceSuspension } from '@portkey-wallet/hooks/hooks-ca/cms';
import CustomSvg from 'components/CustomSvg';
import { upgradeModalContent, upgradeModalTitle } from 'constants/upgrade';
import CustomModal from 'pages/components/CustomModal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface IUpgradeModalProps {
  forceShow?: boolean;
}

export function useUpgradeModal(props?: IUpgradeModalProps) {
  const { forceShow = false } = props || {};
  const { t } = useTranslation();
  const serviceSuspension = useServiceSuspension();
  const [show, setShow] = useState(forceShow);

  const showUpgrade = useCallback(async () => {
    try {
      const { isPopup } = await request.wallet.getSuspendV1Info({ params: { version: 'V1' } });
      setShow(!isPopup);
    } catch (error) {
      console.log('===getSuspendV1Info error', error);
    }
  }, []);
  const handleCancel = useCallback(async () => {
    request.wallet.setSuspendV1Info({ params: { version: 'V1' } });
  }, []);

  const toUpgrade = useCallback(async () => {
    try {
      await handleCancel();
    } catch (error) {
      console.log('===setSuspendV1Info error', error);
    }
    const openWinder = window.open(serviceSuspension?.extensionUrl, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [handleCancel, serviceSuspension?.extensionUrl]);

  useEffect(() => {
    if (!forceShow) {
      showUpgrade();
    }
  }, [forceShow, showUpgrade]);

  return useCallback(() => {
    if (show) {
      CustomModal({
        className: 'upgrade-modal',
        type: 'confirm',
        content: (
          <div className="upgrade-modal-container">
            <CustomSvg type="Upgrade" />
            <div className="modal-title">{upgradeModalTitle}</div>
            <div className="modal-content flex-column">
              {upgradeModalContent.map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>
          </div>
        ),
        cancelText: t('Not Now'),
        okText: t('Download'),
        onOk: toUpgrade,
        onCancel: handleCancel,
      });
    }
  }, [handleCancel, show, t, toUpgrade]);
}
