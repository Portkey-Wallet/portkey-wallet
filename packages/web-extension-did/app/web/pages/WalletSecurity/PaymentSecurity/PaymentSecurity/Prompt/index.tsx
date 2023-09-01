import SecondPageHeader from 'pages/components/SecondPageHeader';
// import { Outlet } from 'react-router';
import './index.less';
import { IPaymentSecurityProps } from '..';
import PaymentSecurityList from '../../components/PaymentSecurityList';

export default function PaymentSecurityPrompt({ headerTitle, goBack, list, clickItem }: IPaymentSecurityProps) {
  return (
    <div className="payment-security-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      <div className="payment-security-prompt-body">
        <PaymentSecurityList list={list} clickItem={clickItem} />
      </div>
      {/* <Outlet /> */}
    </div>
  );
}
