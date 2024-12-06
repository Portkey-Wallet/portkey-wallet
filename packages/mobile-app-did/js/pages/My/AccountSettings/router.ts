import ChatPrivacyNav from './ChatPrivacy/router';
import AboutUs from './AboutUs';
import TokenAllowanceDetail from './TokenAllowance/TokenAllowanceDetail';
import TokenAllowanceHome from './TokenAllowance';
import DappList from './DappList';
import DappDetail from './DappList/DappDetail';

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
  {
    name: 'DappList',
    component: DappList,
  },
  {
    name: 'DappDetail',
    component: DappDetail,
  },
  ...ChatPrivacyNav,
] as const;

export default stackNav;
