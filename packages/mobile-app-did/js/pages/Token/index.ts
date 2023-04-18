import ManageTokenList from './ManageTokenList';
import TokenDetail from './TokenDetail/index';

const stackNav = [
  { name: 'ManageTokenList', component: ManageTokenList },
  { name: 'TokenDetail', component: TokenDetail },
] as const;

export default stackNav;
