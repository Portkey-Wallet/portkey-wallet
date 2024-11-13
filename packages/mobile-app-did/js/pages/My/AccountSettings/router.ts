import Biometric from './Biometric';
import ChatPrivacyNav from './ChatPrivacy/router';

const stackNav = [
  {
    name: 'Biometric',
    component: Biometric,
  },
  ...ChatPrivacyNav,
] as const;

export default stackNav;
