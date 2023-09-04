import { BaseHeaderProps } from 'types/UI';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import TransferSettingsBody, { ITransferSettingsBodyProps } from '../../components/TransferSettingsBody';

export default function TransferSettingsPopup({
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
    <div className="transfer-settings-popup min-width-max-height">
      <div className="transfer-settings-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
  );
}
