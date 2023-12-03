import { BaseHeaderProps } from 'types/UI';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
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
      <div className="popup-header-wrap">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
