import { BaseHeaderProps } from 'types/UI';
import CommonHeader from 'components/CommonHeader';
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
      <CommonHeader className="popup-header-wrap" title={headerTitle} onLeftBack={goBack} />
      <TransferSettingsBody form={form} state={state} onEdit={onEdit} />
    </div>
  );
}
