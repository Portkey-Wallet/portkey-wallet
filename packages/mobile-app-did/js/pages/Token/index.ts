import ManageTokenList from './ManageTokenList';
import SearchTokenList from './SearchTokenList';
import TokenDetail from './TokenDetail/index';
import CustomToken from './CustomToken/index';

const stackNav = [
  { name: 'ManageTokenList', component: ManageTokenList },
  { name: 'TokenDetail', component: TokenDetail },
  { name: 'CustomToken', component: CustomToken },
  { name: 'SearchTokenList', component: SearchTokenList },
] as const;

export default stackNav;
