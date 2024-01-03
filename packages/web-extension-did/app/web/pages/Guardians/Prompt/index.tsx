import SecondPageHeader from 'pages/components/SecondPageHeader';
import { ReactNode } from 'react';
import { Outlet } from 'react-router';
import './index.less';

export interface IGuardianProps {
  headerTitle: string;
  renderAddBtn?: ReactNode;
  renderGuardianList: ReactNode;
  renderGuardianTip?: ReactNode;
}

const GuardiansPrompt = ({ headerTitle, renderAddBtn, renderGuardianList, renderGuardianTip }: IGuardianProps) => {
  return (
    <div className="guardians-prompt flex">
      <div className="guardians-body flex-column">
        <SecondPageHeader
          className="guardians-header"
          paddingLeft={12}
          title={headerTitle}
          leftElement={false}
          rightElement={renderAddBtn}
        />
        <div className="guardians-content flex-column-between flex-1">
          <div className="content-guardian-list flex-1">{renderGuardianList}</div>
          <div className="content-guardian-tip flex">{renderGuardianTip}</div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default GuardiansPrompt;
