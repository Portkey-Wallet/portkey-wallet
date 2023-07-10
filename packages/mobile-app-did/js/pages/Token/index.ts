import ManageTokenList from './ManageTokenList';
import TokenDetail from './TokenDetail/index';
import CustomToken from './CustomToken/index';

const stackNav = [
  { name: 'ManageTokenList', component: ManageTokenList },
  { name: 'TokenDetail', component: TokenDetail },
  { name: 'CustomToken', component: CustomToken },
] as const;

export default stackNav;
