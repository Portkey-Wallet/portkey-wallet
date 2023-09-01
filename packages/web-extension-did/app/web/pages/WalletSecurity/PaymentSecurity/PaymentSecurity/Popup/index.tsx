import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import './index.less';
import { IPaymentSecurityProps } from '..';
import PaymentSecurityList from '../../components/PaymentSecurityList';

export default function PaymentSecurityPopup({ headerTitle, goBack, list, clickItem }: IPaymentSecurityProps) {
  return (
    <div className="payment-security-popup min-width-max-height">
      <div className="payment-security-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      <div>
        <PaymentSecurityList list={list} clickItem={clickItem} />
      </div>
    </div>
  );
}
