import ChatPrivacyNav from './ChatPrivacy/router';
import AboutUs from './AboutUs';
import TokenAllowanceDetail from './TokenAllowance/TokenAllowanceDetail';
import TokenAllowanceHome from './TokenAllowance';

const stackNav = [
  {
    name: 'AboutUs',
    component: AboutUs,
  },
  {
    name: 'TokenAllowanceHome',
    component: TokenAllowanceHome,
  },
  {
    name: 'TokenAllowanceDetail',
    component: TokenAllowanceDetail,
  },
  ...ChatPrivacyNav,
] as const;

export default stackNav;
