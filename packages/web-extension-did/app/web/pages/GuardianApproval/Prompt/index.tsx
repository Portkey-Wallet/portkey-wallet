import clsx from 'clsx';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import CommonTooltip from 'components/CommonTooltip';
import { useTranslation } from 'react-i18next';
import './index.less';
export interface IGuardianApprovalPromptProps {
  onBack: () => void;
  isBigScreenPrompt: boolean;
  renderContent: ReactNode;
}

const GuardianApprovalPrompt = ({ isBigScreenPrompt, onBack, renderContent }: IGuardianApprovalPromptProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'guardian-approval-wrapper flex-column',
        isBigScreenPrompt ? 'big-screen-guardian-approval' : '',
      )}>
      {isBigScreenPrompt ? (
        <>
          <SecondPageHeader className="guardian-header" title="" leftCallBack={onBack} />
          {renderContent}
        </>
      ) : (
        <PortKeyTitle
          leftElement
          leftCallBack={onBack}
          renderContent={renderContent}
          renderRightContent={
            <span className="flex-row-center">
              {/* TODO: tooltip styles */}
              <CommonTooltip placement="top" title={t('guardianApprovalTip')} />
            </span>
          }
        />
      )}
    </div>
  );
};

export default GuardianApprovalPrompt;
