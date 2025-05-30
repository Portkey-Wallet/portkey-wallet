import CommonHeader from 'components/CommonHeader';
import { ReactNode } from 'react';
import './index.less';

export interface IGuardianProps {
  headerTitle: string;
  showAddBtn: boolean;
  onAdd: () => void;
  onBack: () => void;
  renderGuardianList: ReactNode;
  renderGuardianTip?: ReactNode;
}

const GuardiansPopup = (props: IGuardianProps) => {
  const { headerTitle, showAddBtn, onAdd, onBack, renderGuardianList, renderGuardianTip } = props;
  return (
    <div className="guardians-popup min-width-max-height flex-column">
      <CommonHeader
        title={headerTitle}
        onLeftBack={onBack}
        rightElementList={
          showAddBtn
            ? [
                {
                  customSvgType: 'SuggestAdd',
                  onClick: onAdd,
                },
              ]
            : undefined
        }
      />
      <div className="guardians-content flex-column-between flex-1">
        <div className="content-guardian-list flex-1">{renderGuardianList}</div>
        <div className="content-guardian-tip flex">{renderGuardianTip}</div>
      </div>
    </div>
  );
};

export default GuardiansPopup;
