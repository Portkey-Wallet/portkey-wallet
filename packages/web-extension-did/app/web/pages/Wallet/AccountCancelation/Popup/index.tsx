import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { IAccountCancelationProps } from '..';
import './index.less';

export default function AccountCancelationPopup({ headerTitle, goBack, renderContent }: IAccountCancelationProps) {
  return (
    <div className="account-cancelation-popup">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      {renderContent}
    </div>
  );
}
