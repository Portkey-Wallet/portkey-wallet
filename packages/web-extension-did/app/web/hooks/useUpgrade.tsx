import CustomSvg from 'components/CustomSvg';
import { upgradeModalContent, upgradeModalTitle } from 'constants/upgrade';
import CustomModal from 'pages/components/CustomModal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface IUpgradeModalProps {
  forceShow?: boolean;
}

export function useUpgradeModal(props?: IUpgradeModalProps) {
  const { forceShow = false } = props || {};
  const { t } = useTranslation();
  // TODO
  // const { showUpgrade, url } = useCms()
  const toUpgrade = useCallback(() => {
    // TODO
    // const openWinder = window.open(url, '_blank');
    // if (openWinder) {
    //   openWinder.opener = null;
    // }
  }, []);
  return useCallback(() => {
    // TODO
    if (forceShow) {
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
      });
    }
  }, [forceShow, t, toUpgrade]);
}
