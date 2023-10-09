import { BaseHeaderProps } from 'types/UI';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import TransferSettingsBody, { ITransferSettingsBodyProps } from '../../components/TransferSettingsBody';

export default function TransferSettingsPopup({
  headerTitle,
  goBack,
  form,
  state,
  onEdit,
}: BaseHeaderProps & ITransferSettingsBodyProps) {
  return (
    <div className="transfer-settings-popup min-width-max-height">
      <div className="popup-header-wrap">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <TransferSettingsBody form={form} state={state} onEdit={onEdit} />
    </div>
  );
}
