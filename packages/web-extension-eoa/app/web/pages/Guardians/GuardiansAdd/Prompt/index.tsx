import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianAddPromptProps {
  onBack: () => void;
  renderContent: ReactNode;
  headerTitle: string;
}

export const GuardianAddPrompt = ({ onBack, headerTitle, renderContent }: IGuardianAddPromptProps) => {
  return (
    <div className="add-guardian-page add-guardian-prompt flex-column">
      <SecondPageHeader className="guardian-header" title={headerTitle} leftCallBack={onBack} />
      {renderContent}
    </div>
  );
};

export default GuardianAddPrompt;
