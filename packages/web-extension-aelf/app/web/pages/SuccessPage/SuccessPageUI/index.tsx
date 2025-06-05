import CustomSvg from 'components/CustomSvg';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import { useTranslation } from 'react-i18next';
import { SuccessPageType } from 'types/UI';
import { CommonButton } from '@portkey/did-ui-react';
import './index.less';

export default function SuccessPageUI({ type, onConfirm }: { type?: SuccessPageType; onConfirm?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="success-page-wrapper flex-1">
      <PortKeyTitle
        renderContent={
          <div className="success-page-content">
            <CustomSvg type="ActivitySuccess" className="congratulations-icon" />
            {type === SuccessPageType.Created && <h1>{t('You have successfully logged into your wallet!')}</h1>}
            {type === SuccessPageType.Login && <h1>{t('You are now logged in to your Portkey!')}</h1>}
            <CommonButton className="open-btn" type="primaryOutline" onClick={onConfirm}>
              Open Portkey
            </CommonButton>
          </div>
        }
      />
      <div className="created-tip-wrapper">
        <div className="created-tip-content">
          <div className="tip-wrapper tip1">
            <div className="tip-title">Click the browser extension icon</div>
            <CustomSvg type="SuccessTip1" />
          </div>
          <div className="tip-wrapper tip2">
            <div className="tip-title">Pin Portkey</div>
            <CustomSvg type="SuccessTip2" />
          </div>
          <div className="tip3">Click at the top right of your browser and pin Portkey for easy access</div>
        </div>
      </div>
    </div>
  );
}
