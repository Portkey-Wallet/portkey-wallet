import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';

export default function TransferSettingsPrompt({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="transfer-settings-prompt">
      <div className="transfer-settings-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        {/* list */}
      </div>
      <Outlet />
    </div>
  );
}
