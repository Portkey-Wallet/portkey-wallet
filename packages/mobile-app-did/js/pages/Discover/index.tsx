import DiscoverSearch from './DiscoverSearch';
import Browser from './Browser';

const stackNav = [
  { name: 'DiscoverSearch', component: DiscoverSearch },
  { name: 'Browser', component: Browser },
] as const;

export default stackNav;
