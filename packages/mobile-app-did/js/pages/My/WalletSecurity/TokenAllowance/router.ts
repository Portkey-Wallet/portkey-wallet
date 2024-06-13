import TokenAllowanceHome from './';
import TokenAllowanceDetail from './TokenAllowanceDetail';

const stackNav = [
  {
    name: 'TokenAllowanceHome',
    component: TokenAllowanceHome,
  },
  {
    name: 'TokenAllowanceDetail',
    component: TokenAllowanceDetail,
  },
] as const;

export default stackNav;
