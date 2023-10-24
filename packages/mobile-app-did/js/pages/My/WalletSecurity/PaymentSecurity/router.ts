import PaymentSecurityList from './';
import PaymentSecurityDetail from './PaymentSecurityDetail';
import PaymentSecurityEdit from './PaymentSecurityEdit';

const stackNav = [
  {
    name: 'PaymentSecurityList',
    component: PaymentSecurityList,
  },
  {
    name: 'PaymentSecurityDetail',
    component: PaymentSecurityDetail,
  },
  {
    name: 'PaymentSecurityEdit',
    component: PaymentSecurityEdit,
  },
] as const;

export default stackNav;
