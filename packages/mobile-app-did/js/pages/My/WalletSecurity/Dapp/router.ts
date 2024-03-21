import DappList from './';
import DappDetail from './DappDetail';

const stackNav = [
  {
    name: 'DappList',
    component: DappList,
  },
  {
    name: 'DappDetail',
    component: DappDetail,
  },
] as const;

export default stackNav;
