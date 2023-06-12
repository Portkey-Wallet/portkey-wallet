import DiscoverSearch from './DiscoverSearch';
import Browser from './Browser';
import DiscoverHome from './DiscoverHome';

const stackNav = [
  { name: 'DiscoverSearch', component: DiscoverSearch },
  { name: 'Browser', component: Browser },
  { name: 'DiscoverHome', component: DiscoverHome },
] as const;

export default stackNav;
