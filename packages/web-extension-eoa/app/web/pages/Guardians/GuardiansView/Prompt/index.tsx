import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianViewPromptProps {
  headerTitle: string;
  renderContent: ReactNode;
  onBack: () => void;
}

const GuardianViewPrompt = ({ headerTitle, renderContent, onBack }: IGuardianViewPromptProps) => {
  return (
    <div className="guardian-view-prompt">
      <div className="guardian-view-body flex-column">
        <SecondPageHeader className="guardian-view-header" title={headerTitle} leftCallBack={onBack} />
        {renderContent}
      </div>
    </div>
  );
};

export default GuardianViewPrompt;
