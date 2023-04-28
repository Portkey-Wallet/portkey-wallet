import AccountSettings from '.';
import Biometric from './Biometric';

const stackNav = [
  {
    name: 'AccountSettings',
    component: AccountSettings,
  },
  {
    name: 'Biometric',
    component: Biometric,
  },
] as const;

export default stackNav;
