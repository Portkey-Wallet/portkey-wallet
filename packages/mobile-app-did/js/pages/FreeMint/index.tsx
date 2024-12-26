import MintHome from './MintHome';
import MintProcess from './MintProcess';

const stackNav = [
  { name: 'FreeMintHome', component: MintHome },
  { name: 'MintProcess', component: MintProcess },
] as const;

export default stackNav;
