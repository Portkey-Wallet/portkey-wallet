import CustomSvg from 'components/CustomSvg';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import './index.less';

export default function PortKeyTitle({
  leftElement,
  leftCallBack,
  rightElement,
}: {
  leftElement?: ReactNode | boolean;
  rightElement?: ReactNode;
  leftCallBack?: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const defaultEle = useMemo(
    () => (
      <div className="flex-row-center default-left-ele">
        <CustomSvg type="BackLeft" className="left-arrow" />
        <span>{t('Back')}</span>
      </div>
    ),
    [t],
  );

  return (
    <>
      <div className="flex-row-center portkey-title-wrapper">
        <div className="flex-row-center title-left">
          <CustomSvg type="Logo2" className="portkey-logo" />
        </div>
        <div className="right-element">{rightElement}</div>
      </div>
      {leftElement && (
        <div
          className="left-element"
          onClick={() => {
            leftCallBack ? leftCallBack?.() : navigate(-1);
          }}>
          {typeof leftElement === 'boolean' ? defaultEle : leftElement}
        </div>
      )}
    </>
  );
}
