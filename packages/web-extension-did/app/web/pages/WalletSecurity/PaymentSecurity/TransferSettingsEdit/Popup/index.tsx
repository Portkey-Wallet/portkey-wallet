import { BaseHeaderProps } from 'types/UI';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import TransferSettingsEditBody, { ITransferSettingsEditBodyProps } from '../../components/TransferSettingsEditBody';

export default function TransferSettingsEditPopup({
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
    <div className="transfer-settings-edit-popup min-width-max-height">
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
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
  );
}
