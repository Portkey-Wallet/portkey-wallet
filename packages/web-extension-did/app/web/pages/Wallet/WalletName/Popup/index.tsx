import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { BaseHeaderProps } from 'types/UI';
import SetWalletNameForm from '../../components/SetWalletNameForm';
import './index.less';

export default function WalletNamePopup({ headerTitle, goBack }: BaseHeaderProps) {
  return (
    <div className="wallet-name-popup min-width-max-height">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <SetWalletNameForm />
    </div>
  );
}
