import clsx from 'clsx';
import PortKeyTitle from 'pages/components/PortKeyTitle';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IVerifierAccountPromptProps {
  renderContent: ReactNode;
  onBack: () => void;
  isBigScreenPrompt: boolean;
}

const VerifierAccountPrompt = ({ renderContent, onBack, isBigScreenPrompt }: IVerifierAccountPromptProps) => {
  return (
    <div
      className={clsx('verifier-account-wrapper', isBigScreenPrompt ? 'big-screen-verifier-account' : 'common-page')}>
      {isBigScreenPrompt ? (
        <SecondPageHeader className="guardian-header" title="" leftCallBack={onBack} />
      ) : (
        <PortKeyTitle leftElement leftCallBack={onBack} />
      )}
      {renderContent}
    </div>
  );
};

export default VerifierAccountPrompt;
