import CustomSvg from 'components/CustomSvg';
import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router';
import './index.less';
import clsx from 'clsx';

export default function PortKeyTitle({
  leftElement,
  leftCallBack,
  rightElement,
  renderContent,
  renderRightContent,
  hideSubtitle,
  hidePortKeyLogo,
}: {
  renderRightContent?: ReactNode | boolean;
  renderContent?: ReactNode | boolean;
  leftElement?: ReactNode | boolean;
  rightElement?: ReactNode;
  leftCallBack?: () => void;
  hideSubtitle?: boolean;
  hidePortKeyLogo?: boolean;
}) {
  const navigate = useNavigate();

  const defaultEle = useMemo(
    () => (
      <div className="flex-row-center default-left-ele">
        <CustomSvg type="BackLeft" className="left-arrow" />
      </div>
    ),
    [],
  );

  return (
    <>
      {!hidePortKeyLogo && rightElement && (
        <div className="flex-row-center portkey-title-wrapper">
          {!hidePortKeyLogo && (
            <div className="flex-row-center title-left">
              <CustomSvg type="PortKeyPrompt" className="portkey-logo" />
            </div>
          )}
          <div className="right-element">{rightElement}</div>
        </div>
      )}
      {renderContent ? (
        <div className="register-common-card margin-auto margin-top-64">
          {hideSubtitle ? null : (
            <div
              className={clsx('flex-row-center flex-row-between header-back-element')}
              onClick={() => {
                leftCallBack ? leftCallBack?.() : navigate(-1);
              }}>
              {typeof leftElement === 'boolean' ? defaultEle : leftElement}
              {renderRightContent}
            </div>
          )}
          {renderContent}
        </div>
      ) : (
        <div
          className={clsx('left-element', !leftElement && 'left-element-hidden')}
          onClick={() => {
            leftCallBack ? leftCallBack?.() : navigate(-1);
          }}>
          {typeof leftElement === 'boolean' ? defaultEle : leftElement}
        </div>
      )}
    </>
  );
}
