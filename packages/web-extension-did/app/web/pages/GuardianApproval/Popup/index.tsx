import CommonHeader from 'components/CommonHeader';
import { GuardianApproveHelpUrl } from 'constants/guardians';
import { ReactNode, useCallback } from 'react';

export interface IGuardianApprovalPopupProps {
  onBack: () => void;
  renderContent: ReactNode;
}

const GuardianApprovalPopup = ({ onBack, renderContent }: IGuardianApprovalPopupProps) => {
  const onClickHelp = useCallback(() => {
    const openWinder = window.open(GuardianApproveHelpUrl, '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, []);
  return (
    <div className="guardian-approval-wrapper popup-page min-width-max-height">
      <CommonHeader
        className="guardian-approval-header"
        onLeftBack={onBack}
        rightElementList={[
          {
            customSvgType: 'help',
            onClick: onClickHelp,
          },
        ]}
      />
      {renderContent}
    </div>
  );
};

export default GuardianApprovalPopup;
