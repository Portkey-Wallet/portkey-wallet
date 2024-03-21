import AccountSettings from '.';
import Biometric from './Biometric';
import ChatPrivacyNav from './ChatPrivacy/router';

const stackNav = [
  {
    name: 'AccountSettings',
    component: AccountSettings,
  },
  {
    name: 'Biometric',
    component: Biometric,
  },
  ...ChatPrivacyNav,
] as const;

export default stackNav;
