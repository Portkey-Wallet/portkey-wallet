import SecondPageHeader from 'pages/components/SecondPageHeader';
import { Outlet } from 'react-router';
import { BaseHeaderProps } from 'types/UI';
import './index.less';
import TransferSettingsEditBody, { ITransferSettingsEditBodyProps } from '../../components/TransferSettingsEditBody';

export default function TransferSettingsEditPrompt({
  headerTitle,
  goBack,
  form,
  restrictedValue,
  state,
  disable,
  validSingleLimit,
  validDailyLimit,
  onRestrictedChange,
  onSingleLimitChange,
  onDailyLimitChange,
  onFinish,
}: BaseHeaderProps & ITransferSettingsEditBodyProps) {
  return (
    <div className="three-level-prompt-container transfer-settings-edit-prompt">
      <div className="three-level-prompt-body transfer-settings-edit-prompt-body">
        <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
        <TransferSettingsEditBody
          form={form}
          restrictedValue={restrictedValue}
          state={state}
          disable={disable}
          validSingleLimit={validSingleLimit}
          validDailyLimit={validDailyLimit}
          onRestrictedChange={onRestrictedChange}
          onSingleLimitChange={onSingleLimitChange}
          onDailyLimitChange={onDailyLimitChange}
          onFinish={onFinish}
        />
      </div>
      <Outlet />
    </div>
  );
}
