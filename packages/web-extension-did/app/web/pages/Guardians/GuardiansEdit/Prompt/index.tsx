import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianEditPromptProps {
  onBack: () => void;
  renderContent: ReactNode;
  headerTitle: string;
}

const GuardianEditPrompt = ({ onBack, headerTitle, renderContent }: IGuardianEditPromptProps) => {
  return (
    <div className="flex-column edit-guardian-page edit-guardian-prompt">
      <div className="edit-guardian-title">
        <SecondPageHeader className="guardian-header" title={headerTitle} leftCallBack={onBack} />
      </div>
      {renderContent}
    </div>
  );
};

export default GuardianEditPrompt;
