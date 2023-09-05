import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';
import TransferSettingsBody, { ITransferSettingsBodyProps } from '../../components/TransferSettingsBody';

export default function TransferSettingsPrompt({
  headerTitle,
  goBack,
  state,
  onEdit,
}: BaseHeaderProps & ITransferSettingsBodyProps) {
  return (
    <div className="three-level-prompt-container transfer-settings-prompt">
      <div className="three-level-prompt-body transfer-settings-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        <TransferSettingsBody state={state} onEdit={onEdit} />
      </div>
      <Outlet />
    </div>
  );
}
