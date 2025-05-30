import clsx from 'clsx';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianApprovalPromptProps {
  onBack: () => void;
  isBigScreenPrompt: boolean;
  renderContent: ReactNode;
}

const GuardianApprovalPrompt = ({ isBigScreenPrompt, onBack, renderContent }: IGuardianApprovalPromptProps) => {
  return (
    <div
      className={clsx(
        'guardian-approval-wrapper flex-column',
        isBigScreenPrompt ? 'big-screen-guardian-approval' : 'common-page',
      )}>
      {isBigScreenPrompt ? (
        <SecondPageHeader className="guardian-header" title="" leftCallBack={onBack} />
      ) : (
        <PortKeyTitle leftElement leftCallBack={onBack} />
      )}
      {renderContent}
    </div>
  );
};

export default GuardianApprovalPrompt;
