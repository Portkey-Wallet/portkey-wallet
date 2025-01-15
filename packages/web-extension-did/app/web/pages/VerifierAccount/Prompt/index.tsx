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
    <div className={clsx('verifier-account', isBigScreenPrompt ? 'big-screen-verifier-account' : '')}>
      {isBigScreenPrompt ? (
        <>
          <SecondPageHeader className="guardian-header" title="" leftCallBack={onBack} />
          {renderContent}
        </>
      ) : (
        <PortKeyTitle leftElement leftCallBack={onBack} renderContent={renderContent} />
      )}
    </div>
  );
};

export default VerifierAccountPrompt;
