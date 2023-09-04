import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';
import TransferSettingsBody, { ITransferSettingsBodyProps } from '../../components/TransferSettingsBody';

export default function TransferSettingsPrompt({
  headerTitle,
  goBack,
  state,
  disable,
  validSingleLimit,
  validDailyLimit,
  onSingleLimitChange,
  onDailyLimitChange,
  onFinish,
}: BaseHeaderProps & ITransferSettingsBodyProps) {
  return (
    <div className="transfer-settings-prompt">
      <div className="transfer-settings-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        <TransferSettingsBody
          state={state}
          disable={disable}
          validSingleLimit={validSingleLimit}
          validDailyLimit={validDailyLimit}
          onSingleLimitChange={onSingleLimitChange}
          onDailyLimitChange={onDailyLimitChange}
          onFinish={onFinish}
        />
      </div>
      <Outlet />
    </div>
  );
}
